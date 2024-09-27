
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

// Get user with token
async function getUserWithToken(token: string) {
  
  if (!token) {
    console.error('No token found');
    return null;
  }

  try {
    const response = await axiosClient.get('api/userServer', {
      headers: {
        'Authorization': `Bearer ${token}`, // Send token in headers
      },
    });
    return response.data; // Return the user data
  } catch (error) {
    console.error('Failed to fetch user:', (error as any).response ? (error as any).response.data : (error as any).message);
    return null;
  }
}


// Get user by id
async function getUserById(id: string) {
  try {
    const response = await axiosClient.get(`api/userServer?userId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user by id:', error);
    return null;
  }
}

export { getUser , postUser, signIn, getUserWithToken , getUserById};