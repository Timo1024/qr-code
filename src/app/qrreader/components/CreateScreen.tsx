import React, { useState } from 'react';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, TextInput, FlatList, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import CancelSvgComponent from './svg_components/cancel';
import LightOffSvgComponent from './svg_components/lightOff';
import LightOnSvgComponent from './svg_components/lightOn';
import NavBar from './NavBar';
import TopBar from './TopBar';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { addEntry } from '../services/database';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

type CreateScreenProps = {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
    db: SQLiteDatabase;
    setDb: (db: SQLiteDatabase) => void;
};

const { width, height } = Dimensions.get('window');

const CreateScreen = ({ navigation, route, db, setDb }: CreateScreenProps) => {

    const [selectedSegment, setSelectedSegment] = useState('Free Text');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [input, setInput] = useState('');

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

    const handleDownloadAndSave = () => {
        // Create Database entry with date and description
        console.log('Saving in Database');
        addEntry(db, null, null, null, null, description, null, tags.join(';'))
        .then(() => {
            navigation.navigate("DBList")
            console.log('Entry added successfully');
        })
        .catch((error) => {
            console.error('Error adding entry:', error);
        });

        // TODO Create QR-Code and save it to phone
    };

    return (
        <View style={styles.container}>
            <TopBar title="Create QR-Code" />
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
                <View style={styles.saveButtonWrapper}>
                    <TouchableOpacity 
                        style={[styles.saveButton, description.trim() == "" && styles.disabledSaveButton]} 
                        onPress={description.trim() != "" ? handleDownloadAndSave : undefined}
                        disabled={description.trim() == ""}
                    >
                        <Text style={styles.saveButtonText}>Download and Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        paddingBottom: 50,
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
    saveButtonWrapper: {
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
    }
});