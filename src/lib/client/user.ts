
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

// Register user
async function postUser(data: any) {
  try {
    const response = await axiosClient.post('api/userServer', {data , action: 'signup'});
    return response.data;
  } catch (error) {
    console.error('Failed to post user:', error);
    return null;
  }
}

// Login user
async function signIn(email: string, password: string) {
  try {
    const response = await axiosClient.post('api/userServer', {
      data: {           
        email,
        password
      },
      action: 'signin',
    });
    return response.data;  // Token is returned here
  } catch (error) {
    console.error('Failed to sign in:', error);
    return null;
  }
}

export { getUser , postUser, signIn};