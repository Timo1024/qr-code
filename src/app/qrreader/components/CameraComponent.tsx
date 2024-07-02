import React, { useRef } from 'react';
import { Text, View } from 'react-native';
import { RNCamera, TakePictureOptions } from 'react-native-camera';

const CameraComponent = () => {
    const cameraRef = useRef(null);
  
    const onBarCodeRead = (scanResult: any) => {
      console.log(scanResult);
    };
  
    return (
      <View style={{ flex: 1 }}>
        <RNCamera
          ref={cameraRef}
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          onBarCodeRead={onBarCodeRead}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          <Text style={{ fontSize: 14 }}>Point your camera at a QR code.</Text>
        </RNCamera>
      </View>
    );
};

export default CameraComponent;