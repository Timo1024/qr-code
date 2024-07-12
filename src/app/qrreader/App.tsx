/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';

import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Easing
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

import { initializeDatabase, closeDatabase, getAllEntries } from './services/database';

import CameraComponent from './components/CameraComponent';
import { NavigationContainer, NavigationProp, RouteProp } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import TitleScreen from './components/TitleScreen';
import ScannerScreen from './components/ScannerScreen';
import DBDebugScreen from './components/DBListScreen';
import CreateScreen from './components/CreateScreen';

// import resources
import { colors } from './resources/constants/colors.json';
import NavBar from './components/NavBar';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

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

const Stack = createStackNavigator();

function App(): React.JSX.Element {

  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  // const loadEntries = async (database: SQLiteDatabase) => {
  //     try {
  //         const entries : Codes[] = await getAllEntries(database);
  //         setCodes(entries);
  //     } catch (error) {
  //         console.error('Failed to load entries:', error);
  //     }
  // };

  function withDatabase(Component: React.ComponentType<any>) {
    // Assuming db and setDb are available in this scope
    return (props: React.PropsWithChildren<any>) => <Component {...props} db={db} setDb={setDb} />;
  }

  useEffect(() => {        
    const setupDatabase = async () => {
        try {
            const database = await initializeDatabase();
            console.log({database});
            
            if(database){
                setDb(database);
                // loadEntries(database);
            }
        } catch (error) {
            console.error('Failed to initialize database:', error);
        }
    };
    
    setupDatabase();
}, []);

  // useEffect(() => {
  //   let db: SQLite.SQLiteDatabase | undefined;

  //   const setupDatabase = async () => {
  //     db = await initializeDatabase();
  //   };

  //   setupDatabase();

  //   return () => {
  //     closeDatabase(db);
  //   };
  // }, []);

  return (
    <NavigationContainer theme={{
      dark: true,
      colors: {
        background: colors.primary,
        primary: '',
        card: '',
        text: '',
        border: '',
        notification: ''
      },
    }}>
      <StatusBar backgroundColor={colors.secondary} barStyle="light-content" />
      <Stack.Navigator 
        initialRouteName="Title"
        screenOptions={{
          gestureEnabled: false,
          ...TransitionPresets.ScaleFromCenterAndroid, // This is one of the predefined animations
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 200,
                easing: Easing.linear
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 200,
                easing: Easing.linear
              },
            },
          },
          // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // This is for the card style
        }}
      >
        <Stack.Screen 
          name="Title" 
          component={TitleScreen} 
          options={{
            gestureEnabled: false,
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="Scanner" 
          component={ScannerScreen} 
          options={{
            gestureEnabled: false,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="Create" 
          component={withDatabase(CreateScreen)} 
          options={{
            gestureEnabled: false,
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="DBList" 
          component={withDatabase(DBDebugScreen)} 
          options={{
            gestureEnabled: false,
            headerShown: false
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  }
});

export default App;
