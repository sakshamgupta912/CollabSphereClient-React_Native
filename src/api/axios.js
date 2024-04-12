import axios from "axios";


export default axios.create({
    baseURL: 'https://collabsphere-server.azurewebsites.net',
})