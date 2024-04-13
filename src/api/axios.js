import axios from 'axios'

export default axios.create({
  // baseURL: 'https://collabsphere-server.onrender.com/',
  baseURL: 'http://192.168.1.3:3000/',
})
