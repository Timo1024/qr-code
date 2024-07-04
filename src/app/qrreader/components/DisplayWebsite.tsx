import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';

import { colors } from '../resources/constants/colors.json';
import LinkSvgComponent from './svg_components/link';
import CopyableText from './CopyableText';

const WebsiteMetadata = ({ url }: { url: string }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setTitle("");
    setDescription("");

    const fetchMetadata = async () => {
      try {
        const response = await fetch(url);
        const html = await response.text();

        // Extract title
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        if (titleMatch && titleMatch[1]) {
            setTitle(titleMatch[1]);
        } else {
            setTitle("")
        }

        // Extract description
        const descriptionMatch = html.match(/<meta name="description" content="(.*?)"/);
        if (descriptionMatch && descriptionMatch[1]) {
            setDescription(descriptionMatch[1]);
        } else {
            setDescription("")
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
  }, [url]);

  const handlePress = () => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
        {title != "" && 
            <Text style={styles.title}>{title}</Text>
        }
        {description != "" && 
            <Text style={styles.description}>{description}</Text>
        }
        <TouchableOpacity onPress={handlePress} style={styles.linkButton}>
            <Text style={styles.linkText}>Go to website</Text>
        </TouchableOpacity>
        <CopyableText textToCopy={ url } opacity={1} withText={true}/>
    </View>
  );
};

const styles = StyleSheet.create({
    linkButton: {
        borderColor: colors.accent,
        borderWidth: 2,
        padding: 15,
        borderRadius: 5,
        marginTop: 0,
        alignItems: 'center',
        width: '50%',
        alignSelf: 'center',
        marginBottom: 30,
    },
    linkText: {
        color: colors.accent,
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        // backgroundColor: "green",
        width: '100%',
    },
    title: {
        fontSize: 24,
        color: colors.text,
        marginBottom: 30,
    },
    description: {
        color: colors.text,
        marginBottom: 30,
        fontSize: 18,
        fontWeight: "200",
        lineHeight: 22,
    },
});

export default WebsiteMetadata;