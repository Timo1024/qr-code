import React, { useState } from 'react';
import MyContext from './MyContext';

const DataProvider = ({ children } : { children: React.ReactNode }) => {
  const [sharedValue, setSharedValue] = useState(false);
  const [topic, setTopic] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [additional_information, setAdditionalInformation] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);


  return (
    <MyContext.Provider value={{ 
      sharedValue, setSharedValue, 
      topic, setTopic, 
      title, setTitle, 
      subtitle, setSubtitle,
      description, setDescription,
      additional_information, setAdditionalInformation,
      tags, setTags
      }}>
      {children}
    </MyContext.Provider>
  );
};

export default DataProvider;