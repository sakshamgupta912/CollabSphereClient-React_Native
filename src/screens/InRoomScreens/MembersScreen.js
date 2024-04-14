import React, { useEffect, useState, useRef } from 'react'
import {
  Alert,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native'

import { useRoute } from '@react-navigation/native'
import MemberCard from '../../components/MemberCard'
import axios from '../../api/axios'
import { ScrollView } from 'react-native-gesture-handler'
import theme from '../../core/theme'

import Icon from 'react-native-ico-material-design'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'

const MembersScreen = (props) => {
  const uid = props.route.params.uid
  const token = props.route.params.token
  const roomCode = props.route.params.roomCode
  const roomId = props.route.params.roomId

  const [RoomLeadersContent, setRoomLeadersContent] = useState([])
  const [RoomMembersContent, setRoomMembersContent] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  

  const [usersList, setUsersList] = useState(null)
  const [searchUsers, setSearchUsers] = useState('')

  const CreateMembersSheetModalRef = useRef(null)
  const snapPoints = ['48%']
  const handleMembersPress = () => {
    CreateMembersSheetModalRef.current?.present()
  }
  const closeCreateMembersSheet = () => {
    getMembers();
    CreateMembersSheetModalRef.current?.close()
  }
  function removeDuplicates(arr) {
    const uniqueArray = []
    const map = new Map()

    for (const item of arr) {
      if (!map.has(item._id)) {
        map.set(item._id, true)
        uniqueArray.push(item)
      }
    }

    return uniqueArray
  }
  async function getMembers() {
    try {
      const response = await axios.post(
        '/api/teams/teamMembers',
        { teamID: roomId },
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

        setRoomLeadersContent(removeDuplicates(response.data.teamMembers.admin))
        setRoomMembersContent(
          removeDuplicates(response.data.teamMembers.members)
        )
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get team members' + error)
    }
  }

  useEffect(() => {
    getMembers()
  }, [])

  const [flag, setFlag] = useState(0)
  const [contacts, setContacts] = useState([
    {name: 'Loading...', email: 'Loading...', avatar: 'Loading...', }
  ])

  async function getUsers() {
    const response = await axios.get('/api/auth/searchUsers', {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Token ${token}`,
      },
    })
    if (flag == 0) {
      setFlag(1)
      if (response.status === 200) {
        setContacts(removeDuplicates(response.data))
        return
      }
    }
  }

  useEffect(() => {
    getUsers()
  }, [])
  const AddMemberSheet = () => {
    const [searchText, setSearchText] = useState('')
    const [filteredContacts, setFilteredContacts] = useState(contacts)

    const handleSearch = (text) => {
      setSearchText(text)
      const filtered = contacts.filter((contact) => {
        return contact.name.toLowerCase().includes(text.toLowerCase())
      })
      setFilteredContacts(filtered)
    }

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
        <ScrollView>
          {filteredContacts.map((item) => (
            <TouchableOpacity
              key={item._id}
              onPress={async () => {
                console.log(item._id)
                const response = await axios.post(
                  '/api/teams/addMember',
                  JSON.stringify({
                    member: [item._id],
                    teamID: roomId,
                  }),
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      authorization: `Token ${token}`,
                      uid: uid,
                    },
                  }
                )
                if (response.status === 200) {
                  closeCreateMembersSheet();
                }
              }}
            >
              <View style={styles.itemContainer}>
                <Image style={styles.avatar} source={{ uri: item.avatar }} />
                <View style={styles.textContainer}>
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.emailText}>{item.email}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }
  return (
    <BottomSheetModalProvider>
      <ScrollView>
        <View style={styles.containerMember}>
          <Text style={styles.textStyle}>Leaders</Text>
          {RoomLeadersContent.map((student) => (
            <MemberCard
              key={student._id}
              name={student.name}
              email={student.email}
            />
          ))}
        </View>
        <View style={styles.containerMember}>
          <Text style={styles.textStyle}>Members</Text>
          {RoomMembersContent.map((student) => (
            <MemberCard
              key={student._id}
              name={student.name}
              email={student.email}
            />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.Members} onPress={handleMembersPress}>
        <Icon name="rounded-add-button" height={40} width={40} color="#fff" />
      </TouchableOpacity>
      <BottomSheetModal
        style={styles.bottomSheet}
        backgroundStyle={{
          borderRadius: 40,
          backgroundColor: '#ffb8b8',
        }}
        ref={CreateMembersSheetModalRef}
        index={0}
        snapPoints={['70%']}
      >
        <AddMemberSheet />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  containerMember: {
    padding: 3,
    backgroundColor: theme.colors.tertiary,

    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 15,
  },

  textStyle: {
    textAlign: 'center',
    fontSize: 20,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },

  Members: {
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
  },

  container: {
    flex: 1,
    backgroundColor: '#ffb8b8',
  },
  searchContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 5,
    borderRadius: 15,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    padding: 8,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContainer: {
    marginLeft: 16,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
    color: '#999',
  },
})

export default MembersScreen
