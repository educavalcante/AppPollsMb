
import axios from "axios";

export const api = axios.create({
    baseURL: 'http://192.168.46.125:3333'
});