"use client";
import { getEpisodesOfAnimeById } from '@/lib/client/animesClient';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Anime, Episode, Status, User } from '@/lib/interfaces/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { deleteStatus, getStatusByAnimeId, getStatusByUserId, postStatus } from '@/lib/client/status';
import useAuth from '@/app/hooks/useAuth';
import toast from 'react-hot-toast';



interface AnimesPageProps {
  anime: Anime | null;
}

function AnimesPage({ anime }: AnimesPageProps) {
  
  const [userData, setUserData] = useState<User | null>(null);

  useAuth(setUserData);

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [statusUserData, setStatusUserData] = useState<Status []>([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
   
  useEffect(() => {
    async function gettingEpisodesAndDataOfAnime() { 
      if (anime?.id) {
        const data = await getEpisodesOfAnimeById(anime.id);
        const statusAnimeData = await getStatusByAnimeId(anime.id);
        const statusUserData = await getStatusByUserId(userData?.id || '');

        setEpisodes(data || []);
        setStatusUserData(statusUserData || []);
        const counts = statusAnimeData.reduce((acc: { Likes: number; }, stat: { status: string }) => {
          if (stat.status === "Likes") {
            acc.Likes += 1;
          } 
          return acc;
        }, { Likes: 0, Dislikes: 0 });

        // Optional: Set the likes and dislikes count in state if needed
        setLikes(counts.Likes);
        setDislikes(counts.Dislikes);
        
      }
    }
    gettingEpisodesAndDataOfAnime(); 
  }, [anime?.id] );

  const handleLike = async () => {
    if (!userData) {
      toast.error('Please login to like this anime', {
        style: {
          backgroundColor: '#070720',
          color: '#ffffff',
          fontWeight: 'bold',
          border: '1px solid #ffffff',
        },
      });
      return;
    }
    
    const userLikeStatus = statusUserData.find(
      (status) => status.idUser === userData?.id && status.idAnime === anime?.id && status.status === "Likes"
    );

    const userDislikeStatus = statusUserData.find(
      (status) => status.idUser === userData?.id && status.idAnime === anime?.id && status.status === "Dislikes"
    );
    
    if (anime && userData) {
      if (userDislikeStatus) {
        setDislikes((prev) => Math.max(prev - 1, 0));
        setStatusUserData((prev) => prev.filter((status) => status.id !== userDislikeStatus.id));
        await deleteStatus(userDislikeStatus.id);
      }
      if (userLikeStatus) {
        setLikes((prev) => Math.max(prev - 1, 0));
        setStatusUserData((prev) => prev.filter((status) => status.id !== userLikeStatus.id));
        await deleteStatus(userLikeStatus.id);
      } else {
        // Optimistically update the UI to add a like 
        // (this is just visual feedback to the user, the actual status will be added after the post request)
        setLikes((prev) => prev + 1);
        const newStatus = { _id: 'temp', id: 'temp', idUser: userData.id, idAnime: anime.id, status: "Likes" };
        setStatusUserData((prev) => [...prev, newStatus]);

        // Perform the actual post request and get the new status ID from response
        const postedStatus = await postStatus(userData.id, anime.id, "Likes");
        
        setStatusUserData((prev) =>
          prev.map((status) => (status.id === 'temp' ? postedStatus : status))
        );
      }
    }
  }

  const handleDislike = async () => {
    if (!userData) {
      toast.error('Please login to dislike this anime', {
        style: {
          backgroundColor: '#070720',
          color: '#ffffff',
          fontWeight: 'bold',
          border: '1px solid #ffffff',
        },
      });
      return;
    }
    
    const userLikeStatus = statusUserData.find(
      (status) => status.idUser === userData?.id && status.idAnime === anime?.id && status.status === "Likes"
    );

    const userDislikeStatus = statusUserData.find(
      (status) => status.idUser === userData?.id && status.idAnime === anime?.id && status.status === "Dislikes"
    );
    
    if (anime && userData) {
      if (userLikeStatus) {
        setLikes((prev) => Math.max(prev - 1, 0));
        setStatusUserData((prev) => prev.filter((status) => status.id !== userLikeStatus.id));
        await deleteStatus(userLikeStatus.id);
      }
      if (userDislikeStatus) {
        setDislikes((prev) => Math.max(prev - 1, 0));
        setStatusUserData((prev) => prev.filter((status) => status.id !== userDislikeStatus.id));
        await deleteStatus(userDislikeStatus.id);
      } else {
        // Optimistically update the UI to add a dislike 
        // (this is just visual feedback to the user, the actual status will be added after the post request)
        setDislikes((prev) => prev + 1);
        const newStatus = { _id: 'temp', id: 'temp', idUser: userData.id, idAnime: anime.id, status: "Dislikes" };
        setStatusUserData((prev) => [...prev, newStatus]);

        // Perform the actual post request and get the new status ID from response
        const postedStatus = await postStatus(userData.id, anime.id, "Dislikes");
        
        setStatusUserData((prev) =>
          prev.map((status) => (status.id === 'temp' ? postedStatus : status))
        );
      }
    }
  }
    
  if (!anime) {
    return <p>Anime not found</p>;
  }

  return (
    <div className="container mx-auto bg-custom-blue-dark">
      {/* Title in the center */}
      <div className="grid grid-cols-1 gap-8 w-full justify-items-center text-4xl text-white text-center font-bold pt-5 mb-8">
        <Link href={`/AnimesPage/${anime.id}`}>{anime.title}</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full text-white">
        {/* Image on the left */}
        <div className="flex flex-col items-center w-[300px] justify-self-end">
          <div className="relative w-full h-[400px]">
            <Image
              src={anime.image_url}
              alt={anime.title}
              fill
              style={{ objectFit: 'cover' }}
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {/* Likes and dislikes section below the image */}
          <div className="flex justify-center gap-4 mt-4">
            <button className="bg-black text-white px-3 py-1 rounded-lg flex items-center gap-2" onClick={handleLike}>
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>{likes}</span>
            </button>
            <button className="bg-black text-white px-3 py-1 rounded-lg flex items-center gap-2" onClick={handleDislike}>
              <FontAwesomeIcon icon={faThumbsDown} />
              <span>{dislikes}</span>
            </button>
          </div>
        </div>

        {/* Description on the right */}
        <div className="flex flex-col max-w-lg text-lg">
          <h2 className="text-2xl mb-4 font-bold">Description</h2>
          <p>{anime.description}</p>
          <div className="mt-6">
            <h2 className="text-2xl mb-4 font-bold">Status</h2>
            <select className="bg-black text-white px-2 py-1 rounded-lg ">
              <option value="Select">Select</option>
              <option value="Completed">Completed</option>
              <option value="Watching">Watching</option>
              <option value="On Hold">On Hold</option>
              <option value="Dropped">Dropped</option>
              <option value="Plan to Watch">Plan to Watch</option>
            </select>
            <button className="bg-black text-white px-3 py-1 rounded-lg flex items-center mt-6 gap-2">
              <FontAwesomeIcon icon={faStar} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center mt-8 ">
        <h2 className="text-2xl mb-4 text-white font-bold">Genres</h2>
      </div>
      {/* Genres */}
      <div className="flex flex-wrap mt-2 justify-center space-x-2">
        {anime.genres.slice(0,9).map((genres, index) => (
            <span
            key={index}
            className="bg-black px-2 py-1 rounded text-white text-sm mb-2"
            >
            {genres}
            </span>
        ))}
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
