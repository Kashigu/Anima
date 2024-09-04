// src/components/Animes.tsx
import { useEffect, useState } from 'react';
import Image from 'next/image';

type Anime = {
  _id: string;
  name: string;
  description: string;
  image?: string; // Optional field
};

const Animes = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await fetch('/api/animes');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAnimes(data);
      } catch (error) {
        setError('Failed to fetch animes');
        console.error('Error fetching animes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="flex flex-col mb-12 w-full"></div>
      <div className="container mx-auto">
        <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold mt-4 justify-start">
          Latest Releases
        </div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-4 bg-custom-blue-dark">
          {animes.map((anime) => (
            <div key={anime._id} className="flex flex-col items-center">
              <Image
                src={anime.image || '/path/to/default-image.jpg'} // Use image URL from data or a default image
                alt={anime.name}
                width={500} // Adjust width as needed
                height={300} // Adjust height as needed
                style={{ objectFit: "cover" }}
                priority={false}
              />
              <h2 className="text-white text-xl font-bold mt-4">{anime.name}</h2>
              <p className="text-white text-base mt-2">{anime.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Animes;
