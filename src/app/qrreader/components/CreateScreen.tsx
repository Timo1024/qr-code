import React, { useState } from 'react';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, TextInput } from 'react-native';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import CancelSvgComponent from './svg_components/cancel';
import LightOffSvgComponent from './svg_components/lightOff';
import LightOnSvgComponent from './svg_components/lightOn';
import NavBar from './NavBar';
import TopBar from './TopBar';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';

type CreateScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const { width, height } = Dimensions.get('window');

const CreateScreen = ({ navigation, route }: CreateScreenProps) => {

    const [selectedSegment, setSelectedSegment] = useState('Free Text');
    const [description, setDescription] = useState('');

    const handlePress = (segment: React.SetStateAction<string>) => {
        setSelectedSegment(segment);
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
                    </ScrollView>
                }
                { selectedSegment === 'Structured Input' &&
                    <ScrollView contentContainerStyle={styles.wrapper} >
                        <Text>Struct Text</Text>
                    </ScrollView>
                }
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
});