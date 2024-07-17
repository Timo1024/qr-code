import React from 'react';
import { Text, View } from 'react-native';

const MarkdownComponent = ({ content }: { content: string }) => {
  const words = content.split(' ');

  return (
    <View>
      {words.map((word, index) => {
        if (word.startsWith('**') && word.endsWith('**')) {
          return <Text key={index} style={{ fontWeight: 'bold' }}>{word.slice(2, -2)}</Text>;
        } else if (word.startsWith('*') && word.endsWith('*')) {
          return <Text key={index} style={{ fontStyle: 'italic' }}>{word.slice(1, -1)}</Text>;
        } else {
          return <Text key={index}>{word}</Text>;
        }
      })}
    </View>
  );
};

export default MarkdownComponent;