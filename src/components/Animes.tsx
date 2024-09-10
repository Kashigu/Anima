import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getAnimes } from '@/lib/client/animesClient';

interface Anime {
    _id: string;
    title: string;
    description: string;
    genre: Array<string>;
    image_url: string; // Assuming each anime has an image URL
}

function Animes() {
    // Define state to store anime data and loading state
    const [animes, setAnimes] = useState<Anime[]>([]);

    // Fetch animes when the component mounts
    useEffect(() => {
        async function gettingAnimes() { // Renamed function
            const data = await getAnimes(); // Call the getAnimes function
            setAnimes(data || []);
        }

        gettingAnimes(); // Call the renamed function
    }, []);

    return (
        <>
            <div className="container mx-auto bg-custom-blue-dark">
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                    <p></p>
                </div>
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                    Latest Releases
                </div>
                <div className="grid grid-cols-4 gap-x-8 gap-y-4 bg-custom-blue-dark">
                    {animes.map((anime) => (
                        <div key={anime._id} className="flex flex-col items-center">
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
                            <h2 className="text-white text-xl font-bold mt-4">{anime.title}</h2>
                            <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                              <p></p>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
        </>
    );
}

export default Animes;
