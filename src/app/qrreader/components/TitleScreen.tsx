import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';

import { NavigationProp, RouteProp } from '@react-navigation/native';

import { colors } from '../resources/constants/colors.json';

import TopBar from './TopBar';
import Heading from './Heading';
import Description from './Description';
import Line from './Line';
import AdditionalInfos from './AdditionalInfos';
import QRButton from './QRButton';

type TitleScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const TitleScreen = ({ navigation, route }: TitleScreenProps) => {

  var data = route.params?.qrData;

  var empty = false;

  if(data == null) {
    data = "QR code scanner\n\n\n\n";
    empty = true;
  }

  // split the data into an object with 
  // 1. topic
  // 2. title
  // 3. subtitle
  // 4. description
  // 5. additional information (e.g. link to a website)
  // all parts should be separated by a newline character

  var parts = data.split('\n');
  var topic = parts[0];
  var title = parts[1];
  var subtitle = parts[2];
  var description = parts[3];
  var additional_information = parts[4];

  // check if any of the parts are null
  if(topic == null || title == null || subtitle == null || description == null || additional_information == null) {
    empty = true;
  }

  return (
    <View style={styles.title_screen_view}>
        <TopBar title={topic} />
        {!empty && (
          <>
            <Heading main={title} sub={subtitle} />
            <Line/>
            <Description text={description} />
            <AdditionalInfos text={additional_information} />
            <QRButton navigation={navigation} fill={false} />
          </>
        )}
        {empty && (
          <>
            <QRButton navigation={navigation} fill={true} />
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