import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import { colors } from '../resources/constants/colors.json';

const Description = ({ text }: any) => {
    return (
      <View style={styles.description_view}>
        <Text style={styles.content}>{ text }</Text>
      </View>
    );
};

export default Description;

const styles = StyleSheet.create({
    description_view : {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        backgroundColor: colors.primary,
        padding: 25,
        paddingLeft: 25,
    },
    content : {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: "200"
    }
});