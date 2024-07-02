import React from 'react';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp } from '@react-navigation/native';

import BackarrowSvgComponent from './svg_components/backarrow';

type ScannerScreenProps = {
  navigation: NavigationProp<any>;
};

const ScannerScreen = ({ navigation }: ScannerScreenProps) => {
  const onBarCodeRead = (scanResult: { data: any; }) => {
    navigation.navigate('Title', { qrData: scanResult.data });
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        style={{ flex: 1 }}
        onBarCodeRead={onBarCodeRead}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      <View style={styles.button_view}>
        <Text style={styles.scannerText}>Scan a QR code</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Title')} style={styles.button_main}>
            {/* <Text style={styles.button_text}>Scan QR code</Text> */}
            <BackarrowSvgComponent />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScannerScreen;

const styles = StyleSheet.create({
  button_view : {
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 30,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    // margin: 20,
    width: '100%',
  },
  scannerText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  button_main : {
      alignItems: 'center',
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 5,
      width: '20%',
      alignSelf: 'center',
  },
});