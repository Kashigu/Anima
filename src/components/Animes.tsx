import { useEffect, useState } from 'react';
import codegeassImage from "../../public/images/codegeassF.jpg"; 
import Image from 'next/image';
import { getAnimes } from '@/lib/client/animesClient';


interface Anime {
    _id: string;
    title: string;
    description: string;
    genre:Array<string>;
    imageUrl: string; // Assuming each anime has an image URL
  }
function Animes() {

    // Define state to store anime data and loading state
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch animes when the component mounts
    useEffect(() => {
        async function gettingAnimes() { // Renamed function
        const data = await getAnimes(); // Call the getAnimes function
        setAnimes(data || []);
        setLoading(false);
        }

        gettingAnimes(); // Call the renamed function
    }, []);

    return (
        <>
          <div className="container mx-auto bg-custom-blue-dark">
            <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold mt-4 justify-start">
              Latest Releases
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-4 bg-custom-blue-dark">
              {animes.map((anime) => (
                <div key={anime._id} className="flex flex-col items-center">
                  <Image
                    src={anime.imageUrl || codegeassImage} // Use the anime's image URL or a default image
                    alt={anime.title}
                    style={{ objectFit: 'cover' }}
                    width={500} // Set appropriate width
                    height={300} // Set appropriate height
                    priority={false}
                  />
                  <h2 className="text-white text-xl font-bold mt-4">{anime.title}</h2>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }
    
    export default Animes;