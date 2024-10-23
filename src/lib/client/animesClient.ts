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
    return response.data; // Directly return the data
  } catch (error) {
    console.error('Failed to fetch anime:', error);
    return null;
  }
}

async function getEpisodeById(id: string) {
  try {
    const response = await axiosClient.get(`api/episodesServer?id=${id}`);
    return response.data; // Directly return the data
  } catch (error) {
    console.error('Failed to fetch episode:', error);
    return null;
  }
}

async function getSearchedAnimes(search: string) {
  try {
    const response = await axiosClient.get(`api/animesServer?search=${search}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch animes:', error);
    return null;
  }
}

async function getSearchedEpisodes(search: string) {
  try {
    const response = await axiosClient.get(`api/episodesServer?search=${search}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch episodes:', error);
    return null;
  }
}

async function getEpisodesOfAnimeById(id: string) {
  try {
    const response = await axiosClient.get(`api/${id}/episodes`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch episodes:', error);
    return null;
  }
}

async function getOneEpisodeOfAnimeById(id: string, episodeId: string) {
  try {
    const response = await axiosClient.get(`api/${id}/episodes?episodeId=${episodeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch episode:', error);
    return null;
  }
}

async function getEpisodes() {
  try {
    const response = await axiosClient.get(`api/episodesServer`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch episodes:', error);
    return null;
  }
}

async function deleteAnime(id: string) {
  try {
    const response = await axiosClient.delete(`api/animesServer?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete anime:', error);
    return null;
  }
}

async function deleteEpisode(id: string) {
  try {
    const response = await axiosClient.delete(`api/episodesServer?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete episode:', error);
    return null;
  }
}

async function postAnime(data: any) {
  try {
    const response = await axiosClient.post('api/animesServer', data,{
      headers: {
      'Content-Type': 'multipart/form-data', 
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to post anime:', error);
    return null;
  }
}

async function updateAnime(data: any) {
  try {
    const response = await axiosClient.put('api/animesServer', data,{
      headers: {
      'Content-Type': 'multipart/form-data', 
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to update anime:', error);
    return null;
  }
}
async function postEpisode(data: any) {
  try {
    const response = await axiosClient.post('api/episodesServer', data,{
      headers: {
      'Content-Type': 'multipart/form-data', 
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to post episode:', error);
    return null;
  }
}

async function updateEpisode(data: any) {
  try {
    const response = await axiosClient.put('api/episodesServer', data,{
      headers: {
      'Content-Type': 'multipart/form-data', 
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to update episode:', error);
    return null;
  }
}


export { getAnimes, getAnimeById , getEpisodesOfAnimeById , getOneEpisodeOfAnimeById,
         getEpisodes, deleteAnime, deleteEpisode, postAnime, updateAnime, getSearchedAnimes, getSearchedEpisodes,
         postEpisode, updateEpisode, getEpisodeById};
