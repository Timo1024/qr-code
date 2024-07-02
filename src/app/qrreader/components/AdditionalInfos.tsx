import React from 'react';
import { Button, Text, View, StyleSheet, Linking, TouchableOpacity  } from 'react-native';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import { colors } from '../resources/constants/colors.json';

import LinkSvgComponent from './svg_components/link';

const AdditionalInfos = ({ text }: any) => {

    const handlePress = () => {
        Linking.openURL(text);
      };
    
      if (isUrl(text)) {
        return (
          <TouchableOpacity onPress={handlePress}>
            <LinkSvgComponent />
          </TouchableOpacity>
        );
      }
    
      return <Text>{text}</Text>;

    // if(isUrl(text)){
    // }

    // return (
    //   <View style={styles.additional_infos_view}>
    //     <Text style={styles.additional_infos_text}>{ text }</Text>
    //   </View>
    // );
};

export default AdditionalInfos;

const styles = StyleSheet.create({
    additional_infos_view : {
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 10,
        paddingLeft: 25,
    },
    additional_infos_text : {
        color: '#FFFFFF',
        fontSize: 24
    }
});

function isUrl(string: string): boolean {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
}