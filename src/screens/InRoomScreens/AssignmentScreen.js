import { useEffect, useState, useRef } from 'react'
import { useRoute } from '@react-navigation/native'
import React from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import Icon from 'react-native-ico-material-design'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import MemberCard from '../../components/MemberCard'
import SwitchSelector from 'react-native-switch-selector'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import theme from '../../core/theme'
import * as DocumentPicker from 'expo-document-picker'
import nanoid from '../../helpers/nanoid'
import axios from '../../api/axios'
import { ScrollView } from 'react-native-gesture-handler'

const AssignmentScreen = (props) => {
  const uid = props.route.params.uid
  const token = props.route.params.token
  const roomCode = props.route.params.roomCode
  const roomId = props.route.params.roomId

  const [AssignmentContent, setAssignmentContent] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  // const [pageContent, setPageContent] = useState(null);
  const [update, setUpdate] = useState(0)

  //  Add assingment sheet
  const CreateAssignmentButtonSheetModalRef = useRef(null)
  const handleCreateAssignmentButton = () => {
    CreateAssignmentButtonSheetModalRef.current?.present()
  }
  const closeCreateAssignmentButton = () => {
    CreateAssignmentButtonSheetModalRef.current?.close()
  }

  const AddAssignmentSheet = () => {
    const [assignmentTitle, setAssignmentTitle] = useState({
      value: '',
      error: '',
    })
    const [annoucementDesc, setAnnoucementDesc] = useState({
      value: '',
      error: '',
    })

    const [assignmentNumber, setAssignmentNumber] = useState({
      value: '',
      error: '',
    })

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

    const showDatePicker = () => {
      setDatePickerVisibility(true)
    }

    const hideDatePicker = () => {
      setDatePickerVisibility(false)
    }
    const [assignmentDate, setAssignmentDate] = useState(new Date())

    const handleConfirmDate = (date) => {
      setAssignmentDate(date)
      hideDatePicker()
    }

    const [isTimePickerVisible, setTimePickerVisibility] = useState(false)

    const showTimePicker = () => {
      setTimePickerVisibility(true)
    }

    const hideTimePicker = () => {
      setTimePickerVisibility(false)
    }
    const [assignmentTime, setAssignmentTime] = useState({
      value: new Date().getTime() + 60 * 60 * 1000,
      error: '',
    })

    const handleConfirmTime = (date) => {
      const time = new Date(date).getTime()
      setAssignmentTime((prev) => ({
        ...prev,
        value: time,
      }))
      hideTimePicker()
    }

    // Selection of Files
    const [selectedFiles, setFile] = useState(null)

    const pickSomething = async () => {
      try {
        const docRes = await DocumentPicker.getDocumentAsync({
          multiple: true,
        })
        setFile(docRes)
      } catch (error) {
        Alert.alert('Error while selecting file: ', error)
      }
    }

    const handleCreateAssignment = async () => {
      try {
        if (!assignmentTitle.value || assignmentTitle.value.length === 0) {
          setAssignmentTitle((prev) => ({
            ...prev,
            error: 'Title should not be empty!',
          }))
        }
        if (!annoucementDesc.value || annoucementDesc.value.length === 0) {
          setAnnoucementDesc((prev) => ({
            ...prev,
            error: 'Description should not be empty!',
          }))
        }
        if (!assignmentNumber.value || assignmentNumber.value.length === 0) {
          setAssignmentNumber((prev) => ({
            ...prev,
            error: 'Grade should not be empty!',
          }))
        }
        if (
          assignmentTime.value < new Date().getTime() &&
          assignmentDate.getDate() === new Date().getDate()
        ) {
          setAssignmentTime((prev) => ({
            ...prev,
            error: 'Time can not be in the past!',
          }))
        }

        // API calling to create assingment
        else {
          setAssignmentTime((prev) => ({
            ...prev,
            error: '',
          }))

          // Format date and time
          const timeInMilliseconds = parseInt(assignmentTime.value)
          const assignmentDateTime = new Date(timeInMilliseconds)

          const formattedDate = new Date(assignmentDate)
            .toISOString()
            .split('T')[0] // Format date
          const formattedTime = assignmentDateTime
            .toISOString()
            .split('T')[1]
            .split('.')[0] // Format time

          // Combine date and time
          const dueDate = `${formattedDate}T${formattedTime}.000Z`
          
          const formData = new FormData();
          formData.append('teamID', roomId);
          formData.append('title', assignmentTitle.value);
          formData.append('description', annoucementDesc.value);
          formData.append('dueDate', dueDate);
          formData.append('grade', assignmentNumber.value);
          formData.append('files', selectedFiles);
          const response = await axios.post(
            '/api/assignment/createAssignment',
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
            setUpdate((prev) => prev + 1)
            closeCreateAssignmentButton()
          }
        }
      } catch (error) {
        Alert.alert('Something went wrong! Please try again later ', error)
      }
    }

    return (
      <View>
        <TextInput
          label="Title"
          returnKeyType="next"
          value={assignmentTitle.value}
          onChangeText={(text) =>
            setAssignmentTitle({ value: text, error: '' })
          }
          error={!!assignmentTitle.error}
          errorText={assignmentTitle.error}
        />
        <TextInput
          label="Desciption"
          multiline={true}
          returnKeyType="next"
          value={annoucementDesc.value}
          onChangeText={(text) =>
            setAnnoucementDesc({ value: text, error: '' })
          }
          error={!!annoucementDesc.error}
          errorText={annoucementDesc.error}
        />
        <TextInput
          label="Grade"
          keyboardType="numeric"
          returnKeyType="next"
          value={assignmentNumber.value}
          onChangeText={(text) =>
            setAssignmentNumber({ value: text, error: '' })
          }
          error={!!assignmentNumber.error}
          errorText={assignmentNumber.error}
        />
        {/* Date Picker  */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
          accentColor={theme.colors.primary}
          buttonTextColorIOS={theme.colors.primary}
        />
        <Pressable onPress={showDatePicker}>
          <TextInput
            label="Due Date"
            value={assignmentDate.toDateString()}
            editable={false}
            pointerEvents="none"
          ></TextInput>
        </Pressable>

        {/* Time Picker  */}
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={hideTimePicker}
          value={new Date(assignmentTime.value)}
          accentColor={theme.colors.primary}
          buttonTextColorIOS={theme.colors.primary}
        />
        <Pressable onPress={showTimePicker}>
          <TextInput
            label="Due Time"
            value={new Date(assignmentTime.value).toLocaleTimeString()}
            editable={false}
            pointerEvents="none"
            error={!!assignmentTime.error}
            errorText={assignmentTime.error}
          ></TextInput>
        </Pressable>

        {/* File Selection */}
        <View>
          {selectedFiles?.assets && selectedFiles?.assets.length > 0 ? (
            selectedFiles.assets.map((file, index) => (
              <Text style={{ color: theme.colors.primary }} key={index}>
                {file.name}
              </Text>
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
          onPress={handleCreateAssignment}
        >
          Create Assignment
        </Button>
      </View>
    )
  }

  // Bottom sheet content
  const ShowAssignmentSheetModalRef = useRef(null)
  const snapPoints = ['48%']
  const [selectedAssignment, setSelectedAssignment] = useState(null)

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
    const [showSubmitted,setShowSubmitted]=useState(true)
    const [showNotSubmitted,setShowNotSubmitted]=useState(false)
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
        
        
        
       setSubmittedBy((prev)=>response.data.assignment.submittedBy)
       setNotSubmittedBy((prev)=>response.data.assignment.notSubmittedBy)


      
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
        <ScrollView style={{height:'70%'}}>
          {(isAdmin && showSubmitted) &&
            submittedBy.map((student) => (

              
              <MemberCard key={student._id} name={student.name} email={student.email} />
              
            ))}
          {showNotSubmitted &&
            notSubmittedBy.map((student) => (
              <MemberCard key={student._id} name={student.name} email={student.email} />
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

  function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
  }

  async function getAssignments() {
    try {
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
      }
    } catch (error) {
      Alert.alert('Something went wrong, try again later.')
    }
  }

  useEffect(() => {
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

      {isAdmin && (
        <TouchableOpacity
          style={styles.AddAssignmentButton}
          onPress={handleCreateAssignmentButton}
        >
          <AntDesign name="addfile" size={32} color="#fff" />
        </TouchableOpacity>
      )}
      {isAdmin && (
        <BottomSheetModal
          style={styles.bottomSheet2}
          backgroundStyle={{
            borderRadius: 40,
            backgroundColor: theme.colors.tertiary,
          }}
          ref={CreateAssignmentButtonSheetModalRef}
          index={0}
          snapPoints={['95%']}
        >
          <View>
            <AddAssignmentSheet />
          </View>
        </BottomSheetModal>
      )}
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
