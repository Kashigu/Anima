import axiosClient from "../axiosClient";

async function getAnimes() {
  try {
    const response = await axiosClient.get('api/animesServer'); // Correct endpoint path
    return response.data;
  } catch (error) {
    console.error('Failed to fetch animes:', error);
    return null;
  }
}

export { getAnimes };
