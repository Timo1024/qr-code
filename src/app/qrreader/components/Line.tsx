import React from 'react';
import { Button, Text, View, StyleSheet, Dimensions } from 'react-native';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import { colors } from '../resources/constants/colors.json';

const Line = () => {
    const screenWidth = Dimensions.get('window').width;
    return (
        <View
        style={{
            height: 1, // Adjust as needed
            width: screenWidth * 0.9,
            backgroundColor: colors.text,
            borderRadius: 50,
            alignSelf: 'center',
            opacity: 0.4,
        }}
        />
    );
};

export default Line;

const styles = StyleSheet.create({
    description_view : {
        flex: 1,
        width: '100%',
        height: 100,
        justifyContent: 'center', 
        alignItems: 'flex-start',
        backgroundColor: "lightgreen",
        padding: 25
    },
    content : {
        color: '#FFFFFF',
        fontSize: 24
    }
});