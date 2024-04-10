import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  RefreshControl,
} from 'react-native'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import AnnoucementCard from '../../components/AnnoucementCard'
import { ActivityIndicator } from 'react-native-paper'
import theme from '../../core/theme'
import axios from '../../api/axios'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-ico-material-design'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import * as DocumentPicker from 'expo-document-picker'
import nanoid from '../../helpers/nanoid'

const AnnouncementScreen = (props) => {
 

  const uid = props.route.params.uid
  const token = props.route.params.token
  const roomCode = props.route.params.roomCode
  const roomId = props.route.params.roomId

  const CreateAnnounceButtonSheetModalRef = useRef(null)
  const snapPoints = ['48%']
  const handleAnnounceButtonPress = () => {
    CreateAnnounceButtonSheetModalRef.current?.present()
  }
  const closeCreateAnnounceButtonSheet = () => {
    CreateAnnounceButtonSheetModalRef.current?.close()
  }

  const AnnounceButtonSheet = () => {
    const [selectedFiles, setFile] = useState([])
    const [annoucementMessage, setAnnoucementMessage] = useState({
      value: '',
      error: '',
    })

    const pickSomething = async () => {
      try {
        const docRes = await DocumentPicker.getDocumentAsync({multiple:true});
        setFile(docRes)
        console.log(docRes)
       
      } catch (error) {
        console.log("Error while selecting file: ", error);
      }
    };
    
    const handleAnnoucement = async () => {
      try {
        if (
          !annoucementMessage.value ||
          annoucementMessage.value.length === 0
        ) {
          setAnnoucementMessage((prev) => ({
            ...prev,
            error: 'Message should not be empty!',
          }))
        } else {
          console.log('InsideFile:', selectedFiles)
          const response = await axios.post(
            '/api/post/createPost',
            {
              teamID: roomId,
              content: annoucementMessage.value,
              files: selectedFiles,
            },
            {
              headers: {
                authorization: `Token ${token}`,
                uid: uid,
                uploadid: nanoid(),
              },
            }
          )

          if (response.status === 200) {
            setAnnoucementMessage({ value: '', error: '' })
            setFile(null)
            closeCreateAnnounceButtonSheet()
            setUpdate(update + 1)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <View>
        <TextInput
          multiline={true}
          label="Annoucement Message"
          returnKeyType="next"
          value={annoucementMessage.value}
          onChangeText={(text) =>
            setAnnoucementMessage({ value: text, error: '' })
          }
          error={!!annoucementMessage.error}
          errorText={annoucementMessage.error}
        />
        <View>
          {selectedFiles?.assets && selectedFiles?.assets.length > 0 ? (
            selectedFiles.assets.map((file, index) => (
              <Text style={{color: theme.colors.primary}} key={index}>{file.name}</Text>
            ))
          ) : (
            <></>
          )}
        </View>
        <Button
          labelStyle={{ color: '#ffffff' }}
          mode="contained"
          onPress={pickSomething}
        >
          Select Files
        </Button>
        <Button
          labelStyle={{ color: '#ffffff' }}
          mode="contained"
          onPress={handleAnnoucement}
        >
          Make Annoucement
        </Button>
      </View>
    )
  }

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
      setIsAdmin(response.data.isAdmin)
      setAnnouncementContent(response.data.teamPosts)
    }
  }
  useEffect(() => {
    getAnnouncements()
  }, [update])

  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true) // Set refreshing state to true when pull-to-refresh is triggered
    getAnnouncements()
    setRefreshing(false) // Set refreshing state to false when pull-to-refresh is triggered
  }

  return (
    <BottomSheetModalProvider>
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
              isAdmin={isAdmin}
              setUpdate={setUpdate}
            />
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.AnnounceButton}
          onPress={handleAnnounceButtonPress}
        >
          <Icon name="rounded-add-button" height={40} width={40} color="#fff" />
        </TouchableOpacity>
        {/* Add Plus Bottom Sheet */}
        <BottomSheetModal
          style={styles.bottomSheet}
          backgroundStyle={{
            borderRadius: 40,
            backgroundColor: theme.colors.tertiary,
          }}
          ref={CreateAnnounceButtonSheetModalRef}
          index={0}
          snapPoints={['70%']}
        >
          <View>
            <AnnounceButtonSheet />
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
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
  AnnounceButton: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary, // Adjust button color as needed
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Add elevation for Android shadow effect
  },
  bottomSheet: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
})

export default AnnouncementScreen
