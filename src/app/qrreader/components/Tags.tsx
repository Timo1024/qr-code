import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import { colors } from '../resources/constants/colors.json';

const Tags = ({ tags }: any) => {
    return (
        <View style={styles.listTagsWrapper}>
            {tags.map((tag: string, index: number) => (
                <View key={index} style={styles.listTags}>
                    <Text style={styles.ListTagText}>{tag}</Text>
                </View>
            ))}
        </View>
    );
};

export default Tags;

const styles = StyleSheet.create({
    listTagsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "pink",
        width: '100%',
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    listTags: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.text,
        padding: 5,
        margin: 3,
        borderRadius: 5,
        paddingTop: 2,
        paddingBottom: 2,
    },
    ListTagText: {
        color: colors.secondary,
        fontWeight: '400',
    },
});