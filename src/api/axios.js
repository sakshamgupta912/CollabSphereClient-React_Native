import axios from 'axios'

// const baseURL = 'http://192.168.1.7:3000'
const baseURL= 'https://collabspheresever.azurewebsites.net'
export default axios.create({
  baseURL: 'https://collabspheresever.azurewebsites.net',
  // baseURL: 'http://192.168.1.7:3000',
})

export { baseURL };

