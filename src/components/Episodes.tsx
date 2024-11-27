import { SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import { getEpisodes, getSearchedEpisodes } from '@/lib/client/animesClient';
import Link from 'next/link';
import { Episode } from '@/lib/interfaces/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useDebouncedSearch from '@/app/hooks/useDebounceSearch';
import PaginationControls from './PaginationControls';
import usePagination from '@/app/hooks/usePagination';

function Episodes() {
    // Define state to store anime data state
    const [Episodes, setEpisodes] = useState<Episode[]>([]);
    const [searchEpisodeQuery, setEpisodeSearchQuery] = useState('');

    {/* Pagination */}
    const itemsPerPage = 12;
    const [resetPagination, setResetPagination] = useState(false);
    const { currentPage: episodeCurrentPage, totalPages: episodeTotalPages, displayedItems: displayedEpisodes, goToNextPage: goToNextEpisodePage, goToPreviousPage: goToPreviousEpisodePage } = usePagination(Episodes, itemsPerPage, resetPagination);

    
    useEffect(() => {
        async function gettingEpisodes() { 
            const data = await getEpisodes(); 
            if (data) {
                setEpisodes(data.reverse());
            } else {
                setEpisodes([]);
            }
        }

        gettingEpisodes(); 
    }, []);


    const handleEpisodeSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setEpisodeSearchQuery(e.target.value);
      };
    
    {/* Debounce */}
    useDebouncedSearch(searchEpisodeQuery, getSearchedEpisodes, (fetchedEpisodes) => {
        setEpisodes([...fetchedEpisodes].reverse());
    }, getEpisodes , setResetPagination);


    return (
        <>
            <div className="container mx-auto h-screen bg-custom-blue-dark">
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                    <p></p>
                </div>
                <div className="space-x-12 flex items-center relative mb-12 w-full text-white font-bold container mx-auto pl-2 bg-black pb-2 justify-between">
                    <div className='text-4xl'>Latest Releases</div>
                    <div className='relative w-96'>
                        <input
                            type="text"
                            placeholder="Search Episode"
                            className="bg-black rounded-full py-1 px-4 pr-10 text-white border-b-2 w-full"
                            value={searchEpisodeQuery}
                            onChange={handleEpisodeSearchChange}
                        />
                        <button className="text-white hover:text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-x-8 gap-y-4 bg-custom-blue-dark">
                    {displayedEpisodes.map((episode) => (
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
                <PaginationControls
                    currentPage={episodeCurrentPage}
                    totalPages={episodeTotalPages}
                    onNext={goToNextEpisodePage}
                    onPrevious={goToPreviousEpisodePage}
                />
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-center items-center">
                    <p></p> 
                </div>
            </div>
        </>
    );
}

export default Episodes;
