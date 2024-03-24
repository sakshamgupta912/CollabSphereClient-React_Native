import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import AnnoucementCard from '../../components/AnnoucementCard'
import { ActivityIndicator } from 'react-native-paper'
import theme from '../../core/theme'
import axios from '../../api/axios'

const AnnouncementScreen = (props) => {
  const uid = props.route.params.uid
  const token = props.route.params.token
  const roomCode = props.route.params.roomCode
  const roomId = props.route.params.roomId

  const [AnnouncementContent, setAnnouncementContent] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [update, setUpdate] = useState(0)

  const [posts, setPosts] = useState([])
  // const [posts, setPosts] = useState([
  //   {
  //     "_id": "651950fa9fe8a69e8d03f894",
  //     "content": "Hello test",
  //     "createdBy": {
  //         "_id": "6437875817d2bb41ea20917d",
  //         "email": "savar@gmail.com",
  //         "name": "Savar Srivastava"
  //     },
  //     "files": [
  //         {
  //             "_id": "651950fa9fe8a69e8d03f892",
  //             "originalname": "icon.png",
  //             "mimetype": "image/png"
  //         }
  //     ]
  //   },
  // ])
  useEffect(() => {
    async function getAnnouncements() {
      const response = await axios.post(
        '/api/teams/teamPosts',
        JSON.stringify({ teamID: roomId }),
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
            uid: uid,
          },
          withCredentials: true,
        }
      )

      if (response.status === 200) {
        setPosts(response.data.teamPosts)
        console.log(response.data.teamPosts)
        setIsAdmin(response.data.isAdmin)
        setAnnouncementContent(response.data.teamPosts)
      }
    }

    getAnnouncements()
  }, [update])

  const [refreshing, setRefreshing] = useState(false)

  useEffect(
    () => {
      // getPosts()
    }
    //  [uid, token]
  )

  const handleRefresh = () => {
    setRefreshing(true) // Set refreshing state to true when pull-to-refresh is triggered

    setRefreshing(false) // Set refreshing state to false when pull-to-refresh is triggered
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.postListContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]} // Customize the color of the refresh indicator
          />
        }
      >
        {posts.map((post) => (
          <AnnoucementCard
            key={post._id.toString()}
            post={post}
            uid={uid}
            token={token}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postListContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
  },
})

export default AnnouncementScreen
