import React from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import QRSvgComponent from './svg_components/qr';

import { colors } from '../resources/constants/colors.json';

// create type
type NavItemProps = {
    navigation: NavigationProp<any>;
    svgComponent: any;
    destination: string;
    text: string;
    fill: boolean;
    color: string;
};

const NavItem = ({ navigation, svgComponent, destination = "Title", text = "", fill = false, color = colors.secondary }: NavItemProps) => {
    if(!fill) {
        return (
            <View style={{...styles.button_view}}>
                <TouchableOpacity onPress={() => navigation.navigate(destination)} style={styles.button_main}>
                    {React.createElement(svgComponent, { color: color, height: 30, width: 30})}
                    <Text style={{...styles.button_text, color: color}}>{text}</Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View style={{...styles.button_view}}>
                <TouchableOpacity onPress={() => navigation.navigate(destination)} style={{...styles.button_main, ...styles.button_main_fill}}>
                    {React.createElement(svgComponent, { color: color, height: 30, width: 30 })}
                    <Text style={{...styles.button_text, color: color}}>{text}</Text>
                </TouchableOpacity>
            </View>
        );
    }
};

export default NavItem;

const styles = StyleSheet.create({
    button_view : {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    button_main_fill : {
        backgroundColor: colors.primary,
    },
    button_main : {
        alignItems: 'center',
        borderRadius: 5,
        width: '50%',
        alignSelf: 'center',
    },
    button_text : {
        fontSize: 12,
        marginTop: 10,
    }
});