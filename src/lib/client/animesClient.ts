import axiosClient from "../axiosClient";

async function getAnimes() {
  try {
    const response = await axiosClient.get('api/animesServer');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch animes:', error);
    return null;
  }
}

async function getAnimeById(id: string) {
  try {
    const response = await axiosClient.get(`api/animesServer?id=${id}`);
    console.error(response.data);
    return response.data; // Directly return the data
  } catch (error) {
    console.error('Failed to fetch anime:', error);
    return null;
  }
}

export { getAnimes, getAnimeById };
