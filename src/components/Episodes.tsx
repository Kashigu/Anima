import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getEpisodes } from '@/lib/client/animesClient';
import Link from 'next/link';
import { Episode } from '@/lib/interfaces/interface';

function Episodes() {
    // Define state to store anime data state
    const [Episodes, setEpisodes] = useState<Episode[]>([]);
    

    
    useEffect(() => {
        async function gettingEpisodes() { 
            const data = await getEpisodes(); 
            
            setEpisodes(data || []);
        }

        gettingEpisodes(); 
    }, []);

    return (
        <>
            <div className="container mx-auto h-screen bg-custom-blue-dark">
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                    <p></p>
                </div>
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start container mx-auto  pl-2 bg-black pb-2 ">
                    Latest Releases
                </div>
                <div className="grid grid-cols-3 gap-x-8 gap-y-4 bg-custom-blue-dark">
                    {Episodes.map((episode) => (
                        <div key={episode.id} className="relative flex flex-col items-center">
                            <Link href={`/EpisodesPage/${episode.idAnime}/${episode.id}`} className="relative flex flex-col items-center">
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
                                <p></p> {/* This section remains static and not clickable */}
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Episodes;
