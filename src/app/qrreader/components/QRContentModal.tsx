import React, { useEffect, useRef, useState } from 'react';
import { Modal, Text, TextInput, View, Button, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { addEntry, getExistingTags, updateDB } from '../services/database';
import Share from 'react-native-share';
import { deleteEntry } from '../services/database';

import { colors } from '../resources/constants/colors.json';
import QRCode from 'react-native-qrcode-svg';

import DownloadSvgComponent from './svg_components/download';
import ShareSvgComponent from './svg_components/share';
import PenSvgComponent from './svg_components/pen';
import TrashSvgComponent from './svg_components/trash';
import CancelSvgComponent from './svg_components/cancel';
import BackarrowSvgComponent from './svg_components/backarrow';
import CheckSvgComponent from './svg_components/check';
import RNFetchBlob from 'rn-fetch-blob';
import ViewShot from 'react-native-view-shot';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const MyModal = ({ data, isVisible, onClose, db }: { data: any, isVisible: boolean, onClose: () => void, db : SQLiteDatabase }) => {
    const [topic, setTopic] = useState(data.topic);
    const [title, setTitle] = useState(data.title);
    const [subtitle, setSubtitle] = useState(data.subtitle);
    const [description, setDescription] = useState(data.description);
    const [additional, setAdditional] = useState(data.additional);
    const [stringifiedTags, setStringifiedTags] = useState(data.tags);
    
    const [input, setInput] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [existingTags, setExistingTags] = useState<string[]>([]);

    const [edit, setEdit] = useState(false);
    const [QRtext, setQRtext] = useState<string | null>(null);

    const [download, setDownload] = useState(false);
    const [share, setShare] = useState(false);
    const viewShotRef = useRef<ViewShot>(null);
    
    const isFullContent = data.topic && data.title && data.description;

    useFocusEffect(
        React.useCallback(() => {
            setQRtext(data.topic && data.title ? data.reference : data.description);
        }, [])
    );

    useEffect(() => {

        const myTags : string[] = data.tags.split(';');

        if (isVisible) {
            setTopic(data.topic);
            setTitle(data.title);
            setSubtitle(data.subtitle);
            setDescription(data.description);
            setAdditional(data.additional);
            setSelectedTags(myTags);
        }
    }, [isVisible]);

    useEffect(() => {
        if(isVisible){
            // get all tags from database
            getUniqueTags(db).then((myTags) => {
                console.log(myTags);
                setTags(myTags);
                setExistingTags(myTags);

            }).catch((error) => {
                console.error('Error getting tags:', error);
            });
        }
    }, [isVisible]);

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
                            copyFile(uri, filePath, `qrcode_${timestamp}.png`);
                        })
                        .catch(err => console.log('Directory creation error:', err.message));
                    } else {
                        console.log('Directory already exists');
                        copyFile(uri, filePath, `qrcode_${timestamp}.png`);
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

    const copyFile = (uri: string, path: string, filename: string) => {
        console.log({uri, path});
        
        RNFetchBlob.fs.cp(uri, path)
        .then(() => {
            console.log('FILE WRITTEN!');
            Alert.alert(
                'QR Code Saved',
                `Your QR code has been successfully saved in \nPictures > QRCode > ${filename}`,
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

    const onSave = () => {
        setEdit(false);

        // Create Database entry with date and description
        console.log('Update in Database');
        const reference = data.reference

        // make all tags lower case and delete duplicates
        const tags = selectedTags.map(tag => tag.toLowerCase());
        const uniqueTags = Array.from(new Set(tags));

        const myDescription = description.trim() === '' ? 'no description' : description;
        var myTopic = null;
        var myTitle = null;
        var mySubtitle = null;
        var myAdditional = null;
        if(topic) {
            myTopic = topic.trim() === '' ? null : topic;
        }
        if(title) {
            myTitle = title.trim() === '' ? null : title;
        }
        if(subtitle) {
            mySubtitle = subtitle.trim() === '' ? null : subtitle;
        }
        if(additional) {
            myAdditional = additional.trim() === '' ? null : additional;
        }

        updateDB(db, data.id, reference, myTopic, myTitle, mySubtitle, myDescription, myAdditional, uniqueTags.join(';'))
        .then(() => {
            // navigation.navigate("DBList")
            console.log('Entry updated successfully');
            onClose();
        })
        .catch((error: any) => {
            console.error('Error updating entry:', error);
        });

    }

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

    const getUniqueTags = async (db: SQLite.SQLiteDatabase) : Promise<string[]> => {
        const tagsArray = await getExistingTags(db);
        const allTags = tagsArray.flatMap(tagObj => {
            console.log({tagObj});
            return tagObj ? tagObj.split(';') : [];
        });
        const uniqueTags = Array.from(new Set(allTags)).filter(tag => tag.trim() !== '');
        return uniqueTags;
    };

    const onDelete = () => {
        deleteEntry(db, data.id)
        .then(() => {
            console.log('Entry deleted successfully');
            onClose();
        })
        .catch((error: any) => {
            console.error('Error deleting entry:', error);
        });
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                {edit &&
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Edit Content</Text>
                        <ScrollView contentContainerStyle={styles.wrapper}>
                            {isFullContent && 
                                <Text style={styles.inputDescription}>Topic *</Text>
                            }
                            {isFullContent && 
                                <View style={{...styles.inputContainer, ...styles.topicInputContainer}}>
                                    <TextInput
                                        style={styles.textInput}
                                        onChangeText={setTopic}
                                        value={topic}
                                        multiline={true}
                                        placeholder="topic"
                                        placeholderTextColor="#888"
                                    />
                                </View>
                            }
                            {isFullContent && 
                                <Text style={styles.inputDescription}>Title *</Text>
                            }
                            {isFullContent && 
                                <View style={{...styles.inputContainer, ...styles.titleInputContainer}}>
                                    <TextInput
                                        style={styles.textInput}
                                        onChangeText={setTitle}
                                        value={title}
                                        multiline={true}
                                        placeholder="title"
                                        placeholderTextColor="#888"
                                    />
                                </View>
                            }
                            {isFullContent && 
                                <Text style={styles.inputDescription}>Subtitle</Text>
                            }
                            {isFullContent && 
                                <View style={{...styles.inputContainer, ...styles.subtitleInputContainer}}>
                                    <TextInput
                                        style={styles.textInput}
                                        onChangeText={setSubtitle}
                                        value={subtitle}
                                        multiline={true}
                                        placeholder="subtitle"
                                        placeholderTextColor="#888"
                                    />
                                </View>
                            }
                            <Text style={styles.inputDescription}>Description *</Text>
                            <View style={{...styles.inputContainer, ...styles.descriptionInputContainer}}>
                                <TextInput
                                    style={styles.textInput}
                                    onChangeText={setDescription}
                                    value={description}
                                    multiline={true}
                                    placeholder="description"
                                    placeholderTextColor="#888"
                                />
                            </View>
                            {isFullContent && 
                                <Text style={styles.inputDescription}>Additional</Text>
                            }
                            {isFullContent && 
                                <View style={{...styles.inputContainer, ...styles.additionalInputContainer}}>
                                    <TextInput
                                        style={styles.textInput}
                                        onChangeText={setAdditional}
                                        value={additional}
                                        multiline={true}
                                        placeholder="additional"
                                        placeholderTextColor="#888"
                                    />
                                </View>
                            }

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

                            {/* extend with empty space */}
                            <View style={styles.emptySpace} />

                        </ScrollView>
                        <View style={styles.exitButtons}>
                            <TouchableOpacity onPress={onSave} style={styles.buttonPrimarySvg}>
                                <CheckSvgComponent color={colors.secondary} height={20} width={20}/>
                                <Text style={styles.textPrimarySvg}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setEdit(false)} style={styles.buttonSecondarySvg}>
                                <CancelSvgComponent color={colors.accent} height={24} width={24}/>
                                <Text style={styles.textSecondarySvg}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                { !edit &&
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>QR-Code</Text>

                        <View style={styles.card}>
                            <ScrollView contentContainerStyle={styles.ListWrapper}>

                                {/* add an image of the qr-code (data.reference if data.topic && data.title are not null; data.description otherwise)*/}
                                <View style={styles.showQR}>
                                    <QRCode
                                        value={QRtext ?? 'no text provided'}
                                        size={width * 0.4}
                                        color={colors.text}
                                        backgroundColor={colors.primary}
                                    />
                                </View>

                                {/* display all the information of the qr code if it exists */}
                                {data.topic && data.topic.trim() !== '' &&
                                    <View style={styles.listTopic}>
                                        <Text style={styles.listTopicText}>{data.topic}</Text>
                                    </View>
                                }
                                {data.title && data.title.trim() !== '' &&
                                    <View style={styles.listTitle}>
                                        <Text style={styles.listTitleText}>{data.title}</Text>
                                        {data.subtitle && data.subtitle.trim() !== '' &&
                                            <Text style={styles.listSubtitleText}>{data.subtitle}</Text>
                                        }
                                    </View>
                                }
                                <View style={styles.listDescription}>
                                    <Text style={styles.listDescriptionText}>{data.description}</Text>
                                </View>
                                {data.additional && data.additional.trim() !== '' &&
                                    <View style={styles.listAdditional}>
                                        <Text style={styles.listAdditionalText}>{data.additional}</Text>
                                    </View>
                                }
                                <View style={styles.listTagsWrapper}>
                                    {data.tags.split(';').map((tag: string, index: number) => (
                                        <View key={index} style={styles.listTags}>
                                            <Text style={styles.ListTagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* extend with empty space */}
                                <View style={styles.emptySpace2} />
                            </ScrollView>
                        </View>

                        {/* add a delete, edit, share, download, cancel button */}
                        <View style={styles.exitButtonsWrapper}>

                            <View style={styles.donwloadButtonWrapper}>
                                <TouchableOpacity onPress={() => setDownload(true)} style={{...styles.buttonPrimarySvgStart, marginRight: 20}}>
                                    <DownloadSvgComponent color={colors.secondary} height={20} width={20}/>
                                    <Text style={styles.textPrimarySvg}>Download</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShare(true)} style={styles.buttonPrimarySvgStart}>
                                    <ShareSvgComponent color={colors.secondary} height={20} width={20}/>
                                    <Text style={styles.textPrimarySvg}>Share</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.editButtonWrapper}>
                                <TouchableOpacity onPress={() => setEdit(true)} style={{...styles.buttonPrimarySvgStart, marginRight: 20}}>
                                    <PenSvgComponent color={colors.secondary} height={20} width={20}/>
                                    <Text style={styles.textPrimarySvg}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onDelete} style={styles.buttonPrimarySvgStart}>
                                    <TrashSvgComponent color={colors.secondary} height={20} width={20}/>
                                    <Text style={styles.textPrimarySvg}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.closeButtonWrapper}>
                                <TouchableOpacity onPress={onClose} style={styles.buttonSecondarySvg}>
                                    <CancelSvgComponent color={colors.accent} height={24} width={24}/>
                                    <Text style={styles.textSecondarySvg}>Cancel</Text>
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
            </View>
            
        </Modal>
    );
};

export default MyModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        // margin: 20,
        backgroundColor: colors.primary,
        borderRadius: 5,
        paddingTop: 35,
        // alignItems: "center",
        shadowColor: colors.secondary,
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
        // width: '90%',
        height: 1 * height,
        // top: 0 * height,
        position: 'absolute',
    },
    modalTitle: {
        color: colors.text,
        fontSize: 24,
        fontWeight: '400',
        marginBottom: 20,
        textAlign: 'center',
    },

    // styles for initial modal

    card: {
        flex: 1,
        // display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'flex-start',
        // alignItems: 'center',
        // backgroundColor: "lightblue",
        // width: '100%',
        // height: '100%',
        // padding: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.text,
        marginLeft: 20,
        marginRight: 20,
    },
    ListWrapper: {
        // flex: 1,
        margin: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor: "pink",
        // width: '100%',
        // marginBottom: 20,
    },
    showQR: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "pink",
        // margin: 20,
        marginBottom: 20,
        marginTop: 20,
    },
    listTopic: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "pink",
        width: '100%',
        marginBottom: 10,
    },
    listTitle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "pink",
        width: '100%',
        marginBottom: 20,
    },
    listSubtitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "pink",
        width: '100%',
        marginBottom: 20,
    },
    listDescription: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "pink",
        width: '100%',
        marginBottom: 20,
    },
    listAdditional: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "pink",
        width: '100%',
        marginBottom: 20,
    },
    listTagsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "pink",
        width: '100%',
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    listTags: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.text,
        padding: 5,
        margin: 3,
        borderRadius: 5,
        paddingTop: 2,
        paddingBottom: 2,
    },
    ListTagText: {
        color: colors.secondary,
        fontWeight: '400',
    },
    listTopicText: {
        color: colors.text,
        fontSize: 24,
        fontWeight: '400',
    },
    listTitleText: {
        color: colors.text,
        fontSize: 20,
        fontWeight: '400',
    },
    listSubtitleText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '400',
    },
    listDescriptionText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '300',
    },
    listAdditionalText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '300',
    },




    exitButtonsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "lightblue",
        // width: '100%',
        // height: '100%',
        // marginBottom: 20,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    donwloadButtonWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        // backgroundColor: "pink",
        marginBottom: 20,
    },
    editButtonWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        // backgroundColor: "lightblue",
        marginBottom: 20,
    },
    closeButtonWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        // backgroundColor: "lightblue",
        marginBottom: 20,
    },
    buttonPrimarySvg: {
        // flex: 1,
        backgroundColor: colors.accent,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.accent,
        width: '40%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPrimarySvgStart: {
        flex: 1,
        backgroundColor: colors.accent,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.accent,
        // width: '40%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSecondarySvg: {
        // backgroundColor: colors.secondary,
        padding: 9,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.accent,
        width: '40%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textPrimarySvg: {
        color: colors.secondary,
        fontWeight: '400',
        textAlign: 'center',
        marginLeft: 10,
    },
    textSecondarySvg: {
        color: colors.accent,
        fontWeight: '400',
        textAlign: 'center',
        marginLeft: 10,
    },
    emptySpace: {
        height: 100, // Adjust the height as needed
        width: '100%',
        // backgroundColor: "pink",
    },
    emptySpace2: {
        height: 50, // Adjust the height as needed
        width: '100%',
        // backgroundColor: "pink",
    },


    // styles for edit modal

    textInput: {
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
    inputDescription: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '300',
        marginBottom: 10,
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
    wrapper: {
        // display: 'flex',
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        padding: 20,
        paddingTop: 0,
        // backgroundColor: "pink",
    },
    exitButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 20,
        // backgroundColor: "lightblue",
    },
    buttonPrimary: {
        backgroundColor: colors.accent,
        padding: 10,
        borderRadius: 5,
        width: '40%',
    },
    buttonSecondary: {
        // backgroundColor: colors.secondary,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.accent,
        width: '40%',
    },
    textPrimary: {
        color: colors.secondary,
        fontWeight: '400',
        textAlign: 'center',
    },
    textSecondary: {
        color: colors.accent,
        fontWeight: '400',
        textAlign: 'center',
    },
    tagsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: colors.primary,
        width: '100%',
        color: colors.text,
        fontSize: 16,
        textAlignVertical: 'top',
        textAlign: 'left',
        flexWrap: 'wrap',
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
});
