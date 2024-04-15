import React from 'react'
import { useState, useEffect, useRef ,useContext} from 'react'
import { FlatList } from 'react-native'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-ico-material-design'
import HomeCard from '../../components/HomeCard'
import TextInput from '../../components/TextInput'
import { ScrollView, RefreshControl } from 'react-native-gesture-handler'
import theme from '../../core/theme'
import axios from '../../api/axios'
import AsyncStorage from '@react-native-async-storage/async-storage' // Import AsyncStorage
import { ActivityIndicator } from 'react-native-paper'
import { Title } from 'react-native-paper'
import SwitchSelector from 'react-native-switch-selector'
import MemberCard from '../../components/MemberCard'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import Button from '../../components/Button'
import { Alert } from 'react-native'
import { useSharedState } from '../../core/SharedStateContext';

const AssignmentScreen = () => {
  const { state, updateState } = useSharedState();


  const [token, setToken] = useState()
  const [uid, setUID] = useState()
  const [update, setUpdate] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [AssignmentContent, setAssignmentContent] = useState([])
  async function auth() {
    try {
      const t = await AsyncStorage.getItem('token')
      const u = await AsyncStorage.getItem('uid')
      setToken(t)
      setUID(u)
      setUpdate((prev) => prev + 1)
    } catch (e) {
      console.log('Auth function error: ' + e)
      Alert.alert('Auth function error: ' + e)
    }
  }
  useEffect(() => {
    auth()
  }, [])

  async function getAnnouncements() {
    try{
      const response = await axios.get('/api/assignment/assignments', {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
          uid: uid,
        },
        withCredentials: true,
      })
  
      if (response.status === 200) {
        setAssignmentContent(response.data.assignments)
        // cards = response.data.assignments.map(createAssignmentCard);
        // setPageContent(response.data.assignments.map(createAssignmentCard));
      }
    }
    catch(error)
    {
      Alert.alert('Error fetching all announcements:', error)
    }
    
  }

  useEffect(() => {
    getAnnouncements()
  }, [update,state])

  // Bottom sheet content
  const ShowAssignmentSheetModalRef = useRef(null)
  const snapPoints = ['48%']
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  // Card creation

  const handleAssignmentCardPress = (assignment) => {
    setSelectedAssignment(assignment)
    ShowAssignmentSheetModalRef.current?.present()
  }
  const closeShowAssignmentSheet = () => {
    ShowAssignmentSheetModalRef.current?.close()
  }

  const BottomSheetContent = () => {
    const [bottomSheetData, setBottomSheetData] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [submittedBy, setSubmittedBy] = useState([])
    const [notSubmittedBy, setNotSubmittedBy] = useState([])
    const [showSubmitted, setShowSubmitted] = useState(true)
    const [showNotSubmitted, setShowNotSubmitted] = useState(false)
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

        if (response.status === 200) {
          setIsAdmin(response.data.isAdmin)
          setBottomSheetData(response.data.assignment)
          setSubmittedBy((prev) => response.data.assignment.submittedBy)
          setNotSubmittedBy((prev) => response.data.assignment.notSubmittedBy)
        }

        if (response.data.assignment.submitted) {
          setButtonText('Un-Submit')
        } else {
          setButtonText('Submit')
        }
      } catch (error) {
        Alert.alert('Error fetching assignment content:', error)
      }
    }

    // Function to handle file selection
    const selectFile = async () => {
      try {
        const file = await DocumentPicker.getDocumentAsync({ type: '*/*' })
        setSelectedFile(file)
      } catch (error) {
        Alert.alert('Error selecting file:', error)
      }
    }

    const [buttonText, setButtonText] = useState('Submit')

    // Function to handle file submission
    const submitFile = async () => {
      if (buttonText === 'Submit') {
        if (selectedFile) {
          const formData = new FormData()
          formData.append('file', {
            uri: selectedFile.uri,
            name: selectedFile.name,
            type: selectedFile.type,
          })

          const response = await axios.post(
            '/api/assignment/submitAssignment',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                uid: uid,
                authorization: `Token ${token}`,
                uploadid: nanoid(),
              },
            }
          )

          if (response.status === 200) {
            closeShowAssignmentSheet()
            setButtonText('Un-Submit')
          }
        } else {
          Alert.alert('Error', 'Please select a file before submitting.')
        }
      } else {
        try {
          const response = await axios.put(
            '/api/assignment/unSubmitAssignment',
            {},
            {
              headers: {
                authorization: `Token ${token}`,
                uid: uid,
                assid: selectedAssignment._id,
              },
            }
          )
          if (response.status === 200) {
            setButtonText('Submit')
            setUpdate((prev) => prev + 1)
          }
        } catch (error) {
          Alert.alert('Error', 'Something went wrong. Please try again.')
        }
      }
    }

    // Call getAssignmentContent when component mounts
    useEffect(() => {
      getAssignmentContent()
    }, [])

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
            <View>
              <Text style={styles.name}>
                {bottomSheetData?.title ? bottomSheetData.title : 'Loading...'}
              </Text>
              <Text>
                {bottomSheetData?.grade
                  ? 'Graded out of ' + bottomSheetData.grade
                  : 'Loading...'}
              </Text>
            </View>

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
          <Text style={styles.fileName2} color="black">
            {selectedFile?.assets[0]?.name}
          </Text>
        )}
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: theme.colors.secondary,
          }}
        ></View>
        {!isAdmin && (
          <View>
            {buttonText === 'Submit' && (
              <Button
                labelStyle={{ color: '#ffffff' }}
                style={{ backgroundColor: 'grey' }}
                mode="contained"
                onPress={selectFile}
              >
                Select File
              </Button>
            )}

            {/* Button to submit file */}
            <Button
              labelStyle={{ color: '#ffffff' }}
              mode="contained"
              onPress={submitFile}
            >
              {buttonText}
            </Button>
          </View>
        )}

        {isAdmin && (
          <SwitchSelector
            style={{ marginTop: 10 }}
            initial={0}
            onPress={(value) => {
              if (value === 'submitted') {
                setShowSubmitted(true)
                setShowNotSubmitted(false)
              } else {
                setShowSubmitted(false)
                setShowNotSubmitted(true)
              }
            }}
            textColor="grey" //  {theme.colors.secondary}
            selectedColor="white"
            buttonColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            hasPadding
            options={[
              { label: 'Submitted', value: 'submitted' },
              { label: 'Not Submitted', value: 'notsubmiited' },
            ]}
          />
        )}
        <ScrollView style={{ height: '70%' }}>
          {isAdmin &&
            showSubmitted &&
            submittedBy.map((student) => (
              <MemberCard
                key={student._id}
                name={student.name}
                email={student.email}
              />
            ))}
          {showNotSubmitted &&
            notSubmittedBy.map((student) => (
              <MemberCard
                key={student._id}
                name={student.name}
                email={student.email}
              />
            ))}
        </ScrollView>
      </View>
    )
  }
  const colors = [
    // { backgroundColor: '#e2caf8', titleColor: '#8a2be2' },
    // { backgroundColor: '#bfdfdf', titleColor: '#008080' },
    { backgroundColor: '#bfdfdf', titleColor: '#008080' },
    // { backgroundColor: '#ffdcb2', titleColor: '#ff8c00' },
  ]

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
  }
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
              onPress={() => handleAssignmentCardPress(item)}
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
        ref={ShowAssignmentSheetModalRef}
        index={0}
        snapPoints={['95%']}
      >
        {selectedAssignment && (
          <View>
            <BottomSheetContent />
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
  bottomSheet2: {
    padding: 20,
  },

  AddAssignmentButton: {
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
  post: {
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    // borderBottomWidth: 0.5,
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
