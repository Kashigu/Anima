import axiosClient from "../axiosClient";


async function getStatus() {
  try {
    const response = await axiosClient.get('api/statusServer');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch status:', error);
    return null;
  }
}

async function getStatusByUserId(id: string) {
  try {
    const response = await axiosClient.get(`api/statusServer?userId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch status:', error);
    return null;
  }
}

async function getStatusByAnimeId(id: string) {
  try {
    const response = await axiosClient.get(`api/statusServer?animeId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch status:', error);
    return null;
  }
}

async function postStatus(userId: string, animeId: string, status: string) {
  try {
    const response = await axiosClient.post('api/statusServer', {
      userId,
      animeId,
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post status:', error);
    return null;
  }
}

async function deleteStatus(id: string) {
  try {
    const response = await axiosClient.delete(`api/statusServer?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete status:', error);
    return null;
  }
}


export { getStatus, getStatusByUserId, getStatusByAnimeId , postStatus, deleteStatus };