import axios from 'axios'

const baseURL = 'http://10.24.70.111:3000'
export default axios.create({
  // baseURL: 'https://collabsphere-server.onrender.com/',
  baseURL: 'http://10.24.70.111:3000',
})

export { baseURL };

