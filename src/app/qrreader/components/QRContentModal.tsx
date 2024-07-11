import React, { useEffect, useState } from 'react';
import { Modal, Text, TextInput, View, Button, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { addEntry, getExistingTags, updateDB } from '../services/database';

import { colors } from '../resources/constants/colors.json';

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
    
    const isFullContent = data.topic && data.title && data.description;

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

    const onSave = () => {
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

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
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



                    </ScrollView>
                    <View style={styles.exitButtons}>
                        <TouchableOpacity onPress={onSave} style={styles.buttonPrimary}>
                            <Text style={styles.textPrimary}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={styles.buttonSecondary}>
                            <Text style={styles.textSecondary}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        width: '90%',
        height: 0.95 * height,
        top: 0.025 * height,
        position: 'absolute',
    },
    modalTitle: {
        color: colors.text,
        fontSize: 24,
        fontWeight: '400',
        marginBottom: 20,
        textAlign: 'center',
    },
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