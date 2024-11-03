"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/lib/interfaces/interface';
import { getSpecificStatusOfUser } from '@/lib/client/status';
import { getAnimeById } from '@/lib/client/animesClient';
import { data } from 'autoprefixer';

function UserListPage({ statusId, id }: { statusId: string, id: string }) {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [status, setStatus] = useState<Status[]>([]);

    const Status = {
        1: 'Completed',
        2: 'Watching',
        3: 'On Hold',
        4: 'Dropped',
        5: 'Plan to Watch',
        6: 'Favourites',
        7: 'Likes',
        8: 'Dislikes'
    } as const;

    type Status = typeof Status[keyof typeof Status];

    statusId = Status[statusId as unknown as keyof typeof Status];

    useEffect(() => {
        async function gettingSpecificStatusOfUser() {
            try {
                const data = await getSpecificStatusOfUser(id, statusId);
                setStatus(data || []);
                
                // Check if data contains idAnime and then fetch anime
                if (data.length > 0) {
                    // Collect all anime IDs from the statuses
                    const animeIds = data.map((item: { idAnime: any; }) => item.idAnime);
    
                    // Fetch all animes based on the collected IDs
                    const animePromises = animeIds.map((animeId: string) => getAnimeById(animeId));
                    const allAnimes = await Promise.all(animePromises);
    
                    // Flatten the array if getAnimeById returns arrays or just set it directly
                    setAnimes(allAnimes.flat() || []);
                }
            } catch (error) {
                console.error('Failed to fetch animes:', error);
            }
        }
        gettingSpecificStatusOfUser();
    }, [id, statusId]);

    return (
        <>
            <div className="container mx-auto h-screen bg-custom-blue-dark">
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                    <p></p>
                </div>
                <div className="space-x-12 flex items-center relative mb-12 w-full text-white font-bold container mx-auto pl-2 bg-black pb-2 justify-between">
                    <div className='text-4xl'>{statusId}</div>
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
                            <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                                <p></p>
                            </div>
                        </div>
                    ))} 
                </div>
                <div className="flex flex-col mb-24 w-full text-white text-4xl font-bold justify-start">
                    <p></p>
                </div>
            </div>
        </>
    );
}

export default UserListPage;
