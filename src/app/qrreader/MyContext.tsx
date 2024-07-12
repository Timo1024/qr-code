import React, { Dispatch, SetStateAction } from 'react';

interface DataContextType {
    sharedValue: boolean;
    setSharedValue: Dispatch<SetStateAction<boolean>>;
    topic: string;
    setTopic: Dispatch<SetStateAction<string>>;
    title: string;
    setTitle: Dispatch<SetStateAction<string>>;
    subtitle: string;
    setSubtitle: Dispatch<SetStateAction<string>>;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
    additional_information: string;
    setAdditionalInformation: Dispatch<SetStateAction<string>>;
    tags: string[];
    setTags: Dispatch<SetStateAction<string[]>>;
  }

const MyContext = React.createContext<DataContextType>({
    sharedValue: false,
    setSharedValue: () => {},
    topic: "",
    setTopic: () => {},
    title: "",
    setTitle: () => {},
    subtitle: "",
    setSubtitle: () => {},
    description: "",
    setDescription: () => {},
    additional_information: "",
    setAdditionalInformation: () => {},
    tags: [],
    setTags: () => {}
});

export default MyContext;