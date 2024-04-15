import axios from 'axios'

const baseURL = 'http://192.168.1.8:3000'
export default axios.create({
  // baseURL: 'https://collabsphere-server.onrender.com/',
  baseURL: 'http://192.168.1.8:3000',
})

export { baseURL };

