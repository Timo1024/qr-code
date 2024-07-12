import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import QRSvgComponent from './svg_components/qr';

import { colors } from '../resources/constants/colors.json';

const QRButton = ({ navigation, fill, data }: any) => {
    if(!fill) {
        return (
            <View style={styles.button_view}>
                <TouchableOpacity onPress={() => navigation.navigate('Scanner', { qrData: data })} style={styles.button_main}>
                    <QRSvgComponent />
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View style={styles.button_view_fill}>
                <TouchableOpacity onPress={() => navigation.navigate('Scanner', { qrData: data })} style={styles.button_main}>
                    <QRSvgComponent />
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
        padding: 30,
        paddingBottom: 50,
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