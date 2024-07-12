import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { initializeDatabase, addEntry, removeAllEntries, getAllEntries, getFilteredEntries } from '../services/database';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp, RouteProp, useFocusEffect } from '@react-navigation/native';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

import QRItem from './QRItem';
import DropdownMenu from './DropdownMenu';
import { TextInput } from 'react-native-gesture-handler';
import Heading from './Heading';
import TopBar from './TopBar';
import NavBar from './NavBar';


// type DBDebugScreenProps = {
//     navigation: NavigationProp<any>;
//     route: RouteProp<any>;
// };

interface DBDebugScreenProps {
    navigation: any; // Define more specific types as needed
    route: any; // Define more specific types as needed
    db: SQLiteDatabase;
    setDb: (db: SQLiteDatabase) => void;
}

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

const DBDebugScreen: React.FC<DBDebugScreenProps> = ({ navigation, route, db, setDb }) => {
    
    const [codes, setCodes] = useState<Codes[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [option, setOption] = useState<string>("all");
    const [search, setSearch] = useState<string>("");

    const [anyModalVisible, setAnyModalVisible] = useState(false);

    useEffect(() => {
        handleSearch();
    }, [search]);
    useEffect(() => {
        console.log({anyModalVisible});
        handleSearch();
    }, [anyModalVisible]);
    useFocusEffect(
        useCallback(() => {
            console.log("It was navigated to DBDebugScreen");
            loadEntries(db);
            return () => {
            };
        }, [db])
    );
    
    const loadEntries = async (database: SQLiteDatabase) => {
        try {
            const entries : Codes[] = await getAllEntries(database);
            setCodes(entries);
        } catch (error) {
            console.error('Failed to load entries:', error);
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
        <View style={styles.container}>
            <TopBar title="My QR-Codes" />
            <View style={styles.content}>
                <View style={styles.search}>
                <DropdownMenu options={["All", "Tags", "Topic", "Title", "Subtitle", "Content"]} setIsOpen={setIsOpen} isOpen={isOpen} onChange={handleSearch} search={search} option={option} setOption={setOption} />
                <TextInput placeholder="Search" style={styles.textInput} onChangeText={handleSearchInput}/>
                </View>
                <View style={styles.list}>
                <FlatList
                    data={codes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                    <QRItem data={item} db={db} anyModalVisible={anyModalVisible} setAnyModalVisible={setAnyModalVisible} />
                    )}
                />
                </View>
                {/* <Button title="Remove All Entries" onPress={handleRemoveAllEntries} /> */}
            </View>
            <NavBar navigation={navigation} active={[false, false, false, true]}/>
        </View>
    );
};

export default DBDebugScreen;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    content: {
        flex: 1,
        width: '100%',
    },
    list: {
        flex: 1,
        width: '100%',
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