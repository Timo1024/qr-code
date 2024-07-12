import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import CopyTextSvgComponent from './svg_components/copyText';
import { colors } from '../resources/constants/colors.json';

const CopyableText = ({textToCopy = ""}) => {

  const copyToClipboard = () => {
    Clipboard.setString(textToCopy);
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