import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-ico-material-design';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import axios from '../api/axios';

const AnnoucementCard = ({ post, uid, token }) => {
    const handleDownload = async (file) => {
        const fileId = file._id;
        try {
          const response = await axios.get(`/api/download/`, {
            responseType: 'blob',
            headers: {
              'Authorization': `Token ${token}`,
              fileid: fileId,
            },
          });
      
          if (response.status === 200) {
            const blobId = response.data.blobId;
      
            if (blobId) {
              const fileName = `file_${blobId}.png`; // Assuming the file is a PDF, adjust the extension as needed
              const downloadDest = `${FileSystem.documentDirectory}${fileName}`;
      
              try {
                const downloadObject = FileSystem.createDownloadResumable(blobId, downloadDest);
                const { uri: localUri } = await downloadObject.downloadAsync();
                console.log('File downloaded successfully:', localUri);
                await Sharing.shareAsync(localUri);
              } catch (error) {
                console.error('Error downloading file:', error);
              }
            } else {
              console.error('Invalid API response: blobId is undefined');
            }
          } else if (response.status === 304) {
            console.log('File has not been modified since the last request.');
            // You can handle the 304 status code here, for example, by showing a message to the user or retrieving the file from cache if available.
          } else {
            console.error('Error fetching file from API:', response.status);
          }
        } catch (error) {
          console.error('Error fetching file from API:', error);
        }
      };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar2.png' }} style={styles.postAvatar} />
        <Text style={styles.postUsername}>{post.createdBy.name}</Text>
      </View>
      <Text style={styles.postDescription}>{post.content}</Text>
      {post.files && post.files.length > 0 && (
        <View style={styles.fileContainer}>
          <Text style={styles.fileLabel}>Files:</Text>
          {post.files.map((file, index) => (
            <TouchableOpacity key={index} onPress={() => handleDownload(file)}>
              <View style={styles.fileItemContainer}>
                <Icon name="attachment-clip" size={20} color="#000" />
                <Text style={styles.fileItem}>{file.originalname}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

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
    fontSize: 14,
    marginLeft: 5,
    textDecorationLine: 'underline',
    color: 'blue',
  },
});

export default AnnoucementCard;
