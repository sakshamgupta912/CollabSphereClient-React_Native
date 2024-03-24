import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Title, Subheading, TouchableRipple } from 'react-native-paper'; // Import Title, Subheading, and TouchableRipple from react-native-paper
import { useNavigation } from '@react-navigation/native';

const HomeCard = ({ room, uid, token }) => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('InRoomScreen', { roomId: room._id, roomCode: room.code, uid: uid, token: token });
  }
  return (
    <View>
      <TouchableRipple
        onPress={onPress}
        rippleColor="rgba(0, 0, 0, .32)"
        style={styles.touchable}
        borderless={true}
      >
        <Card style={styles.card}>
          <Image source={{ uri: 'https://t4.ftcdn.net/jpg/03/16/39/05/360_F_316390528_pdGvI0V4C7eIamSYifI0Faj9dp9XEoLu.jpg' }} style={styles.image} />
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
  },
  touchable: {
    marginHorizontal:10,
    marginVertical:5,
    borderRadius: 5 
  },
});


export default HomeCard;
