import React, { useEffect } from 'react';
import { View, Text ,StatusBar} from 'react-native';

const AnnouncementScreen = (props) => {
 
  return (
    <View>
     <StatusBar hidden /> 
      <Text>{props.route.params.roomId}</Text>
    
    </View>
  );
};

export default AnnouncementScreen;
