import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import { colors } from '../resources/constants/colors.json';

const Heading = ({ main, sub }: any) => {
    return (
      <View style={styles.heading_view}>
        <Text style={styles.heading_main}>{ main }</Text>
        {sub != "" &&
            <Text style={styles.heading_sub}>{ sub }</Text>
        }
      </View>
    );
};

export default Heading;

const styles = StyleSheet.create({
    heading_view : {
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'flex-start',
        backgroundColor: colors.primary,
        padding: 25,
        paddingLeft: 25,
    },
    heading_main : {
        color: colors.text,
        fontSize: 32,
        fontWeight: "400"
    },
    heading_sub : {
        color: colors.text,
        fontSize: 18,
        fontWeight: "300"
    }
});