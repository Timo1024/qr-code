import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

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
    
    // split data.tags by ;
    var tags = null;
    if(data.tags) {
        tags = data.tags.split(';');
    }
    
    console.log({tags});
    
    
    if(!is_data_sufficient) {
        return (
            <View style={styles.wrapper}>
                <View style={styles.scrollTags}>
                    <ScrollView 
                        horizontal={true} 
                        style={styles.tagWrapper} 
                        showsHorizontalScrollIndicator={false}
                    >
                        {tags && tags.map((tag: string, index: React.Key) => (
                            <Text key={index} style={styles.tags}>{tag}</Text>
                        ))}
                    </ScrollView>
                </View>
                <TouchableOpacity style={styles.touchable}>
                    <Text style={styles.head}>Free Text QR-Code</Text>
                    <Text style={styles.sub} numberOfLines={1} ellipsizeMode='tail'>{data.description}</Text>
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style={styles.wrapper}>
                <View style={styles.scrollTags}>
                    <ScrollView 
                        horizontal={true} 
                        style={styles.tagWrapper} 
                        showsHorizontalScrollIndicator={false}
                    >
                        {tags && tags.map((tag: string, index: React.Key) => (
                            <Text key={index} style={styles.tags}>{tag}</Text>
                        ))}
                    </ScrollView>
                </View>
                <TouchableOpacity style={styles.touchable}>
                    <Text style={styles.head}>{data.topic} - {data.title}</Text>
                    {data.subtitle &&
                        <Text style={styles.sub}>{data.subtitle}</Text>
                    }
                    {!data.subtitle &&
                        <Text style={styles.sub} numberOfLines={1} ellipsizeMode='tail'>{data.description}</Text>
                    }
                </TouchableOpacity>
            </View>
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
        margin: 10,
        marginLeft: 0,
        marginRight: 0
    },
    head : {
        fontSize: 18,
        color: colors.text
    },
    sub : {
        fontSize: 14,
        color: colors.text,
        fontWeight: '300',
        marginTop: 5
    },
    tagWrapper : {
        // should be just one row, but scrollable left right
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        // flexWrap: 'wrap',
        // justifyContent: 'flex-start',
        // alignItems: 'center',
        // margin: 5
        // marginRight: 20,
    },
    tags : {
        fontSize: 10,
        color: colors.secondary,
        backgroundColor: colors.accent,
        padding: 3,
        margin: 0,
        marginLeft: 0,
        marginRight: 4,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: '500'
    },
    touchable : {
        display: 'flex',
        alignItems: 'stretch', // Possible values: 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'
        justifyContent: 'space-evenly',
        paddingTop: 5,
    },
    scrollTags : {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
    }
});