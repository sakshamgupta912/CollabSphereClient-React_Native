import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import HomeCard from '../../components/HomeCard';

const HomeScreen = () => {
  
  return (
    <View >
      {/* <Card style={styles.card}>
        <Image 
          source={{ uri: 'https://collabsphereclient.azurewebsites.net/static/media/React.36a9ed4ee07e58b5c82d.jpg' }}
          style={styles.image}
        />
        <Card.Title
          title="Card Title"
          subtitle="Card Subtitle"
        />
      </Card>
      <Card style={styles.card}>
        <Image 
          source={{ uri: 'https://collabsphereclient.azurewebsites.net/static/media/React.36a9ed4ee07e58b5c82d.jpg' }}
          style={styles.image}
        />
        <Card.Title
          title="Card Title"
          subtitle="Card Subtitle"
        />
      </Card> */}
      <HomeCard src='https://collabsphereclient.azurewebsites.net/static/media/React.36a9ed4ee07e58b5c82d.jpg' title='Lorem' subtitle='Lorem Classroom'></HomeCard>
    </View>
  );
};

export default HomeScreen;
