import React from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import SvgUri from 'react-native-svg-uri';

import { colors } from '../resources/constants/colors.json';

const QRButton = ({ navigation, fill }: any) => {
    if(!fill) {
        return (
            <View style={styles.button_view}>
                <TouchableOpacity onPress={() => navigation.navigate('Scanner')} style={styles.button_main}>
                    <Text style={styles.button_text}>Scan QR code</Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View style={styles.button_view_fill}>
                <TouchableOpacity onPress={() => navigation.navigate('Scanner')} style={styles.button_main}>
                    <Text style={styles.button_text}>Scan QR code</Text>
                    {/* <SvgUri
                        width="50"
                        height="50"
                        source={require('D:/programming/qr-code/src/app/qrreader/resources/images/qr.svg')} // Replace with the path to your SVG file
                    /> */}
                </TouchableOpacity>
            </View>
        );
    }
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
    button_view_fill : {
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 30,
        flex: 1
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