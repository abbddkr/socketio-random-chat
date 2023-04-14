import type { AxiosInstance } from 'axios';
import axios from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: location.protocol + "//" + location.hostname + ":" + "3000", // http://localhost:3000,
    headers: {
        'Content-Type': 'application/json',
    }
})

/** modify interceptors */
export default api;
