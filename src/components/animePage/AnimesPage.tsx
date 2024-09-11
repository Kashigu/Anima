import mongoose from 'mongoose';
import Image from 'next/image';

interface Anime {
  _id:mongoose.Schema.Types.ObjectId;
  id: string;
  title: string;
  description: string;
  genre: Array<string>;
  image_url: string;
}

interface AnimesPageProps {
  anime: Anime | null;
}

function AnimesPage({ anime }: AnimesPageProps) {
  if (!anime) {
    return <p>Anime not found</p>;
  }

  return (
    <div className="container mx-auto bg-custom-blue-dark">
      <h1 className="text-white text-4xl">{anime.title}</h1>
      <p className="text-white text-lg">{anime.description}</p>
      <div className="relative w-[300px] h-[400px]">
        <Image
          src={anime.image_url}
          alt={anime.title}
          fill
          style={{ objectFit: 'cover' }}
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}

export default AnimesPage;
