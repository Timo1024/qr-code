import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { NavigationProp, RouteProp, useFocusEffect } from '@react-navigation/native';

import { colors } from '../resources/constants/colors.json';

import TopBar from './TopBar';
import Heading from './Heading';
import Description from './Description';
import Line from './Line';
import AdditionalInfos from './AdditionalInfos';
import WebsiteMetadata from './DisplayWebsite';
import InitialButtons from './InitialButtons';
import NavBar from './NavBar';
import CopyableText from './CopyableText';

import MyContext from '../MyContext';
import { getEntryByReference } from '../services/database';
import { ScrollView } from 'react-native-gesture-handler';
import Tags from './Tags';

type TitleScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
  db: any;
};

const TitleScreen = ({ navigation, route, db }: TitleScreenProps) => {  

  const { 
    sharedValue, setSharedValue, 
    topic, setTopic,
    title, setTitle,
    subtitle, setSubtitle,
    description, setDescription,
    additional_information, setAdditionalInformation,
    tags, setTags,
  } = useContext(MyContext);
  
  const [empty, setEmpty] = React.useState(true);
  const [justLink, setJustLink] = React.useState(false);
  const [freeText, setFreeText] = React.useState(false);
  const [structuredText, setStructuredText] = React.useState(false);

  const param = route.params?.qrData;

  const getData = React.useCallback(async () => {    
    var dataFromRoute = route.params?.qrData;
    console.log({dataFromRoute});
    
    if(dataFromRoute != null){      
      if(dataFromRoute.startsWith("(^_^)")) {
        // search in DB for this key
        getEntryByReference(db, dataFromRoute).then((result: any) => {
          console.log({result});
          if(result){
            result.topic && setTopic(result.topic);
            result.title && setTitle(result.title);
            result.subtitle && setSubtitle(result.subtitle);
            result.description && setDescription(result.description);
            result.additional && setAdditionalInformation(result.additional);
            result.tags && setTags(result.tags.split(';'));
          } else {
            setTopic("Scanned QR-Code");
            setDescription(dataFromRoute);
            setTitle("");
            setSubtitle("");
            setAdditionalInformation("");
            setTags([]);
          }
        });
      } else {
        setTopic("Scanned QR-Code");
        setDescription(dataFromRoute);
        setTitle("");
        setSubtitle("");
        setAdditionalInformation("");
        setTags([]);
      }
    }

    console.log("The data extracted from the QR-Code is:");
    console.log({topic, title, subtitle, description, additional_information, tags});
    

  }, [route.params?.qrData, db]);

  useFocusEffect(
    React.useCallback(() => {
      console.log({sharedValue});
      return () => {};
    }, [sharedValue])
  );
  
  useEffect(() => {
    console.log({param});
    if(param != null){      
      if(param.startsWith("(^_^)")) {
        // search in DB for this key
        getEntryByReference(db, param).then((result: any) => {
          console.log({result});
          if(result){
            result.topic && setTopic(result.topic);
            result.title && setTitle(result.title);
            result.subtitle && setSubtitle(result.subtitle);
            result.description && setDescription(result.description);
            result.additional && setAdditionalInformation(result.additional);
            result.tags && setTags(result.tags.split(';'));
          } else {
            setTopic("Scanned QR-Code");
            setDescription(param);
            setTitle("");
            setSubtitle("");
            setAdditionalInformation("");
            setTags([]);
          }
        });
      } else {
        setTopic("Scanned QR-Code");
        setDescription(param);
        setTitle("");
        setSubtitle("");
        setAdditionalInformation("");
        setTags([]);
      }
    }
  }, [param]);  

  useEffect(() => {
    setEmpty(true);
    setJustLink(false);
    setFreeText(false);
    setStructuredText(false);
    if(description && description !== "") {
      setEmpty(false);
      if(topic && title) {
        setStructuredText(true);
      } else {
        if(isUrl(description)) {
          setJustLink(true);
        } else {
          setFreeText(true);
        }
      }
    }
    console.log({empty, justLink, freeText, structuredText});
    console.log({topic, title, subtitle, description, additional_information, tags});
    
    
  }, [description, topic, title]);
  
  function isUrl(string: string): boolean {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  }

  return (
    <View style={styles.title_screen_view}>
      {empty && <TopBar title={"QR-Tools"} /> }
      {!empty && <TopBar title={topic} /> }
      {!empty && !justLink && 
        <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.scrollWrapper}>
              {structuredText && (
                <>
                  <Heading main={title} sub={subtitle ? subtitle : ""} />
                  <Line/>
                  <Description text={description} />
                  <AdditionalInfos text={additional_information} />
                  <Tags tags={tags} />
                </>
              )}
              {freeText && (
                <>
                  <Description text={description} />
                  <Tags tags={tags} />
                </>
              )}

            </ScrollView>
          </View>
        } 
        {justLink && (
                <View style={styles.justLink}>
                  <WebsiteMetadata url={description} />
                  <Tags tags={tags} />
                </View>
        )}
        {!empty && <CopyableText textToCopy={description}/>}
        {empty && (
          <>
            <InitialButtons navigation={navigation} />
          </>
        )}

        <NavBar navigation={navigation} active={[true, false, false, false]}/>
    </View>
  );
};

const styles = StyleSheet.create({
  title_screen_view : {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
  },
  scrollWrapper: {
    paddingRight: 20,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  justLink: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center',
  },
});

export default TitleScreen;