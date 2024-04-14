import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-ico-material-design'
import { shareAsync } from 'expo-sharing'
import { Platform } from 'react-native'
import axios from '../api/axios'
import theme from '../core/theme'
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'
import * as Permissions from 'expo-permissions'

const AnnoucementCard = ({ post, uid, token, isAdmin, setUpdate }) => {
  const [deleteEnable, setDeleteEnable] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await axios.post(
        `/api/post/deletePost`,
        JSON.stringify({ postID: post._id }),
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Token ${token}`,
            uid,
          },
          validateStatus: () => true,
        }
      )
      setUpdate((prevState) => prevState + 1)
    } catch (error) {
      alert('Error in Deletion of chat..')
      console.error('Error fetching deleting from API:', error)
    }
  }

  useEffect(() => {
    if (uid === post.createdBy._id || isAdmin) {
      setDeleteEnable(true)
    }
  }, [])

  // const handleDownload = async (file) => {
  //   const fileId = file._id
  //   try {
  //     const response = await axios.get(`/api/download/`, {
  //       responseType: 'blob',
  //       headers: {
  //         Authorization: `Token ${token}`,
  //         fileid: fileId,
  //       },
  //     })

  //     if (response.status === 200) {
  //       const blobId = response.data.blobId

  //       if (blobId) {
  //         const fileName = `file_${blobId}.png` // Assuming the file is a PDF, adjust the extension as needed
  //         const downloadDest = `${FileSystem.documentDirectory}${fileName}`

  //         try {
  //           const downloadObject = FileSystem.createDownloadResumable(
  //             blobId,
  //             downloadDest
  //           )
  //           const { uri: localUri } = await downloadObject.downloadAsync()
  //           console.log('File downloaded successfully:', localUri)
  //           await Sharing.shareAsync(localUri)
  //         } catch (error) {
  //           console.error('Error downloading file:', error)
  //         }
  //       } else {
  //         console.error('Invalid API response: blobId is undefined')
  //       }
  //     } else if (response.status === 304) {
  //       console.log('File has not been modified since the last request.')
  //       // You can handle the 304 status code here, for example, by showing a message to the user or retrieving the file from cache if available.
  //     } else {
  //       console.error('Error fetching file from API:', response.status)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching file from API:', error)
  //   }
  // }

  const downloadFile = async (file) => {
    try {
      // Check and request permissions if necessary
      // if (Platform.OS === 'android') {
      //   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      //   if (status !== 'granted') {
      //     console.log('Camera roll permission denied')
      //     return
      //   }
      // }
      // Construct the download URL
      const downloadUrl = 'http://192.168.1.3:3000/api/download'

      // Construct the headers with fileId
      const headers = {
        fileid: file._id,
      }

      // Send a request to download the file with headers
      const downloadResult = await FileSystem.downloadAsync(
        downloadUrl,
        FileSystem.documentDirectory + file.originalname, // Save the file in the documents directory
        {
          headers: headers,
        }
      )

      if (downloadResult.status === 200) {
        console.log('File downloaded successfully:', downloadResult.uri)
        save(downloadResult.uri, file.originalname,  downloadResult.headers["Content-Type"])
        // Now you can use the downloaded file URI for further processing
      } else {
        console.log('Failed to download file')
      }
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const save = async (uri, filename, mimetype) => {
    if (Platform.OS === 'android') {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        })
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimetype
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            })
          })
          .catch((e) => console.log(e))
      } else {
        shareAsync(uri)
      }
    } else {
      shareAsync(uri)
    }
  }

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Icon
          name="round-account-button-with-user-inside"
          style={styles.postAvatar}
          height="30"
          width="30"
        />

        {/* <Image source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar2.png' }} style={styles.postAvatar} /> */}
        <Text style={styles.postUsername}>{post.createdBy.name}</Text>
        {deleteEnable && ( // Render dustbin icon only when deleteEnable is true
          <TouchableOpacity onPress={handleDelete}>
            <Icon name="rubbish-bin-delete-button" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.postDescription}>{post.content}</Text>
      {post.files && post.files.length > 0 && (
        <View style={styles.fileContainer}>
          <Text style={styles.fileLabel}>Files:</Text>
          {post.files.map((file, index) => (
            // <TouchableOpacity key={index} onPress={() => handleDownload(file)}>
            <TouchableOpacity key={index} onPress={() => downloadFile(file)}>
              <View style={styles.fileItemContainer}>
                <Icon name="attachment-clip" color="#000" />
                <Text style={styles.fileItem}>{file.originalname}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  postCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUsername: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  postDescription: {
    fontSize: 20,
  },
  fileContainer: {
    marginTop: 10,
  },
  fileLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fileItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  fileItem: {
    fontSize: 18,
    marginLeft: 5,
    color: theme.colors.primary,
  },
})

export default AnnoucementCard
