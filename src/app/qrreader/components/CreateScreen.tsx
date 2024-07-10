import React, { useState } from 'react';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import CancelSvgComponent from './svg_components/cancel';
import LightOffSvgComponent from './svg_components/lightOff';
import LightOnSvgComponent from './svg_components/lightOn';
import NavBar from './NavBar';

type CreateScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const { width, height } = Dimensions.get('window');

const CreateScreen = ({ navigation, route }: CreateScreenProps) => {

  return (
    <View style={{ flex: 1 }}>
        <View style={styles.main}>
            <Text style={styles.test}>Create</Text>
        </View>
        <NavBar navigation={navigation} active={[false, false, true, false]}/>
    </View>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
    main : {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 30,
        paddingBottom: 50,
    },
    test : {
        color: colors.text,
        fontSize: 18
    },
});