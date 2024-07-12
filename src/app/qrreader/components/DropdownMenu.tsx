import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors } from '../resources/constants/colors.json';

import ArrowTopSvgComponent from './svg_components/arrowTop';
import ArrowDownSvgComponent from './svg_components/arrowBottom';

type DropdownMenuProps = {
    options: string[];
    setIsOpen: (isOpen: boolean) => void;
    isOpen: boolean;
    onChange: () => void;
    search: string;
    option: string;
    setOption: (option: string) => void;
};

const DropdownMenu = ({ options, setIsOpen, isOpen, onChange, search, option, setOption }: DropdownMenuProps) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        if (selectedOption !== null) {
            onChange();
        }
    }, [option]);

    const handleOpen = () => setIsOpen(!isOpen);

    const handleSelect = (option: string) => {
        setOption(option);
        setSelectedOption(option);
        setIsOpen(false);
    };

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={handleOpen} style={styles.active}>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode='tail'>{selectedOption || "All"}</Text>
            <View style={styles.icon_wrapper}>
                {isOpen ? 
                    <ArrowTopSvgComponent height={15} width={15} color={colors.text} /> 
                    : 
                    <ArrowDownSvgComponent height={15} width={15} color={colors.text} />
                }
            </View>
        </TouchableOpacity>
        <View style={styles.verticalLine}></View>
        {isOpen && (
            <View style={styles.dropdown}>
            {options.map((option : string, index: React.Key | null | undefined) => (
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
        alignSelf: "center"
    },
});

export default DropdownMenu;
