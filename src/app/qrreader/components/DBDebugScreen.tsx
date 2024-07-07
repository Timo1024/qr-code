import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions } from 'react-native';
import { initializeDatabase, addRandomEntry, removeAllEntries, getAllEntries } from '../services/database';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp, RouteProp } from '@react-navigation/native';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

type DBDebugScreenProps = {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
};

const { width, height } = Dimensions.get('window');

// Define the User type
interface User {
    id: number;
    name: string;
    age: number;
  }

const DBDebugScreen = ({ navigation, route }: DBDebugScreenProps) => {
    
    const [db, setDb] = useState<SQLiteDatabase | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    
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
            const entries = await getAllEntries(database);
            setUsers(entries);
        } catch (error) {
            console.error('Failed to load entries:', error);
        }
    };
    
    const handleAddRandomEntry = async () => {
        console.log({db});
        if (db) {
            try {
                
                await addRandomEntry(db);
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

    console.log({users});
    
    
    return (
        <View style={styles.container}>
        <Button title="Add Random Entry" onPress={handleAddRandomEntry} />
        <Button title="Remove All Entries" onPress={handleRemoveAllEntries} />
        <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <View style={styles.item}>
            <Text>ID: {item.id}</Text>
            <Text>Name: {item.name}</Text>
            <Text>Age: {item.age}</Text>
            </View>
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