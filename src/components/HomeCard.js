import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Title, Subheading, TouchableRipple } from 'react-native-paper'; // Import Title, Subheading, and TouchableRipple from react-native-paper
import { useNavigation } from '@react-navigation/native';


const HomeCard = ({ room, uid, token }) => {
  const navigation = useNavigation();
  const [imagePath, setImagePath] = React.useState(require('../assets/Others.jpg')); // [1
 
  const onPress = () => {
    navigation.navigate('InRoomScreen', { roomId: room._id, roomCode: room.code, uid: uid, token: token });
  }
 
  React.useEffect(() => {
    if (room.name === 'Node') {
      setImagePath(require('../assets/Node.jpg'));
    }
    else if (room.name === 'React') {
      setImagePath(require('../assets/React.jpg'));
    }
    else if (room.name === 'Maths')
    {
      setImagePath(require('../assets/Maths.jpg'));
    }
    else if (room.name === 'English')
    {
      setImagePath(require('../assets/English.jpg'));
    }
    else if (room.name === 'History')
    {
      setImagePath(require('../assets/History.jpg'));
    }
    else{
      setImagePath(require('../assets/Others.jpg'));
    }
  }, [room.name]);

  
  
  return (
    <View>
      <TouchableRipple
        onPress={onPress}
        rippleColor="rgba(0, 0, 0, .32)"
        style={styles.touchable}
        borderless={true}
      >
        <Card style={styles.card}>
          <Image source={imagePath} style={styles.image} />
          <Card.Content>
            <Title>{room.name}</Title>
            <Subheading>{room.createdBy.name}</Subheading>
          </Card.Content>
        </Card>
      </TouchableRipple>
    </View>
  )
}
const styles = StyleSheet.create({
  card: {
    margin:.8,
    borderRadius: 5,
    overflow: 'hidden', // Ensure content does not overflow with the elevation
    
    elevation: 2, // Add elevation for shadow effect
  },
  image: {
    borderRadius: 5,
    height: 100, // Adjust the height as needed
    resizeMode: 'cover' },
  touchable: {
    marginHorizontal:10,
    marginVertical:5,
    borderRadius: 5 
  },
});


export default HomeCard;
