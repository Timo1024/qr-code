import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';

const OffScreenQRCode = ({ QRtext }: { QRtext: string }) => {
  const qrRef = useRef(null);

  useEffect(() => {
    const generateAndSaveQRCode = async () => {
      if (qrRef.current) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const uri = await captureRef(qrRef.current, {
                format: 'png',
                quality: 0.8,
            });

            const filePath = `${RNFS.DocumentDirectoryPath}/qr_code.png`;
            await RNFS.moveFile(uri, filePath);

            console.log(`QR Code saved to ${filePath}`);
        } catch (error) {
            console.error('Failed to generate and save QR code:', error);
        }
      }
    };

    generateAndSaveQRCode();
  }, []);

  return (
    <View style={styles.offScreen}>
      <View ref={qrRef} style={{ width: 200, height: 200 }}>
        <QRCode value={QRtext} size={200} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  offScreen: {
  },
});

export default OffScreenQRCode;