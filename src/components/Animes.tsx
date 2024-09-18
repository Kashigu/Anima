import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { getAnimes } from '@/lib/client/animesClient';
import Link from 'next/link';
import { Anime } from '@/lib/interfaces/interface';
import codegeassImage from "../../public/images/codegeassF.jpg";

interface AnimesProps {
    showFeature: boolean; // Prop to control feature display
}

function Animes({ showFeature }: AnimesProps) {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function gettingAnimes() {
            try {
                const data = await getAnimes();
                setAnimes(data || []);
            } catch (error) {
                console.error('Failed to fetch animes:', error);
            }
        }

        gettingAnimes();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -300 : 300,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            {showFeature && (
                <>
                <div className="flex flex-col mb-12 w-full">
                </div>
                <div className="flex justify-center items-center mb-12 w-full">
                    <div className="relative w-[975px] h-[555px]"> 
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-custom-dark text-white p-2 rounded-full z-10">
                        &lt;
                    </button>
                    
                            <Image
                                src={codegeassImage}
                                alt="Code Geass"
                                fill
                                sizes="(max-width: 975px) 100vw, 975px"
                                style={{ objectFit: "cover" }}
                                className="absolute inset-0"
                                priority={true}
                            />
                            <div className="absolute inset-0 flex flex-col justify-end items-start p-8 text-white bg-gradient-to-r from-darkBlue via-transparent to-transparent">
                                <span className="bg-custom-blue-dark px-2 py-1 rounded text-sm mb-2">Adventure</span>
                                <h1 className="text-4xl mb-4 font-bold text-left text-stroke">Code Geass</h1>
                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                    WATCH NOW
                                </button>
                            </div>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-custom-dark text-white p-2 rounded-full z-10">
                            &gt;
                        </button>
                    </div>
                </div>
                </>
            )}

            <div className="container mx-auto bg-custom-blue-dark">
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                    Latest Releases
                </div>
                <div className="grid grid-cols-4 gap-x-8 gap-y-4 bg-custom-blue-dark">
                    {animes.map((anime) => (
                        <div key={anime.id} className="flex flex-col items-center">
                            <Link href={`/AnimesPage/${anime.id}`} className="w-full flex flex-col items-center">
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
                                <h2 className="text-white text-xl font-bold mt-4 text-center">{anime.title}</h2>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Animes;
