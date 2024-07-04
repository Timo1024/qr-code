import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import CopyableText from './CopyableText';

import { colors } from '../resources/constants/colors.json';

const Description = ({ text }: any) => {
    return (
      <View style={styles.description_wrapper}>
        <View style={styles.description_view}>
          <Text style={styles.content}>{ text }</Text>
        </View>
        <CopyableText textToCopy={ text } opacity={0.7} withText={false} />
      </View>
    );
};

export default Description;

const styles = StyleSheet.create({
    description_view : {
        flex: 1,
        // width: '100%',
        // justifyContent: 'flex-start', 
        // alignItems: 'flex-start',
        // backgroundColor: "green",
        // padding: 25,
        // paddingLeft: 25,
    },
    content : {
        color: colors.text,
        fontSize: 18,
        fontWeight: "200",
        lineHeight: 22,
    },
    description_wrapper : {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start', 
      alignItems: 'flex-start',
      backgroundColor: colors.primary,
      padding: 25,
      paddingLeft: 25,
    },
});