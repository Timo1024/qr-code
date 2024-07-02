import React from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import { colors } from '../resources/constants/colors.json';

const QRButton = ({ navigation }: any) => {
    return (
        <View style={styles.button_view}>
            <TouchableOpacity onPress={() => navigation.navigate('Scanner')} style={styles.button_main}>
                <Text style={styles.button_text}>Scan QR code</Text>
            </TouchableOpacity>
            {/* <Button
                title="Scan QR Code"
                onPress={() => navigation.navigate('Scanner')}
            /> */}
        </View>
    );
};

export default QRButton;

const styles = StyleSheet.create({
    button_view : {
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 30
    },
    button_main : {
        alignItems: 'center',
        backgroundColor: colors.accent,
        padding: 15,
        borderRadius: 5,
        width: '50%',
        alignSelf: 'center',
    },
    button_text : {
        color: colors.secondary,
        fontSize: 18
    }
});