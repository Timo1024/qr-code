import React from 'react';
import { RNCamera } from 'react-native-camera';
import { View } from 'react-native';

import { NavigationProp } from '@react-navigation/native';

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
    </View>
  );
};

export default ScannerScreen;