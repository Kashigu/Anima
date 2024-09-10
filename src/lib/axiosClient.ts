// axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/', // Base URL for your API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
