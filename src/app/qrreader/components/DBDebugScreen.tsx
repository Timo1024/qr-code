import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions } from 'react-native';
import { initializeDatabase, addEntry, removeAllEntries, getAllEntries } from '../services/database';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp, RouteProp } from '@react-navigation/native';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

import QRItem from './QRItem';

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
  }

const DBDebugScreen = ({ navigation, route }: DBDebugScreenProps) => {
    
    const [db, setDb] = useState<SQLiteDatabase | null>(null);
    const [codes, setCodes] = useState<Codes[]>([]);
    
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
        const topic : string | null = Math.random().toString(36).substring(7);
        const title : string | null = Math.random().toString(36).substring(7);
        var   subtitle : string | null = Math.random().toString(36).substring(7);
        const additional : string | null = Math.random().toString(36).substring(7);

        // make random string of length 100
        const description = generateRandomString(100);

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
                await addEntry(db, reference, topic, title, subtitle, description, additional);
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

    // console.log({codes});
    
    
    return (
        <View style={styles.container}>
        <Button title="Add Random Entry" onPress={handleAddEntry} />
        <Button title="Remove All Entries" onPress={handleRemoveAllEntries} />
        <FlatList
        data={codes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <QRItem data={item} />
            // <View style={styles.item}>
            //     <Text>ID: {item.id}</Text>
            //     <Text>Reference: {item.reference}</Text>
            //     <Text>Date: {item.date}</Text>
            //     <Text>Topic: {item.topic}</Text>
            //     <Text>Title: {item.title}</Text>
            //     <Text>Subtitle: {item.subtitle}</Text>
            //     <Text>Description: {item.description}</Text>
            //     <Text>Additional: {item.additional}</Text>
            // </View>
        )}
        />
        </View>
    );
};

export default DBDebugScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    item: {
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
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
    var result = '';
    for (let i = 0; i < length; i++) {
        result += generateRandomString(10) + ';';
    }
    result += generateRandomString(10);
    return result;
}