import AnimesPage from '@/components/animePage/AnimesPage';
import { getAnimeById } from '@/lib/client/animesClient';
import '../../../globals.css'; // Ensure this path is correct
import { Anime } from '@/lib/interfaces/interface';

async function fetchAnimeById(id: string): Promise<Anime | null> {
  try {
    const data = await getAnimeById(id);
    if (!data) {
      return null; // Ensure we return null if data is not found
    }
    return data;
  } catch (error) {
    console.error('Error fetching anime:', error);
    return null; // Handle error by returning null
  }
}

export default async function AnimePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const anime = await fetchAnimeById(id);
  return (
    <>
    <div className=" bg-custom-blue-dark">
      <AnimesPage anime={anime} />
    </div>
    </>
    
  );
  
  
}
