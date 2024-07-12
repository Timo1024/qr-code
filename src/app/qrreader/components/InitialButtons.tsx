import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import JustQRSvgComponent from './svg_components/justQR';
import { colors } from '../resources/constants/colors.json';
import ScanSvgComponent from './svg_components/scan';

// Get the screen width
const screenWidth = Dimensions.get('window').width;

const InitialButtons = ({ navigation }: any) => {

    return(
        <View style={styles.button_view}>
            <TouchableOpacity onPress={() => navigation.navigate('Scanner', { qrData: null })} style={styles.button_primary}>
                <Text style={styles.text_primary}>Scan</Text>
                <View style={styles.icon_wrapper_primary}>
                    <ScanSvgComponent height={35} width={35} color={colors.secondary}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Create', { qrData: null })} style={styles.button_primary}>
                <Text style={styles.text_primary}>Create</Text>
                <View style={styles.icon_wrapper_primary}>
                    <JustQRSvgComponent height={35} width={35} color={colors.secondary}/>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default InitialButtons;

const styles = StyleSheet.create({
    button_view : {
        display: 'flex',
        flex: 1,
        width: '100%',
        justifyContent: 'space-evenly', 
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 30,
        paddingBottom: 50,
        flexDirection: 'column',
    },
    button_primary : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.accent,
        padding: 15,
        borderRadius: 5,
        width: screenWidth * 0.4,
        alignSelf: 'center',
        height: screenWidth * 0.4,
    },
    button_secondary : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 5,
        width: screenWidth * 0.4,
        height: screenWidth * 0.3,
        alignSelf: 'center',
        borderColor: colors.accent,
        borderWidth: 1
    },
    text_primary : {
        color: colors.secondary,
        fontSize: 24,
        fontWeight: "400",
        paddingBottom: 10,
    },
    text_secondary : {
        color: colors.accent,
        fontSize: 18,
        fontWeight: "400",
        paddingBottom: 10,
    },
    icon_wrapper_primary : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon_wrapper_secondary : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
});