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


export { getStatus, getStatusByUserId };