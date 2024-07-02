import React from 'react';
import { Button, Text, View } from 'react-native';

import { NavigationProp, RouteProp } from '@react-navigation/native';

type TitleScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const TitleScreen = ({ navigation, route }: TitleScreenProps) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Title Screen</Text>
      {route.params?.qrData && <Text>QR Code Data: {route.params.qrData}</Text>}
      <Button
        title="Scan QR Code"
        onPress={() => navigation.navigate('Scanner')}
      />
    </View>
  );
};

export default TitleScreen;