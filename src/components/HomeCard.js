import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

const HomeCard = (props) => {
  
  return (
    <View >
      <Card style={styles.card}>
        <Image 
          source={{ uri: props.src }}
          style={styles.image}
        />
        <Card.Title
          title= {props.title}
          subtitle={props.subtitle}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
 
 card: {
  margin: 10,
  borderRadius: 5
 },
  image: {
    borderRadius: 5,
    height: 100, // Adjust the height as needed
  },
});

export default HomeCard;
