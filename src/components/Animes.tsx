import { SetStateAction, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { getAnimes, getSearchedAnimes } from '@/lib/client/animesClient';
import Link from 'next/link';
import { Anime } from '@/lib/interfaces/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';

interface AnimesProps {
    showFeature: boolean; 
}

function Animes({ showFeature }: AnimesProps) {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [currentAnimeIndex, setCurrentAnimeIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [searchAnimeQuery, setAnimeSearchQuery] = useState('');

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

    const handleAnimeSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setAnimeSearchQuery(e.target.value);
      };

    const useDebouncedSearch = (query, fetchFunction, setData, defaultDataFetch) => {
        useEffect(() => {
            const delayDebounceFn = setTimeout(async () => {
                if (query.trim()) {
                    try {
                        const results = await fetchFunction(query);
                        if (results) {
                            setData(results);
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                } else {
                    const defaultData = await defaultDataFetch();
                    setData(defaultData || []);
                }
            }, 300);
    
            return () => clearTimeout(delayDebounceFn);
        }, [query, fetchFunction, setData, defaultDataFetch]);
      };
    
    useDebouncedSearch(searchAnimeQuery, getSearchedAnimes, setAnimes, getAnimes);

    const scroll = (direction: 'left' | 'right') => {
        setCurrentAnimeIndex((prevIndex) => {
            const limitedAnimes = animes.slice(0, 10); // Limit to first 10 animes
            if (direction === 'left') {
                return prevIndex === 0 ? limitedAnimes.length - 1 : prevIndex - 1;
            } else {
                return prevIndex === limitedAnimes.length - 1 ? 0 : prevIndex + 1;
            }
        });
    };

    const limitedAnimes = animes.slice(0, 10); // Limit to first 10 animes
    const currentAnime = limitedAnimes[currentAnimeIndex];

    return (
        <>
            {showFeature && limitedAnimes.length > 0 && (
                <>
                    <div className="flex flex-col mb-12 w-full "></div>
                    <div className="flex justify-center items-center w-full">
                        <div className="relative w-[975px] h-[555px]">
                            <div ref={scrollRef} key={currentAnime.id}>
                                <button
                                    onClick={() => scroll('left')}
                                    className="custom-button bg-black absolute z-10 left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-5 h-5 z-10 text-white"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <Image
                                    src={currentAnime.big_image_url}
                                    alt={currentAnime.title}
                                    fill
                                    sizes="(max-width: 975px) 100vw, 975px"
                                    style={{ objectFit: 'cover' }}
                                    className="absolute inset-0"
                                    priority={true}
                                />
                                <div className="absolute inset-0 flex flex-col justify-end items-start p-8 text-white bg-gradient-to-r from-darkBlue via-transparent to-transparent">
                                    <div className="flex flex-wrap space-x-2">
                                        {currentAnime.genres.slice(0,5).map((genres, index) => (
                                            <span
                                            key={index}
                                            className="bg-black px-2 py-1 rounded text-sm mb-2"
                                            >
                                            {genres}
                                            </span>
                                        ))}
                                    </div>
                                    <h1 className="text-4xl mb-4 font-bold text-left text-stroke">{currentAnime.title}</h1>
                                    <Link href={`/AnimesPage/${currentAnime.id}`}>
                                        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                            WATCH NOW
                                        </button>
                                    </Link>
                                </div>

                                <button
                                    onClick={() => scroll('right')}
                                    className="custom-button bg-black absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-5 h-5 text-white"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="container mx-auto h-screen bg-custom-blue-dark">
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                    <p></p>
                </div>
                <div className="space-x-12 flex items-center relative mb-12 w-full text-white font-bold container mx-auto pl-2 bg-black pb-2 justify-between">
                    <div className='text-4xl'>Latest Releases</div>
                    {!showFeature &&(
                    <div className='relative w-96'>
                        <input
                            type="text"
                            placeholder="Search Anime"
                            className="bg-black rounded-full py-1 px-4 pr-10 text-white border-b-2 w-full"
                            value={searchAnimeQuery}
                            onChange={handleAnimeSearchChange}
                        />
                        <button className="text-white hover:text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                    )}
                </div>
                <div className="grid grid-cols-4 gap-x-8 gap-y-4 bg-custom-blue-dark">
                {!showFeature &&(
                    <>
                    {animes.length >= 0 && (
                        <>
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
                        </>
                        )}
                    </>
                )}
                {showFeature &&(
                    <>
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
                    </>
                )}
                </div>
            </div>
        </>
    );
}

export default Animes;
