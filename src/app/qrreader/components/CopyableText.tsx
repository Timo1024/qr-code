import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import CopyTextSvgComponent from './svg_components/copyText';
import { colors } from '../resources/constants/colors.json';

const CopyableText = ({textToCopy = ""}) => {

  const copyToClipboard = () => {
    Clipboard.setString(textToCopy);
    // Alert.alert("Copied to Clipboard", "The text has been copied to your clipboard.");
  };

  return (
    <View style={[styles.container, { opacity: 1 }]}>
      <TouchableOpacity style={styles.iconContainer} onPress={copyToClipboard}>
          <CopyTextSvgComponent size={20} color={colors.text} />
          <Text style={styles.text}>copy QR Code content</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "pink",
    // opacity: 0.7,
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: 0,
    paddingBottom: 20,
    paddingTop: 20,
  },
  text: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "300",
  },
});

export default CopyableText;