import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

import { colors } from '../resources/constants/colors.json';

// create type
type NavItemProps = {
    navigation: NavigationProp<any>;
    svgComponent: any;
    destination: string;
    text: string;
    fill: boolean;
};

const NavItem = ({ navigation, svgComponent, destination = "Title", text = "", fill = false }: NavItemProps) => {

    var color = colors.accent;
    if(fill) color = colors.secondary;

    if(!fill) {
        return (
            <View style={{...styles.button_view}}>
                <TouchableOpacity onPress={() => {
                        console.log("Navigating to " + destination);
                        navigation.navigate(destination)
                    }} style={styles.button_main}>
                    <View style={styles.svg}>
                        {React.createElement(svgComponent, { color: color, height: 30, width: 30})}
                    </View>
                    <Text style={{...styles.button_text, color: color}}>{text}</Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View style={{...styles.button_view}}>
                <TouchableOpacity onPress={() => navigation.navigate(destination)} style={{...styles.button_main, ...styles.button_main_fill}}>
                    <View style={styles.svg}>
                        {React.createElement(svgComponent, { color: color, height: 30, width: 30 })}
                    </View>
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
        backgroundColor: colors.accent,
    },
    button_main : {
        alignItems: 'center',
        borderRadius: 5,
        width: '80%',
        alignSelf: 'center',
        padding: 10,

    },
    button_text : {
        fontSize: 12,
        marginTop: 10,
        textAlign: 'center',
    },
    svg : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});