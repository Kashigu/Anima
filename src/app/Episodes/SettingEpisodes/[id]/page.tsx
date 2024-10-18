
import {getEpisodeById } from '@/lib/client/animesClient';
import '../../../globals.css'; // Ensure this path is correct
import NewEpisode from '@/components/settingsEpisodes/NewEpisode';
import { Episode } from '@/lib/interfaces/interface';


async function fetchEpisodeById(id: string): Promise<Episode | null> {
    try {
      const data = await getEpisodeById(id);
      if (!data) {
        return null; // Ensure we return null if data is not found
      }
      return data;
    } catch (error) {
      console.error('Error fetching episode:', error);
      return null; // Handle error by returning null
    }
  }

export default async function Home({ params }: { params: { id: string } })  {
    const { id } = params;
    const episode = await fetchEpisodeById(id);
  return (
    <>
    <div className=" bg-custom-blue-dark">                              
      <NewEpisode episode={episode}/>
    </div>
    </>
  );
}