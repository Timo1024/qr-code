import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';

import { colors } from '../resources/constants/colors.json';

import ArrowTopSvgComponent from './svg_components/arrowTop';
import ArrowDownSvgComponent from './svg_components/arrowBottom';

const DropdownMenu = ({ options }: { options: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOpen = () => setIsOpen(!isOpen);

  const handleSelect = (option: React.SetStateAction<string | null>) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
        {/* <Button title={selectedOption || "Select an option"} onPress={handleOpen} /> */}
        <TouchableOpacity onPress={handleOpen} style={styles.active}>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode='tail'>{selectedOption || "Select"}</Text>
            <View style={styles.icon_wrapper}>
                {isOpen ? <ArrowTopSvgComponent height={15} width={15} color={colors.text} /> : <ArrowDownSvgComponent height={15} width={15} color={colors.text} />}
            </View>
        </TouchableOpacity>
        <View style={styles.verticalLine}></View>
        {isOpen && (
            <View style={styles.dropdown}>
            {options.map((option, index) => (
                <TouchableOpacity key={index} style={styles.option} onPress={() => handleSelect(option)}>
                    <Text style={styles.text}>{option}</Text>
                </TouchableOpacity>
            ))}
            </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: 'row',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 997,
        elevation: 998,
    },
    dropdown: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: colors.secondary,
        borderRadius: 5,
        padding: 10,
    },
    option: {
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    active: {
        display: 'flex',
        width: "100%",
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
    },
    verticalLine: {
        position: 'absolute',
        left: 100,
        top: 0,
        width: 0,
        height: "100%",
        borderLeftWidth: 0.5,
        borderLeftColor: colors.text,
    },
    icon_wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink',
        alignSelf: "center"
    },
});

export default DropdownMenu;
