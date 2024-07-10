import React from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import JustQRSvgComponent from './svg_components/justQR';
import ScanSvgComponent from './svg_components/scan';
import HomeSvgComponent from './svg_components/home';
import FolderSvgComponent from './svg_components/folder';

import { colors } from '../resources/constants/colors.json';

import NavItem from './NavItem';

// create type
type NavBarProp = {
    navigation: NavigationProp<any>;
    active: boolean[];
};

const NavBar = ({ navigation, active = [true, false, false, false] }: NavBarProp) => {
    return (
        <View style={styles.nav}>
            <NavItem navigation={navigation} svgComponent={HomeSvgComponent} destination="Title" text="Home" fill={active[0]}/>
            <NavItem navigation={navigation} svgComponent={ScanSvgComponent} destination="Scanner" text="Scan" fill={active[1]}/>
            <NavItem navigation={navigation} svgComponent={JustQRSvgComponent} destination="Title" text="Create" fill={active[2]}/>
            <NavItem navigation={navigation} svgComponent={FolderSvgComponent} destination="DBList" text="My QR-Codes" fill={active[3]}/>
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
        alignItems: 'flex-start',
        padding: 20,
        backgroundColor: colors.secondary,
    }
});