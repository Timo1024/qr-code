import React from 'react';
import { View, Dimensions } from 'react-native';

import { colors } from '../resources/constants/colors.json';

const Line = () => {
    const screenWidth = Dimensions.get('window').width;
    return (
        <View
        style={{
            height: 1,
            width: screenWidth * 0.9,
            backgroundColor: colors.text,
            borderRadius: 50,
            alignSelf: 'center',
            opacity: 0.4,
        }}
        />
    );
};

export default Line;