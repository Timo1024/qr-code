import React from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import { colors } from '../resources/constants/colors.json';

// Define the User type
interface Codes {
    id: number;
    reference: string;
    date: string;
    topic: string;
    title: string;
    subtitle: string;
    description: string;
    additional: string;
  }

const QRItem = ({ data }: any) => {
    // check if data is sufficient to display as title, subtitle, etc.
    var is_data_sufficient = false;
    if(data.reference && data.topic && data.title && data.description) {
        is_data_sufficient = true;
    }

    if(!is_data_sufficient) {
        return (
            <TouchableOpacity style={styles.wrapper}>
                <Text style={styles.head}>Free Text QR-Code</Text>
                <View style={styles.line}/>
                <Text style={styles.description} numberOfLines={1} ellipsizeMode='tail'>{data.description}</Text>
            </TouchableOpacity>
        )
    } else {
        return (
            <TouchableOpacity style={styles.wrapper}>
                <Text style={styles.head}>{data.topic} - {data.title}</Text>
                {data.subtitle &&
                    <Text style={styles.sub}>{data.subtitle}</Text>
                }
                <View style={styles.line}/>
                <Text style={styles.description} numberOfLines={1} ellipsizeMode='tail'>{data.description}</Text>
            </TouchableOpacity>
        )
    }
};

export default QRItem;

const styles = StyleSheet.create({
    wrapper : {
        display: 'flex',
        alignItems: 'stretch', // Possible values: 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'
        justifyContent: 'space-evenly',
        backgroundColor: colors.secondary,
        padding: 15,
        paddingBottom: 20,
        margin: 5,
        borderRadius: 5,
        width: '95%',
        alignSelf: 'center'
    },
    line : {
        borderBottomColor: colors.text,
        borderBottomWidth: 0.5,
        margin: 5,
        marginLeft: 0,
        marginRight: 0
    },
    head : {
        fontSize: 18,
        color: colors.text
    },
    sub : {
        fontSize: 14,
        color: colors.text
    },
    description : {
        fontSize: 14,
        color: colors.text,
        fontWeight: '300'
    }
});