import React from 'react';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

import { colors } from '../resources/constants/colors.json';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import BackarrowSvgComponent from './svg_components/backarrow';
import CancelSvgComponent from './svg_components/cancel';

type ScannerScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const { width, height } = Dimensions.get('window');

const ScannerScreen = ({ navigation, route }: ScannerScreenProps) => {
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
      <View style={[styles.overlay]}>
        <View style={styles.topOverlay} />
          <View style={styles.middleOverlay}>
            <View style={styles.sideOverlay} />
              <View style={styles.centerOverlay}>
                <Text style={styles.text}>Scan a QR code</Text>
              </View>
            <View style={styles.sideOverlay} />
          </View>
        <View style={styles.bottomOverlay} />
      </View>
      <View style={styles.button_view}>
        {/* <Text style={styles.scannerText}>Scan a QR code</Text> */}
        <TouchableOpacity onPress={() => navigation.navigate('Title', { qrData: route.params?.qrData })} style={styles.button_main}>
            <CancelSvgComponent />
            <Text style={styles.scannerButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScannerScreen;

var backgroundColor = 'rgba(0, 0, 0, 0.5)';

const styles = StyleSheet.create({
  button_view : {
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 30,
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // margin: 20,
    width: '100%',
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
    // backgroundColor: colors.primary,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    // width: '30%',
    alignSelf: 'center',
    borderColor: colors.text,
    borderWidth: 2,
  },
  scannerButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    width: width * 0.1,
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
});