import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
const keys = require('../resources/constants/keys.json') as { encrypt_key: string };

import { NavigationProp, RouteProp } from '@react-navigation/native';

import { colors } from '../resources/constants/colors.json';

import TopBar from './TopBar';
import Heading from './Heading';
import Description from './Description';
import Line from './Line';
import AdditionalInfos from './AdditionalInfos';
import QRButton from './QRButton';
import WebsiteMetadata from './DisplayWebsite';
import InitialButtons from './InitialButtons';

type TitleScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const key = keys.encrypt_key;

function hexToBytes(hex: string): number[] {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substring(i, i + 2), 16));
  }
  return bytes;
}

function bytesToString(bytes: number[]): string {
  let decodedString = '';
  for (let i = 0; i < bytes.length; i++) {
      decodedString += String.fromCharCode(bytes[i]);
  }
  return decodedString;
}

// Function to decrypt the data
function decryptData(encoded_string: string, key: string) {

    // convert key to a number
    var key_int : number = parseInt(key);

    const encryptedBytes = hexToBytes(encoded_string);
    
    // Simple decoding algorithm: XOR with the same key used for encryption
    // const key_ = 0xAB;  // Same key used in Python example
    const decryptedBytes = encryptedBytes.map(byte => byte ^ key_int);
    
    // Convert bytes back to UTF-16 string
    const decryptedString = bytesToString(decryptedBytes);
    
    return decryptedString;
}

const TitleScreen = ({ navigation, route }: TitleScreenProps) => {  

  var data = route.params?.qrData;

  var empty = false;

  // console.log({data});

  if(data == null) {
    data = "QR code scanner\n\n\n\n";
    empty = true;
  }

  // check if data starts with "(^_^)" and then remove it
  if(data.startsWith("(^_^)")) {
    data = data.substring(5);

    // console.log({key});
    
    // decrypt the data
    // TODO: implement decryption
    const decryptedData = decryptData(data, key);

    // console.log({decryptedData});
    
    data = decryptedData;
    
  }

  // split the data into an object with 
  // 1. topic
  // 2. title
  // 3. subtitle
  // 4. description
  // 5. additional information (e.g. link to a website)
  // all parts should be separated by a newline character
  
  // make 0 topic, 1 title, 2 subtitle, last additional information and the rest description
  var parts = data.split("\n");
  var topic = parts[0];
  var title = parts[1];
  var subtitle = parts[2];
  var description = parts.slice(3, parts.length - 1).join("\n");
  var additional_information = parts[parts.length - 1];  

  function isUrl(string: string): boolean {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  }

  var justLink = false;
  var justDescription = false;

  // check if any of the parts are null
  if(topic == null || title == null || subtitle == null || description == null || additional_information == null) {
    // empty = true;
    var x = 0;
    // check if the data is a link
    if(isUrl(data)) {
      justLink = true;
    } else {
      justDescription = true;
    }

  }

  return (
    <View style={styles.title_screen_view}>
        {/* <WebsiteMetadata url="https://en.wikipedia.org/wiki/Chemokine" /> */}
        {!empty && !justLink && !justDescription && (
          <>
            <TopBar title={topic} />
            <Heading main={title} sub={subtitle} />
            <Line/>
            <Description text={description} />
            <AdditionalInfos text={additional_information} />
            <QRButton navigation={navigation} fill={false} data={data} />
          </>
        )}
        {justLink && (
          <>
            <TopBar title="Scanned QR-Code" />
            <WebsiteMetadata url={data} />
            <QRButton navigation={navigation} fill={false} data={data} />
          </>
        )}
        {justDescription && (
          <>
            <TopBar title="QR-Code Scanner" />
            <Heading main="Your scanned QR-Code" sub="" />
            <Line/>
            <Description text={data} />
            <QRButton navigation={navigation} fill={false} data={data} />
          </>
        )}
        {empty && (
          <>
            <TopBar title="QR-Tools" />
            <InitialButtons navigation={navigation} />
            {/* TODO remove when finished debugging */}
            {/* add button whihc redirects to DBDebugScreen */}
            {/* <Button title="DB Debug Screen" onPress={() => navigation.navigate('DBDebug', { qrData: null })} /> */}
          </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  title_screen_view : {
    flex: 1,
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 0,
    backgroundColor: colors.primary
  }
});

export default TitleScreen;