import React from 'react';
import { Text, View, StyleSheet, Linking, TouchableOpacity  } from 'react-native';

import { colors } from '../resources/constants/colors.json';

import LinkSvgComponent from './svg_components/link';

const AdditionalInfos = ({ text }: any) => {

    const handlePress = () => {
      Linking.openURL(text);
    };

    return (
      <View style={styles.additional_infos_view}>
        {
          isUrl(text) ? 
          <TouchableOpacity onPress={handlePress}>
            <LinkSvgComponent width={32} height={32} color={colors.text} />
          </TouchableOpacity>
          :
          <Text style={styles.additional_infos_text}>{ text }</Text>
        }
      </View>
    );
};

export default AdditionalInfos;

const styles = StyleSheet.create({
    additional_infos_view : {
        justifyContent: 'center', 
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    additional_infos_text : {
        color: colors.text,
        fontSize: 14,
        fontWeight: "300",
    }
});

function isUrl(string: string): boolean {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
}