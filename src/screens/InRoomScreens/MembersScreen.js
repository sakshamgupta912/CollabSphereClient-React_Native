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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [usersList, setUsersList] = useState([])
  const [searchUsers, setSearchUsers] = useState('')
  const [update, setUpdate] = useState(0)

  const CreateMembersSheetModalRef = useRef(null)
  const snapPoints = ['48%']
  const handleMembersPress = () => {
    CreateMembersSheetModalRef.current?.present()
  }
  const closeCreateMembersSheet = () => {
    CreateMembersSheetModalRef.current?.close()
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
        console.log(response.data)
        setIsAdmin(response.data.isAdmin)
        setRoomLeadersContent(response.data.teamMembers.admin)
        setRoomMembersContent(response.data.teamMembers.members)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get team members' + error)
    }
  }

  useEffect(() => {
    getMembers()
  }, [update])

  const AddMemberSheet = () => {
    const [contacts, setContacts] = useState([
      {
        id: 1,
        name: 'John Doe',
        phone: '555-555-5555',
        image: 'https://www.bootdey.com/img/Content/avatar/avatar1.png',
      },
      {
        id: 2,
        name: 'Jane Smith',
        phone: '444-444-4444',
        image: 'https://www.bootdey.com/img/Content/avatar/avatar2.png',
      },
      {
        id: 3,
        name: 'Bobbie Doeman',
        phone: '333-333-3333',
        image: 'https://www.bootdey.com/img/Content/avatar/avatar3.png',
      },
      {
        id: 4,
        name: 'Cabnth Johnson',
        phone: '333-333-3333',
        image: 'https://www.bootdey.com/img/Content/avatar/avatar4.png',
      },
      {
        id: 5,
        name: 'Krekvh Martin',
        phone: '333-333-3333',
        image: 'https://www.bootdey.com/img/Content/avatar/avatar5.png',
      },
      {
        id: 6,
        name: 'Jose Cassti',
        phone: '333-333-3333',
        image: 'https://www.bootdey.com/img/Content/avatar/avatar6.png',
      },
      {
        id: 7,
        name: 'John Mrtiuhg',
        email: '333-333-3333',
        image: 'https://www.bootdey.com/img/Content/avatar/avatar7.png',
      },
    ])
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
            <View style={styles.itemContainer} key={item.id}>
              <Image style={styles.image} source={{ uri: item.image }} />
              <View style={styles.textContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.emailText}>{item.phone}</Text>
              </View>
            </View>
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
  image: {
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
  phoneText: {
    fontSize: 16,
    color: '#999',
  },
})

export default MembersScreen
