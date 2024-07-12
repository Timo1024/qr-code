import React, { useState } from 'react';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import LightOffSvgComponent from './svg_components/lightOff';
import LightOnSvgComponent from './svg_components/lightOn';
import NavBar from './NavBar';

type ScannerScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const { width, height } = Dimensions.get('window');

const ScannerScreen = ({ navigation, route }: ScannerScreenProps) => {
  const onBarCodeRead = (scanResult: { data: any; }) => {
    navigation.navigate('Title', { qrData: scanResult.data });
  };

  const [flash, setFlash] = useState(RNCamera.Constants.FlashMode.off);

  const toggleFlash = () => {
    setFlash(
      flash === RNCamera.Constants.FlashMode.off
        ? RNCamera.Constants.FlashMode.torch
        : RNCamera.Constants.FlashMode.off
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        style={{ flex: 1 }}
        onBarCodeRead={onBarCodeRead}
        flashMode={flash}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      <View style={[styles.overlay]}>
        <View style={styles.topOverlay} />
          <View style={styles.middleOverlay}>
            <View style={styles.sideOverlay} />
              <View style={styles.centerOverlay}>
                <Text style={styles.text}>Scan a QR-Code</Text>
              </View>
            <View style={styles.sideOverlay} />
          </View>
        <View style={styles.bottomOverlay} />
      </View>
      
      <View style={styles.buttonWrapper}>
        <View style={styles.button_view}>
          <TouchableOpacity style={[styles.buttonLight, flash === RNCamera.Constants.FlashMode.torch && styles.buttonLightActive]} onPress={toggleFlash}>
            {flash === RNCamera.Constants.FlashMode.off ? <LightOffSvgComponent color={colors.text} size={28} /> : <LightOnSvgComponent color={colors.secondary} size={28} />}
          </TouchableOpacity>
        </View>
      </View>
      <NavBar navigation={navigation} active={[false, true, false, false]}/>
    </View>
  );
};

export default ScannerScreen;

var backgroundColor = 'rgba(0, 0, 0, 0.5)';

const styles = StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    position: 'absolute',
    bottom: "16%",
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  buttonWrapperInner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
  },
  button_view : {
    justifyContent: 'center', 
    alignItems: 'center',
    paddingBottom: 30,
  },
  scannerText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  button_main : {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 50,
    width: 50,
    alignSelf: 'center',
    borderColor: colors.text,
    borderWidth: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: backgroundColor,
  },
  middleOverlay: {
    flexDirection: 'row',
  },
  bottomOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: backgroundColor,
  },
  sideOverlay: {
    width: width * 0.2,
    height: width * 0.8,
    backgroundColor: backgroundColor,
  },
  centerOverlay: {
    width: width * 0.8,
    height: width * 0.8,
    borderColor: colors.text,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.text,
    fontSize: 18,
  },
  buttonLight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 50,
    width: 50,
    alignSelf: 'center',
    borderColor: colors.text,
    borderWidth: 2,
  },
  buttonLightActive: {
    backgroundColor: colors.text,
  },
});