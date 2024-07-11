import React, { useState, useRef, useEffect } from 'react';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, TextInput, FlatList, NativeSyntheticEvent, TextInputKeyPressEventData, Alert, ScrollView } from 'react-native';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp, RouteProp, useFocusEffect } from '@react-navigation/native';

import NavBar from './NavBar';
import TopBar from './TopBar';
import LinearGradient from 'react-native-linear-gradient';
// import { ScrollView } from 'react-native-gesture-handler';
import { addEntry, getExistingTags } from '../services/database';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import SQLite from 'react-native-sqlite-storage';
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

type TagEntry = {
    tags: string;
};

const { width, height } = Dimensions.get('window');

const getUniqueTags = async (db: SQLite.SQLiteDatabase) : Promise<string[]> => {
    const tagsArray = await getExistingTags(db);
    const allTags = tagsArray.flatMap(tagObj => {
        console.log({tagObj});
        return tagObj ? tagObj.split(';') : [];
    });
    const uniqueTags = Array.from(new Set(allTags)).filter(tag => tag.trim() !== '');
    return uniqueTags;
};

const CreateScreen = ({ navigation, route, db, setDb }: CreateScreenProps) => {

    const [selectedSegment, setSelectedSegment] = useState('Free Text');
    const [input, setInput] = useState('');
    const [QRtext, setQRtext] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [share, setShare] = useState(false);
    const [download, setDownload] = useState(false);
    const [existingTags, setExistingTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [topic, setTopic] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [subtitle, setSubtitle] = useState<string>("");
    const [description, setDescription] = useState('');
    const [additional, setAdditional] = useState<string>("");
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
    
    // reset all states when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            // Code to run when the screen is focused
            setSaved(false);
            setDescription('');
            // TODO uncomment when finished styling tags
            setSelectedTags([]);

            // Optional: Return a function to run when the screen loses focus
            return () => {
                // console.log('Screen is unfocused');
            };
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            // get all tags from database
            getUniqueTags(db).then((myTags) => {
                console.log(myTags);
                setTags(myTags);
                setExistingTags(myTags);

            }).catch((error) => {
                console.error('Error getting tags:', error);
            });

            return () => {
                getUniqueTags(db).then((myTags) => {
                    console.log(myTags);
                    setTags(myTags);
                    setExistingTags(myTags);
                }).catch((error) => {
                    console.error('Error getting tags:', error);
                });
            };
        }, [])
    );

    useEffect(() => {
        setTopic('');
        setTitle('');
        setSubtitle('');
        setDescription('');
        setAdditional('');
        setSelectedTags([]);

        getUniqueTags(db).then((myTags) => {
            console.log(myTags);
            setTags(myTags);
            setExistingTags(myTags);

        }).catch((error) => {
            console.error('Error getting tags:', error);
        });
    }, [selectedSegment]);

    const handlePress = (segment: React.SetStateAction<string>) => {
        setSelectedSegment(segment);
    };

    const handleInputChange = (text: string) => {
        // If the user typed a space, add the current input as a new tag
        if (text.endsWith(' ')) {
            if (input.trim() === '') {
                setInput('')
                return;
            }

            const currentInput = input.trim();
            setInput('');

            const index = tags.findIndex(tag => tag.toLowerCase() === currentInput.trim().toLowerCase());

            // if tags already contains the input, dont add it again
            if(index !== -1){
                setSelectedTags([...selectedTags, tags[index]]);
                return;
            }

            setTags([currentInput.trim(), ...tags]);
            setSelectedTags([...selectedTags, currentInput.trim()]);
        } 
        else {
            setInput(text);
        }
    };

    const handleTagToggle = (index: number) => {

        // if tags[index] is not in existingTags, remove it from tags
        if(!existingTags.includes(tags[index])){
            const newTags = [...tags];
            newTags.splice(index, 1);
            setTags(newTags);

            // also remove it from selectedTags
            const newSelectedTags = selectedTags.filter(tag => tag !== tags[index]);
            setSelectedTags(newSelectedTags);
            return;
        }

        // if tags[index] is in existingTags and not in selectedTags, add it to selectedTags
        if(!selectedTags.includes(tags[index])){
            setSelectedTags([...selectedTags, tags[index]]);
            return;
        }

        // if tags[index] is in selectedTags, remove it from selectedTags
        const newSelectedTags = selectedTags.filter(tag => tag !== tags[index]);
        setSelectedTags(newSelectedTags);

    }

    const handleDownloadAndSave = async () => {
        // Create Database entry with date and description
        console.log('Saving in Database');

        // create a unique reference for the entry starting with (^_^)
        const reference = "(^_^)" + Date.now().toString() + Math.random().toString(36).substring(7);

        // make all tags lower case and delete duplicates
        const tags = selectedTags.map(tag => tag.toLowerCase());
        const uniqueTags = Array.from(new Set(tags));

        // add free or structured to the start of the tags array
        // if(selectedSegment === 'Free Text'){
        //     tags.unshift('free');
        // } else {
        //     tags.unshift('structured');
        // }

        if(selectedSegment === 'Free Text'){
            setQRtext(description)
        } else {
            setQRtext(reference)
        }

        const myDescription = description.trim() === '' ? 'no description' : description;
        const myTopic = topic.trim() === '' ? null : topic;
        const myTitle = title.trim() === '' ? null : title;
        const mySubtitle = subtitle.trim() === '' ? null : subtitle;
        const myAdditional = additional.trim() === '' ? null : additional;

        addEntry(db, reference, myTopic, myTitle, mySubtitle, myDescription, myAdditional, uniqueTags.join(';'))
        .then(() => {
            // navigation.navigate("DBList")
            console.log('Entry added successfully');
        })
        .catch((error) => {
            console.error('Error adding entry:', error);
        });

        setSaved(true)

        console.log('QR-Code created');

    };

    const buttonActive = () : boolean => {
        if(selectedSegment === 'Free Text'){
            return description.trim() !== '';
        } else {
            return topic.trim() !== '' && title.trim() !== '' && description.trim() !== '';
        }
    }

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
                            <Text style={styles.inputDescription}>The content of the QR-Code *</Text>
                            <View style={{...styles.inputContainer, ...styles.descriptionInputContainer}}>
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
                                <Text style={styles.inputDescription}>Add tags to find your QR-Code faster</Text>
                                <TextInput
                                    style={styles.tagsInput}
                                    onChangeText={handleInputChange}
                                    // onKeyPress={handleKeyPress}
                                    value={input}
                                    placeholder={"Add tag by pressing space"}
                                    // placeholder={tags.length === 0 ? "Add tag by pressing spacebar" : ""}
                                    placeholderTextColor="#888"
                                />
                                {tags.map((tag, index) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        style={selectedTags.includes(tags[index]) ? styles.singleTagWrapperActive : styles.singleTagWrapperInactive} 
                                        onPress={() => handleTagToggle(index)}
                                    >
                                        <Text style={selectedTags.includes(tags[index]) ? styles.tagActive : styles.tagInactive}>{tag}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    }
                    { selectedSegment === 'Structured Input' &&
                        <ScrollView contentContainerStyle={styles.wrapper} >
                        <Text style={styles.inputDescription}>Topic *</Text>
                        <View style={{...styles.inputContainer, ...styles.topicInputContainer}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={setTopic}
                                value={topic}
                                multiline={true}
                                placeholder="topic"
                                placeholderTextColor="#888"
                            />
                        </View>
                        <Text style={styles.inputDescription}>Title *</Text>
                        <View style={{...styles.inputContainer, ...styles.titleInputContainer}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={setTitle}
                                value={title}
                                multiline={true}
                                placeholder="title"
                                placeholderTextColor="#888"
                            />
                        </View>
                        <Text style={styles.inputDescription}>Subtitle</Text>
                        <View style={{...styles.inputContainer, ...styles.subtitleInputContainer}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={setSubtitle}
                                value={subtitle}
                                multiline={true}
                                placeholder="subtitle"
                                placeholderTextColor="#888"
                            />
                        </View>
                        <Text style={styles.inputDescription}>Description *</Text>
                        <View style={{...styles.inputContainer, ...styles.descriptionInputContainer}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={setDescription}
                                value={description}
                                multiline={true}
                                placeholder="description"
                                placeholderTextColor="#888"
                            />
                        </View>
                        <Text style={styles.inputDescription}>Additional Info</Text>
                        <View style={{...styles.inputContainer, ...styles.additionalInputContainer}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={setAdditional}
                                value={additional}
                                multiline={true}
                                placeholder="Additional Info (e.g. url)"
                                placeholderTextColor="#888"
                            />
                        </View>
                        <View style={styles.tagsWrapper}>
                            <Text style={styles.inputDescription}>Add tags to find your QR-Code faster</Text>
                            <TextInput
                                style={styles.tagsInput}
                                onChangeText={handleInputChange}
                                // onKeyPress={handleKeyPress}
                                value={input}
                                placeholder={"Add tag by pressing space"}
                                // placeholder={tags.length === 0 ? "Add tag by pressing spacebar" : ""}
                                placeholderTextColor="#888"
                            />
                            {tags.map((tag, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={selectedTags.includes(tags[index]) ? styles.singleTagWrapperActive : styles.singleTagWrapperInactive} 
                                    onPress={() => handleTagToggle(index)}
                                >
                                    <Text style={selectedTags.includes(tags[index]) ? styles.tagActive : styles.tagInactive}>{tag}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    }
                    <View style={styles.saveButtonsWrapper}>
                        <TouchableOpacity 
                            style={[styles.saveButton, !buttonActive() && styles.disabledSaveButton]} 
                            onPress={buttonActive() ? handleDownloadAndSave : undefined}
                            disabled={!buttonActive()}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
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
                                    // setTags(tags);
                                    setSelectedTags([]);
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
        // padding: 15,
        paddingBottom: 0,
    },
    switchContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        overflow: 'hidden',
        // backgroundColor: "pink",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
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
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        padding: 30,
        paddingTop: 0,
        // backgroundColor: "pink",
    },
    inputContainer: {
        flex: 1,
        // justifyContent: 'flex-start',
        marginBottom: 20,
        // backgroundColor: "pink",
        // backgroundColor: colors.primary,
        width: '100%',
    },
    topicInputContainer: {
        minHeight: 62,
    },
    titleInputContainer: {
        minHeight: 62,
    },
    subtitleInputContainer: {
        minHeight: 62,
    },
    descriptionInputContainer: {
        minHeight: 0.2 * height
    },
    additionalInputContainer: {
        minHeight: 0.15 * height,
    },
    inputDescription: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '300',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        // height: 40,
        borderColor: colors.text,
        borderWidth: 1,
        color: colors.text,
        fontSize: 14,
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
        padding: 20,
    },
    saveButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.accent,
        padding: 10,
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
        fontSize: 20,
        fontWeight: "400",
    },
    tagsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: colors.primary,
        width: '100%',
        // borderColor: colors.text,
        // borderWidth: 1,
        color: colors.text,
        fontSize: 16,
        // borderRadius: 5,
        // padding: 10,
        textAlignVertical: 'top',
        textAlign: 'left',
        // backgroundColor: "pink",
        // marginTop: 20,
        // make line break
        flexWrap: 'wrap',
    },
    singleTagWrapperActive: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.text,
        margin: 5,
        marginLeft: 0,
        marginTop: 0,
        borderColor: colors.text,
        borderWidth: 1,
        borderRadius: 5,
        paddingRight: 5,
        paddingLeft: 5,
        minWidth: 0.1 * width,
    },
    singleTagWrapperInactive: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        margin: 5,
        marginLeft: 0,
        marginTop: 0,
        borderColor: colors.text,
        borderWidth: 1,
        borderRadius: 5,
        paddingRight: 5,
        paddingLeft: 5,
        minWidth: 0.1 * width,
    },
    tagActive: {
        color: colors.secondary,
        padding: 2,
        textAlign: 'center',
        fontWeight: '300',
    },
    tagInactive: {
        color: colors.text,
        padding: 2,
        textAlign: 'center',
        fontWeight: '300',
    },
    tagsInput: { 
        height: 40, 
        padding: 10,
        width: '100%',
        borderColor: colors.text,
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 14,
        marginBottom: 10,
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
        padding: 40,
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