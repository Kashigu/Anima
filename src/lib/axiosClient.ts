import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ||'/', // Base URL for your API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
