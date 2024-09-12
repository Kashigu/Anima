import AnimesPage from '@/components/animePage/AnimesPage';
import { getAnimeById } from '@/lib/client/animesClient';
import mongoose from 'mongoose';
import '../../../globals.css'; // Ensure this path is correct
import Episodes from '@/components/Episodes';

interface Anime {
  _id:mongoose.Schema.Types.ObjectId;
  id: string;
  title: string;
  description: string;
  genre: Array<string>;
  image_url: string;
}

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
