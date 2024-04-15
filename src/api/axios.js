import axios from 'axios'

// const baseURL = 'http://192.168.1.7:3000'
const baseURL= 'https://collabsphere-server.onrender.com/'
export default axios.create({
  baseURL: 'https://collabsphere-server.onrender.com/',
  // baseURL: 'http://192.168.1.7:3000',
})

export { baseURL };

