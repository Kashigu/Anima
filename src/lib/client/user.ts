
import axiosClient from "../axiosClient";

async function getUser() {
  try {
    const response = await axiosClient.get('api/userServer');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

async function postUser(data: any) {
  try {
    const response = await axiosClient.post('api/userServer', data);
    return response.data;
  } catch (error) {
    console.error('Failed to post user:', error);
    return null;
  }
}

export { getUser , postUser};