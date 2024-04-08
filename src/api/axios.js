import axios from "axios";


export default axios.create({
    baseURL: 'http://192.168.29.101:3000',
})