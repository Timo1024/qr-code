import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { initializeDatabase, addEntry, removeAllEntries, getAllEntries, getFilteredEntries } from '../services/database';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp, RouteProp } from '@react-navigation/native';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

import QRItem from './QRItem';
import DropdownMenu from './DropdownMenu';
import { TextInput } from 'react-native-gesture-handler';
import Heading from './Heading';
import TopBar from './TopBar';
import NavBar from './NavBar';


type DBDebugScreenProps = {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
};

const { width, height } = Dimensions.get('window');

// Define the User type
interface Codes {
    id: number;
    reference: string;
    date: string;
    topic: string;
    title: string;
    subtitle: string;
    description: string;
    additional: string;
    tags: string;
  }

const DBDebugScreen = ({ navigation, route }: DBDebugScreenProps) => {
    
    const [db, setDb] = useState<SQLiteDatabase | null>(null);
    const [codes, setCodes] = useState<Codes[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [option, setOption] = useState<string>("all");
    const [search, setSearch] = useState<string>("");
    
    useEffect(() => {        
        const setupDatabase = async () => {
            try {
                const database = await initializeDatabase();
                console.log({database});
                
                if(database){
                    setDb(database);
                    loadEntries(database);
                }
            } catch (error) {
                console.error('Failed to initialize database:', error);
            }
        };
        
        setupDatabase();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [search]);
    
    const loadEntries = async (database: SQLiteDatabase) => {
        try {
            const entries : Codes[] = await getAllEntries(database);
            setCodes(entries);
        } catch (error) {
            console.error('Failed to load entries:', error);
        }
    };
    
    const handleAddEntry = async () => {
        // make random strings
        var   reference : string | null = Math.random().toString(36).substring(7);
        const topic : string | null = generateLoremIpsum(1);
        const title : string | null = generateLoremIpsum(2);
        var   subtitle : string | null = generateLoremIpsum(6);
        const additional : string | null = generateLoremIpsum(10);

        // make random string of length 100
        const description = generateLoremIpsum(10);
        const tags = generateSemicolonDelimitedTextString(4);

        // 50% of the time, there should be no reference
        if(Math.random() > 0.5) {
            reference = null;
        }
        if(Math.random() > 0.5) {
            subtitle = null;
        }

        console.log({db});
        if (db) {
            try {
                await addEntry(db, reference, topic, title, subtitle, description, additional, tags);
                loadEntries(db);
            } catch (error) {
                console.error('Failed to add random entry:', error);
            }
        }
    };
    
    const handleRemoveAllEntries = async () => {
        if (db) {
            try {
                await removeAllEntries(db);
                loadEntries(db);
            } catch (error) {
                console.error('Failed to remove all entries:', error);
            }
        }
    };

    const handleSearchInput = (text: string) => {
        setSearch(text);
    }

    const handleSearch  = async () => {
        // TODO implement search
        console.log({search});
        console.log({option});

        if(db) {
            try {
                const entries : Codes[] = await getFilteredEntries(db, search, option);
                setCodes(entries);
            } catch (error) {
                console.error('Failed to load entries:', error);
            }
        }
        
    };    
    
    return (
        // <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
            <View style={styles.container}>
                <TopBar title="My QR-Codes" />
                <View style={styles.content}>
                    <View style={styles.search}>
                        <DropdownMenu options={["All", "Tags", "Topic", "Title", "Subtitle", "Content"]} setIsOpen={setIsOpen} isOpen={isOpen} onChange={handleSearch} search={search} option={option} setOption={setOption} />
                        <TextInput placeholder="Search" style={styles.textInput} onChangeText={handleSearchInput}/>
                    </View>
                    <View style={styles.list}>
                    <FlatList
                        data={codes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <QRItem data={item} />
                        )}
                    />
                    </View>
                    {/* <Button title="Add Random Entry" onPress={handleAddEntry} />
                    <Button title="Remove All Entries" onPress={handleRemoveAllEntries} /> */}
                </View>
                <NavBar navigation={navigation} active={[false, false, false, true]}/>
            </View>
        // </TouchableWithoutFeedback>
    );
};

export default DBDebugScreen;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        // padding: 16,
    },
    content: {
        flex: 1,
        width: '100%',
        // backgroundColor: "pink",
    },
    list: {
        flex: 1,
        width: '100%',
        // backgroundColor: "lightblue",
    },
    item: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    textInput: {
        flex: 1,
        padding: 10,
    },
    search: {
        width: '95%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        zIndex: 997,
        elevation: 998,
        marginTop: 10,
    },
});

// TODO remove when not used anymore
function generateRandomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function generateSemicolonDelimitedTextString(length: number): string {
    // get random number from 0 to number
    const randint = Math.floor(Math.random() * length);
    var result = '';
    for (let i = 0; i < randint; i++) {
        result += generateLoremIpsum(1) + ';';
    }
    result += generateLoremIpsum(1);
    return result;
}
const loremWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
    "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
    "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
    "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
    "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est",
    "laborum"
  ];
  
  const generateLoremIpsum = (wordCount: number): string => {
    let loremText = "";
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * loremWords.length);
      loremText += loremWords[randomIndex] + " ";
    }
    return loremText.trim();
  };