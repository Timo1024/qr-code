/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';

import {
  StatusBar,
  StyleSheet,
  Easing
} from 'react-native';

import { SQLiteDatabase } from 'react-native-sqlite-storage';

import { initializeDatabase } from './services/database';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import TitleScreen from './components/TitleScreen';
import ScannerScreen from './components/ScannerScreen';
import DBDebugScreen from './components/DBListScreen';
import CreateScreen from './components/CreateScreen';

// import resources
import { colors } from './resources/constants/colors.json';

import DataProvider from './DataContext';

const Stack = createStackNavigator();

function App(): React.JSX.Element {

  const [db, setDb] = useState<SQLiteDatabase | null>(null);

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
            }
        } catch (error) {
            console.error('Failed to initialize database:', error);
        }
      };
      
      setupDatabase();
  }, []);

  return (
    <DataProvider>
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
            ...TransitionPresets.ScaleFromCenterAndroid,
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
            component={withDatabase(TitleScreen)} 
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
    </DataProvider>
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
