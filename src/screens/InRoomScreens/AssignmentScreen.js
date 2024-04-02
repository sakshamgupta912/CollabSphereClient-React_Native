import { useEffect, useState, useRef } from 'react'
import { useRoute } from '@react-navigation/native'
import React from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import Icon from 'react-native-ico-material-design'
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import Button from '../../components/Button'
import theme from '../../core/theme'
import * as DocumentPicker from 'expo-document-picker'
import axios from '../../api/axios'

const AssignmentScreen = (props) => {
  const uid = props.route.params.uid
  const token = props.route.params.token
  const roomCode = props.route.params.roomCode
  const roomId = props.route.params.roomId

  const [AssignmentContent, setAssignmentContent] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  // const [pageContent, setPageContent] = useState(null);
  const [update, setUpdate] = useState(0)

  const CreateAssignmentButtonSheetModalRef = useRef(null)
  const snapPoints = ['48%']
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const handleAssignmentButtonPress = (assignment) => {
    setSelectedAssignment(assignment)
    CreateAssignmentButtonSheetModalRef.current?.present()
  }
  const closeCreateAssignmentButtonSheet = () => {
    CreateAssignmentButtonSheetModalRef.current?.close()
  }

  const BottomSheetContent = () => {
    const [bottomSheetData, setBottomSheetData] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)

    async function getAssignmentContent() {
      try {
        const response = await axios.post(
          '/api/assignment/getAssignment',
          {
            assignmentID: selectedAssignment._id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              uid: uid,
              authorization: `Bearer ${token}`,
            },
          }
        )

        setBottomSheetData(response.data.assignment)
      } catch (error) {
        console.error('Error fetching assignment content:', error)
      }
    }

    // Function to handle file selection
    const selectFile = async () => {
      try {
        const file = await DocumentPicker.getDocumentAsync({ type: '*/*' })
        setSelectedFile(file)
      } catch (error) {
        console.error('Error selecting file:', error)
      }
    }

    // Function to handle file submission
    const submitFile = async () => {
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.type,
        })

        try {
          const response = await axios.post(
            '/api/assignment/submitFile',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                uid: uid,
                authorization: `Bearer ${token}`,
              },
            }
          )

          // Handle response if needed
          console.log('File submitted successfully:', response.data)
        } catch (error) {
          console.error('Error submitting file:', error)
          Alert.alert('Error', 'Failed to submit file. Please try again.')
        }
      } else {
        Alert.alert('Error', 'Please select a file before submitting.')
      }
    }

    // Call getAssignmentContent when component mounts
    useEffect(() => {
      getAssignmentContent()
    }, [])
    console.log(bottomSheetData)
    // Render buttons only when bottomSheetData.description is valid
    if (!bottomSheetData?.description) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      )
    }

    return (
      <View style={styles.post}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>
              {bottomSheetData?.title ? bottomSheetData.title : 'Loading...'}
            </Text>
            <Text style={styles.date}>
              {bottomSheetData?.dueDate
                ? 'Due on ' + formatDueDate(bottomSheetData?.dueDate)
                : ''}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>
          {bottomSheetData?.description ? bottomSheetData.title : ''}
        </Text>

        <View style={styles.filesContainer}>
          {bottomSheetData?.files.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <Icon name="attachment-clip" color="#000" />
              <Text style={styles.fileName}>{file.originalname}</Text>
              {/* <Text style={styles.fileType}>{file.mimetype}</Text> */}
            </View>
          ))}
        </View>
        {/* Display selected file name if available */}
       
        {selectedFile && (
          <Text style={styles.fileName2} color="black">{selectedFile?.assets[0]?.name}</Text>
        )}
        <Button
          labelStyle={{ color: '#ffffff' }}
          style={{ backgroundColor: 'grey' }}
          mode="contained"
          onPress={selectFile}
        >
          Select File
        </Button>

        {/* Button to submit file */}
        <Button
          labelStyle={{ color: '#ffffff' }}
          mode="contained"
          onPress={submitFile}
        >
          Submit
        </Button>

        <View style={styles.actions}></View>
      </View>
    )
  }

  const colors = [
    // { backgroundColor: '#e2caf8', titleColor: '#8a2be2' },
    // { backgroundColor: '#bfdfdf', titleColor: '#008080' },
    { backgroundColor: '#bfdfdf', titleColor: '#008080' },
    // { backgroundColor: '#ffdcb2', titleColor: '#ff8c00' },
  ]

  function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
  }

  useEffect(() => {
    async function getAssignments() {
      const response = await axios.post(
        '/api/teams/teamAssignments',

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
        setIsAdmin(response.data.isAdmin)
        setAssignmentContent(response.data.teamAssignments)

        // setPageContent(response.data.teamAssignments.map(createAssignmentCard))
        // cards = response.data.teamAssignments.map(createAssignmentCard)

        // setAnnouncementContent(response.data.teamPosts);
      }
    }

    getAssignments()
  }, [update])

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  // Card creation
  const renderAssignmentCard = ({ item }) => {
    const randomColor = getRandomColor()
    return (
      <View
        style={[styles.card, { backgroundColor: randomColor.backgroundColor }]}
      >
        <Text style={[styles.cardTitle, { color: randomColor.titleColor }]}>
          {item.title}
        </Text>
        <View style={styles.cardDates}>
          <Text style={styles.cardDate}>{formatDueDate(item.dueDate)}</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleAssignmentButtonPress(item)}
            >
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        {}
        <FlatList
          data={AssignmentContent}
          contentContainerStyle={styles.listContainer}
          renderItem={renderAssignmentCard}
          keyExtractor={(item) => item._id.toString()}
        />
      </View>

      <BottomSheetModal
        style={styles.bottomSheet}
        backgroundStyle={{
          borderRadius: 40,
          backgroundColor: theme.colors.tertiary,
        }}
        ref={CreateAssignmentButtonSheetModalRef}
        index={0}
        snapPoints={['70%']}
      >
        {selectedAssignment && (
          <View>
            <BottomSheetContent />
            {/* Render other assignment details */}
          </View>
        )}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#A9A9A9',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  fileName: {
    paddingLeft: 5,
    color: theme.colors.primary,
  },
  fileName2: {
    
    color: theme.colors.primary,
  },
  cardDates: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  cardDate: {
    color: '#888',
  },
  cardContent: {
    justifyContent: 'space-between',
  },
  attendeesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  attendeeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -10,
    borderWidth: 0.5,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginTop: 15,
    backgroundColor: '#DCDCDC',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#000000',
  },
  fileItem: {
    flexDirection: 'row',
  },
  AssignmentButton: {
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
    padding: 10,
  },
  post: {
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#808080',
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 15,
    color: 'gray',
  },
  description: {
    fontSize: 15,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  actionText: {
    fontSize: 18,
    color: '#3b5998',
  },
  actionCount: {
    fontSize: 18,
    marginLeft: 5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default AssignmentScreen
