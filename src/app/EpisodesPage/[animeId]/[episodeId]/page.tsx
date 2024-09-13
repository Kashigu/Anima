import '../../../../globals.css';
import EpisodesPage from '@/components/episodePage/EpisodesPage';
import { getOneEpisodeOfAnimeById, getAnimeById } from '@/lib/client/animesClient';


async function fetchAnimeAndEpisode(anime_id: string, episode_id: string) {
  try {
    const animeEpisode = await getOneEpisodeOfAnimeById(anime_id, episode_id);
    const anime = await getAnimeById(anime_id);
    return { animeEpisode, anime };
  } catch (error) {
    console.error('Error fetching anime or episode:', error);
    return { animeEpisode: null, anime: null };
  }
}

async function Episode({ params }: { params: { animeId: string, episodeId: string } }) {
  const { animeId, episodeId } = params;
  const { animeEpisode, anime } = await fetchAnimeAndEpisode(animeId, episodeId);

  return (
    <div className="bg-custom-blue-dark">
      <EpisodesPage animeEpisode={animeEpisode} anime={anime} />
    </div>
  );
}

export default Episode;
