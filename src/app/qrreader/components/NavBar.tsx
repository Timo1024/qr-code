import React from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import QRSvgComponent from './svg_components/qr';

import { colors } from '../resources/constants/colors.json';

import NavItem from './NavItem';

// create type
type NavBarProp = {
    navigation: NavigationProp<any>;
    svgComponent: any[];
    destination: string[];
    text: string[];
    fill: boolean[];
    color: string[];
};

const NavBar = ({ navigation, svgComponent, destination = ["Title"], text = [""], fill = [false], color = ["#85F3F3"] }: NavBarProp) => {
    return (
        <View style={styles.nav}>
            {svgComponent.map((svg, index) => (
                <NavItem key={index} navigation={navigation} svgComponent={svg} destination={destination[index]} text={text[index]} fill={fill[index]} color={color[index]} />
            ))}
        </View>
    );
};

export default NavBar;

const styles = StyleSheet.create({
    nav : {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly', 
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.secondary,
    }
});