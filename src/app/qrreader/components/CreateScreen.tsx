import React, { useState, useRef, useEffect } from 'react';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, TextInput, FlatList, NativeSyntheticEvent, TextInputKeyPressEventData, Alert } from 'react-native';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp, RouteProp, useFocusEffect } from '@react-navigation/native';

import NavBar from './NavBar';
import TopBar from './TopBar';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { addEntry } from '../services/database';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import ViewShot, { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import QRCode from 'react-native-qrcode-svg';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

import ShareSvgComponent from './svg_components/share';
import DownloadSvgComponent from './svg_components/download';
import HomeSvgComponent from './svg_components/home';
import JustQRSvgComponent from './svg_components/justQR';

type CreateScreenProps = {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
    db: SQLiteDatabase;
    setDb: (db: SQLiteDatabase) => void;
};

const { width, height } = Dimensions.get('window');

const CreateScreen = ({ navigation, route, db, setDb }: CreateScreenProps) => {

    const [selectedSegment, setSelectedSegment] = useState('Free Text');
    const [input, setInput] = useState('');
    const [QRtext, setQRtext] = useState<string | null>(null);
    const [capture, setCapture] = useState(false);
    const [saved, setSaved] = useState(false);
    const [share, setShare] = useState(false);
    const [download, setDownload] = useState(false);

    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const viewShotRef = useRef<ViewShot>(null);

    useEffect(() => {
        console.log({download});
        
        if (download && viewShotRef.current) {
            const onCapture = async () => {
                const uri = await viewShotRef.current?.capture?.();
                const timestamp = Date.now();
                const directoryPath = `${RNFetchBlob.fs.dirs.PictureDir}/QRCode`;
                const filePath = `${directoryPath}/qrcode_${timestamp}.png`;
                if (uri) {
                RNFetchBlob.fs.exists(directoryPath)
                    .then((exists) => {
                    if (!exists) {
                        RNFetchBlob.fs.mkdir(directoryPath)
                        .then(() => {
                            console.log('Directory created');
                            copyFile(uri, filePath);
                        })
                        .catch(err => console.log('Directory creation error:', err.message));
                    } else {
                        console.log('Directory already exists');
                        copyFile(uri, filePath);
                    }
                    })
                    .catch(err => console.log('Error checking directory:', err.message));
                } else {
                console.error('URI is undefined');
                }
            };
            onCapture();
            setDownload(false);
        }
    }, [download]);

    const copyFile = (uri: string, path: string) => {
        RNFetchBlob.fs.cp(uri, path)
        .then(() => {
            console.log('FILE WRITTEN!');
            Alert.alert(
                'QR Code Saved',
                'Your QR code has been successfully saved in the Pictures > QRCode folder.',
                [{ text: 'OK' }]
            );
        })
        .catch(err => console.log('Error copying file:', err.message));
    };

    useEffect(() => {
        console.log({share});
        
        if (share && viewShotRef.current) {
            const onCapture = async () => {
                const uri = await viewShotRef.current?.capture?.();
                const path = `${RNFetchBlob.fs.dirs.CacheDir}/qrcode.png`;
                if (uri) {
                    RNFetchBlob.fs.cp(uri, path)
                    .then(success => {
                        console.log('FILE WRITTEN!', success);
                        let shareOptions = {
                            title: "QR Code",
                            url: `file://${path}`,
                            type: 'image/png'
                        };
                        Share.open(shareOptions)
                        .then((res) => console.log('res:', res))
                        .catch(err => console.log('err', err));
                    })
                    .catch(err => console.log(err.message));
                } else {
                    console.error('URI is undefined');
                }
            };
            onCapture();
            setShare(false);
        }
    }, [share]);   
    
    useFocusEffect(
        React.useCallback(() => {
            // Code to run when the screen is focused
            setSaved(false);
            setDescription('');
            setTags([]);

            // Optional: Return a function to run when the screen loses focus
            return () => {
                // console.log('Screen is unfocused');
            };
        }, [])
    );

    const handlePress = (segment: React.SetStateAction<string>) => {
        setSelectedSegment(segment);
    };

    const handleInputChange = (text: string) => {
        // If the user typed a space, add the current input as a new tag
        if (text.endsWith(' ')) {
            setTags([...tags, input.trim()]);
            setInput('');
        } else if (input === '' && text === '' && tags.length > 0) {
            // If the user pressed backspace and the input is empty, remove the last tag and append it to the input
            const newTags = [...tags];
            const removedTag = newTags.pop();
            setTags(newTags);
            setInput(removedTag || ''); // Provide a default value of an empty string if removedTag is undefined
        } else {
            setInput(text);
        }
    };

    const handleKeyPress = ({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if ((nativeEvent as unknown as React.KeyboardEvent<HTMLInputElement>).key === 'Backspace' && input === '' && tags.length > 0) {
            const newTags = [...tags];
            const removedTag = newTags.pop();
            setTags(newTags);
            // setInput(removedTag || ''); // Provide a default value of an empty string if removedTag is undefined
        }
    };

    const handleDownloadAndSave = async () => {
        // Create Database entry with date and description
        console.log('Saving in Database');

        // create a unique reference for the entry starting with (^_^)
        const reference = "(^_^)" + Date.now().toString() + Math.random().toString(36).substring(7);

        setQRtext(reference)

        // TODO uncomment
        addEntry(db, reference, null, null, null, description, null, tags.join(';'))
        .then(() => {
            // navigation.navigate("DBList")
            console.log('Entry added successfully');
        })
        .catch((error) => {
            console.error('Error adding entry:', error);
        });

        // TODO Create QR-Code and save it to phone
        // setCapture(true)
        setSaved(true)

        console.log('QR-Code created');
        

    };

    return (
        <View style={styles.container}>
            <TopBar title="Create QR-Code" />
            {!saved &&
                <View style={styles.main}>
                    <View style={styles.switchContainer}>
                        <TouchableOpacity onPress={() => handlePress('Free Text')} style={selectedSegment === 'Free Text' ? styles.selectedLeft : styles.unselectedLeft}>
                            <Text style={selectedSegment === 'Free Text' ? styles.textSelected : styles.textUnselected}>Free Text</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress('Structured Input')} style={selectedSegment === 'Structured Input' ? styles.selectedRight : styles.unselectedRight}>
                            <Text style={selectedSegment === 'Structured Input' ? styles.textSelected : styles.textUnselected}>Structured Input</Text>
                        </TouchableOpacity>
                    </View>
                    { selectedSegment === 'Free Text' &&
                        <ScrollView contentContainerStyle={styles.wrapper} >
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setDescription}
                                    value={description}
                                    multiline={true}
                                    placeholder="Write your text or url here"
                                    placeholderTextColor="#888"
                                />
                            </View>
                            <View style={styles.tagsWrapper}>
                                {tags.map((tag, index) => (
                                    <Text key={index} style={styles.tag}>
                                    {tag}
                                    </Text>
                                ))}
                                <TextInput
                                    style={styles.tagsInput}
                                    onChangeText={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    value={input}
                                    placeholder={tags.length === 0 ? "Add tag by pressing spacebar" : ""}
                                    placeholderTextColor="#888"
                                />
                            </View>
                        </ScrollView>
                    }
                    { selectedSegment === 'Structured Input' &&
                        <ScrollView contentContainerStyle={styles.wrapper} >
                            <Text>Struct Text</Text>
                        </ScrollView>
                    }
                    <View style={styles.saveButtonsWrapper}>
                        <TouchableOpacity 
                            style={[styles.saveButton, description.trim() == "" && styles.disabledSaveButton]} 
                            onPress={description.trim() != "" ? handleDownloadAndSave : undefined}
                            disabled={description.trim() == ""}
                        >
                            <Text style={styles.saveButtonText}>Download and Save</Text>
                        </TouchableOpacity>
                    </View>
                    <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }} style={{ position: 'absolute', top: -1000 }}>
                        <QRCode
                            value={QRtext ?? 'no text provided'}
                            size={200}
                        />
                    </ViewShot>
                </View>
            }
            { saved &&
            // TODO show QR-Code
            // TODO create new QR-code button
            // TODO download button
            // TODO share button
            // TODO back to home button
                <View style={styles.main}>

                    {/* <View style={styles.qrCreated}>
                        <Text style={styles.qrCreatedText}>QR-Code created</Text>
                    </View> */}

                    <View style={styles.showQR}>
                        <QRCode
                            value={QRtext ?? ''}
                            size={width * 0.6}
                            color={colors.text}
                            backgroundColor={colors.primary}
                        />
                    </View>

                    <View style={styles.saveButtonWrapper}>
                        <View style={styles.saveButtons}>
                            <TouchableOpacity
                                style={styles.buttonPrimary}
                                onPress={() => setShare(true)}
                            >
                                <ShareSvgComponent color={colors.secondary} height={24} width={24} />
                                <Text style={styles.textPrimary}>Share</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonPrimary}
                                onPress={() => setDownload(true)}
                            >
                                <DownloadSvgComponent color={colors.secondary} height={24} width={24} />
                                <Text style={styles.textPrimary}>Download</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.continueButtons}>
                            <TouchableOpacity 
                                style={styles.buttonSecondary} 
                                onPress={() => navigation.navigate("Title")}
                            >
                                <HomeSvgComponent color={colors.accent} height={24} width={24} />
                                <Text style={styles.textSecondary}>Back to Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonSecondary}
                                onPress={() => {
                                    setSaved(false);
                                    setDescription('');
                                    setTags([]);
                                }}
                            >
                                <JustQRSvgComponent color={colors.accent} height={24} width={24} />
                                <Text style={styles.textSecondary}>Create new QR-Code</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }} style={{ position: 'absolute', top: -1000 }}>
                        <QRCode
                            value={QRtext ?? 'no text provided'}
                            size={200}
                        />
                    </ViewShot>

                </View>                
            }
            <NavBar navigation={navigation} active={[false, false, true, false]}/>
        </View>
    );
};

export default CreateScreen;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    main : {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'stretch',
        // backgroundColor: "red",
        padding: 30,
        paddingBottom: 0,
    },
    switchContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        overflow: 'hidden',
        // backgroundColor: "pink",
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 10,
    },
    selectedRight: {
        flex: 1,
        padding: 5,
        backgroundColor: colors.accent,
        borderColor: colors.accent,
        borderWidth: 1,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderLeftWidth: 0,
    },
    selectedLeft: {
        flex: 1,
        padding: 5,
        backgroundColor: colors.accent,
        borderColor: colors.accent,
        borderWidth: 1,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderRightWidth: 0,
    },
    unselectedLeft: {
        flex: 1,
        padding: 5,
        borderColor: colors.accent,
        borderWidth: 1,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderRightWidth: 0,
    },
    unselectedRight: {
        flex: 1,
        padding: 5,
        borderColor: colors.accent,
        borderWidth: 1,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderLeftWidth: 0,
    },
    textUnselected: {
        textAlign: 'center',
        color: colors.accent,
    },
    textSelected: {
        textAlign: 'center',
        color: colors.secondary,
    },
    wrapper: {
        // display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        // backgroundColor: "pink",
    },
    inputContainer: {
        flex: 1,
        // justifyContent: 'flex-start',
        paddingTop: 20,
        backgroundColor: colors.primary,
        width: '100%',
    },
    input: {
        flex: 1,
        // height: 40,
        borderColor: colors.text,
        borderWidth: 1,
        color: colors.text,
        fontSize: 16,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
        textAlign: 'left',
        width: '100%',
    },
    saveButtonsWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    saveButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.accent,
        padding: 15,
        borderRadius: 5,
        width: '50%',
    },
    disabledSaveButton: {
        // Example style for disabled button
        opacity: 0.5,
        backgroundColor: '#ccc', // Light grey, adjust as needed
    },
    saveButtonText: {
        color: colors.secondary,
        fontSize: 24,
        fontWeight: "400",
    },
    tagsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: colors.primary,
        width: '100%',
        borderColor: colors.text,
        borderWidth: 1,
        color: colors.text,
        fontSize: 16,
        borderRadius: 5,
        // padding: 10,
        textAlignVertical: 'top',
        textAlign: 'left',
        // backgroundColor: "pink",
        marginTop: 20,
        // make line break
        flexWrap: 'wrap',
    },
    tag: {
        borderColor: colors.text,
        borderWidth: 1,
        borderRadius: 5,
        // backgroundColor: colors.text,
        color: colors.text,
        padding: 5,
        margin: 5,
        textAlign: 'center',
        // paddingRight: 0,
        // marginRight: 0,
    },
    tagsInput: { 
        height: 40, 
        padding: 10,
        // paddingLeft: 0,
        // borderColor: 'gray', 
        // borderWidth: 1 
    },
    
    // buttons on finished screen
    qrCreated: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    qrCreatedText: {
        color: colors.text,
        fontSize: 24,
        fontWeight: '400',
    },
    showQR: {
        // flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "pink",
        margin: 20,
        marginBottom: 40,
    },
    saveButtonWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        // backgroundColor: "blue"
    },
    saveButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    buttonPrimary: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.accent,
        padding: 10,
        borderRadius: 5,
        width: '45%',
    },
    buttonSecondary: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        width: '100%',
        borderColor: colors.accent,
        borderWidth: 1,
    },
    textPrimary: {
        color: colors.secondary,
        fontSize: 16,
        fontWeight: "400",
        textAlign: 'center',
        marginLeft: 10,
    },
    textSecondary: {
        color: colors.accent,
        fontSize: 16,
        fontWeight: "400",
        textAlign: 'center',
        marginLeft: 10,
    },
    continueButtons: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
        // backgroundColor: "pink",
    },
});