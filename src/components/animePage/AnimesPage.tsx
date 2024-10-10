"use client";
import { getEpisodesOfAnimeById } from '@/lib/client/animesClient';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Anime, Episode } from '@/lib/interfaces/interface';



interface AnimesPageProps {
  anime: Anime | null;
}

function AnimesPage({ anime }: AnimesPageProps) {

  const [episodes, setEpisodes] = useState<Episode[]>([]);
   
  useEffect(() => {
    async function gettingEpisodesOfAnime() { 
      if (anime?.id) {
        const data = await getEpisodesOfAnimeById(anime.id); // Call the getEpisodesOfAnimeById function
        setEpisodes(data || []);
      }
    }
    gettingEpisodesOfAnime(); 
  }, [anime?.id]);

  if (!anime) {
    return <p>Anime not found</p>;
  }

  return (
    <div className="container mx-auto bg-custom-blue-dark">
      {/* Title in the center */}
      <div className="flex flex-col mb-8 w-full justify-center items-center text-4xl text-white text-center font-bold pt-5 ">
        <Link href={`/AnimesPage/${anime.id}`}>{anime.title}</Link>
      </div>
  
      {/* Flex container for image on the left and description on the right */}
      <div className="flex flex-row justify-center items-start gap-12 w-full text-white">
        {/* Image on the left */}
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
  
        {/* Description on the right */}
        <div className="flex flex-col max-w-lg text-lg">
          <h2 className="text-2xl mb-4 font-bold">Description</h2>
          <p>{anime.description}</p>
        </div>
      </div>
      
      <div className="flex flex-col w-full mt-6 text-white text-4xl font-bold justify-start pl-2 bg-black pb-2 mb-12">
        Episodes
      </div>
      <div className="grid grid-cols-3 gap-x-8 gap-y-4 bg-custom-blue-dark mt-6">
        {episodes.map((episode) => (
          <div key={episode.id} className="relative flex flex-col items-center">
            <Link href={`/EpisodesPage/${anime.id}/${episode.id}`} className="relative flex flex-col items-center">
              {/* Thumbnail Image */}
              <div className="relative w-[400px] h-[250px]">
                <Image
                  src={episode.thumbnail_url} 
                  alt={episode.title}
                  fill
                  priority={false}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="p-2 bg-white rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12l-6 4V8l6 4z" />
                    </svg>
                  </button>
                </div>
                {/* Episode Number */}
                <div className="absolute top-0 right-0 m-4 bg-custom-dark text-white p-2 rounded-lg">
                  {episode.episodeNumber}
                </div>
              </div>
              <h2 className="text-white text-xl font-bold mt-4 text-center">{episode.title}</h2>
            </Link>
            <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-center items-center">
              <p></p> 
            </div>
          </div>
        ))}
      </div>
    </div>
  );  
}

export default AnimesPage;
