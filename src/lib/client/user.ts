
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

async function getUsers() {
  try {
    const response = await axiosClient.get('api/userServer?fetchAll=true');
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
      action: 'signin', 
      data: {           
        email,
        password
      }
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

async function getSearchedUsers(search: string) {
  try {
    const response = await axiosClient.get(`api/userServer?search=${search}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user by id:', error);
    return null;
  }
}

// Update user
async function updateUser(data: FormData) {
  try {
    const response = await axiosClient.put('api/userServer', data, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    return null;
  }
}

async function deleteUser(id: string) {
  try {
    const response = await axiosClient.delete(`api/userServer?userId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete user:', error);
    return null;
  }
}

async function blockUser(id: string, isBlocked: boolean) {
  try {
    const response = await axiosClient.put('api/userServer', {
      action: 'block', 
      data: {           
        userId: id,
        isBlocked: isBlocked
      }
    });

      return response.data;
  } catch (error: any) {
      if (error.response) {
          console.error(`Failed to update user status: ${error.response.data.message}`);
      } else {
          console.error('Failed to update user status:', error.message || error);
      }
      return { success: false, error: error.message || 'Failed to update user status' };
  }
}



export { postUser, signIn, getUserWithToken , getUserById, updateUser, getUser, getUsers, deleteUser, getSearchedUsers , blockUser};