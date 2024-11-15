"use client";
import { getEpisodesOfAnimeById, getSearchedEpisodesOfAnime } from '@/lib/client/animesClient';
import Image from 'next/image';
import { SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import { Anime, Episode, EpisodeStatus, Status, User } from '@/lib/interfaces/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faStar, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { deleteEpisodeStatus, deleteStatus, getEpisodeStatusByUserId, getStatusByAnimeId, getStatusByUserId, postEpisodeStatus, postStatus } from '@/lib/client/status';
import useAuth from '@/app/hooks/useAuth';
import toast from 'react-hot-toast';
import usePagination from '@/app/hooks/usePagination';
import PaginationControls from '../PaginationControls';
import { set } from 'mongoose';



interface AnimesPageProps {
  anime: Anime | null;
}

function AnimesPage({ anime }: AnimesPageProps) {
  
  const [userData, setUserData] = useState<User | null>(null);

  useAuth(setUserData);

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [searchEpisodeQuery, setEpisodeSearchQuery] = useState('');


  {/* Pagination */}
  const itemsPerPage = 12;
  const [resetPagination, setResetPagination] = useState(false);
  const { currentPage: episodeCurrentPage, totalPages: episodeTotalPages, displayedItems: displayedEpisodes, goToNextPage: goToNextEpisodePage, goToPreviousPage: goToPreviousEpisodePage } = usePagination(episodes, itemsPerPage, resetPagination);

  const [statusUserData, setStatusUserData] = useState<Status []>([]);
  const [episodeStatus, setEpisodeStatus] = useState<EpisodeStatus []>([]);
  const [localEpisodeValue, setLocalEpisodeValue] = useState('');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
   
  useEffect(() => {
    
    async function gettingEpisodesAndDataOfAnime() { 
      if (anime?.id) {
        const data = await getEpisodesOfAnimeById(anime.id);
        const statusAnimeData = await getStatusByAnimeId(anime.id);
        setEpisodes(data || []);

        const counts = statusAnimeData.reduce((acc: { Likes: number, Dislikes: number }, stat: { status: string }) => {
          if (stat.status === "Likes") {
            acc.Likes += 1;
          } else if (stat.status === "Dislikes") {
            acc.Dislikes += 1;
          }
          return acc;
        }, { Likes: 0, Dislikes: 0 });

        setLikes(counts.Likes);
        setDislikes(counts.Dislikes);
        
        if (userData?.id) {
          const statusUserData = await getStatusByUserId(userData.id);
          const episodeUserStatus = await getEpisodeStatusByUserId(userData.id);
          setEpisodeStatus(episodeUserStatus || []);
          setStatusUserData(statusUserData || []);
    
          const userFavouriteStatus = statusUserData.find(
            (status: { idUser: string | undefined; idAnime: string; status: string }) =>
              status.idUser === userData.id && status.idAnime === anime.id && status.status === "Favourites"
          );
          setIsFavourite(!!userFavouriteStatus);

          // Get the user's episode status for this anime if it exists
          const userEpisode = episodeUserStatus.find(
            (status: { idUser: string; idAnime: string; }) => status.idUser === userData.id && status.idAnime === anime.id
          )?.episodes || '';
          setLocalEpisodeValue(userEpisode); 
        }
      }
    }
    gettingEpisodesAndDataOfAnime(); 
    
    
  }, [ userData, anime?.id] );

  const useDebouncedSearchEpisodeOfAnime = (
      query: string,
      fetchFunction: (query: string, animeId: string) => Promise<any>,
      setData: (data: any) => void,
      defaultDataFetch: (animeId: string) => Promise<any>,
      setResetPagination: ((reset: boolean) => void) | null,
      animeId: string
  ) => {
      useEffect(() => {
          const delayDebounceFn = setTimeout(async () => {
              if (query.trim() && animeId) {
                  try {
                      const results = await fetchFunction(query, animeId);
                      if (results) {
                          setData(results);
                          if (setResetPagination) setResetPagination(true);
                      }
                  } catch (error) {
                      console.error('Error fetching data:', error);
                  }
              } else if (animeId) {
                  const defaultData = await defaultDataFetch(animeId);
                  setData(defaultData || []);
                  if (setResetPagination) setResetPagination(false);
              }
          }, 300);

          return () => clearTimeout(delayDebounceFn);
      }, [query, animeId, fetchFunction, setData, defaultDataFetch, setResetPagination]);
  };
 
  if (anime?.id) {
    useDebouncedSearchEpisodeOfAnime(
        searchEpisodeQuery,
        getSearchedEpisodesOfAnime,
        setEpisodes,
        getEpisodesOfAnimeById, 
        setResetPagination,
        anime.id
    );
  }
  

  const handleEpisodeSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setEpisodeSearchQuery(e.target.value);
  };

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
        setLikes((prev) => prev + 1);
        const newStatus = { _id: 'temp', id: 'temp', idUser: userData.id, idAnime: anime.id, status: "Likes" };
        setStatusUserData((prev) => [...prev, newStatus]);

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

  const handleFavourite = async () => {
    if (!userData) {
      toast.error('Please login to favourite this anime', {
        style: {
          backgroundColor: '#070720',
          color: '#ffffff',
          fontWeight: 'bold',
          border: '1px solid #ffffff',
        },
      });
      return;
    }
    
    const userFavouriteStatus = statusUserData.find(
      (status) => status.idUser === userData?.id && status.idAnime === anime?.id && status.status === "Favourites"
    );
    
    if (anime && userData) {
      if (userFavouriteStatus) {
        setStatusUserData((prev) => prev.filter((status) => status.id !== userFavouriteStatus.id));
        await deleteStatus(userFavouriteStatus.id);
        setIsFavourite(false);
      } else {
        const newStatus = { _id: 'temp', id: 'temp', idUser: userData.id, idAnime: anime.id, status: "Favourites" };
        setStatusUserData((prev) => [...prev, newStatus]);
        setIsFavourite(true);

        // Perform the actual post request and get the new status ID from response
        const postedStatus = await postStatus(userData.id, anime.id, "Favourites");
        
        setStatusUserData((prev) =>
          prev.map((status) => (status.id === 'temp' ? postedStatus : status))
        );
      }
    }
  }

  const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setLocalEpisodeValue(e.target.value);
  };
  
  const handleStatusChange = async (e: { target: { value: string; }; }) => {
    if (!userData) {
      toast.error('Please login to change status of this anime', {
        style: {
          backgroundColor: '#070720',
          color: '#ffffff',
          fontWeight: 'bold',
          border: '1px solid #ffffff',
        },
      });
      return;
    }

    // Get the new status value from the dropdown
    const newStatusValue = e.target.value;
    // Find the current status of the user for this anime if it exists 
    const userStatus = statusUserData.find(
      (status) =>
        status.idUser === userData?.id &&
        status.idAnime === anime?.id &&
        ["Completed", "Watching", "On Hold", "Dropped", "Plan to Watch"].includes(status.status)
    );
    
    // Remove the current status if it exists
    if (userStatus) {
      setStatusUserData((prev) =>
        prev.map((status) =>
          status.id === userStatus.id
            ? { ...status, status: newStatusValue } // Temporarily set the new value
            : status
        )
      );
      await deleteStatus(userStatus.id);
      setStatusUserData((prev) => prev.filter((status) => status.id !== userStatus.id));
    }
    // Add the new status if it is not "Select"
    if (newStatusValue !== "Select" && anime && userData) {
      const newStatus = { _id: 'temp', id: 'temp', idUser: userData.id, idAnime: anime.id, status: newStatusValue };
      setStatusUserData((prev) => [...prev, newStatus]);

      // Perform the actual post request and get the new status ID from response
      const postedStatus = await postStatus(userData.id, anime.id, newStatusValue);

      //Update episodes status if the status is "Completed"
      if (newStatusValue === "Completed") {
        const userEpisodeStatus = episodeStatus.find(
          (status) => status.idUser === userData?.id && status.idAnime === anime?.id
        );
        if (userEpisodeStatus) {
          setEpisodeStatus((prev) => prev.filter((status) => status.id !== userEpisodeStatus.id));
          await deleteEpisodeStatus(userEpisodeStatus.id);
        }
        const newEpisodeStatus = { _id: 'temp', id: 'temp', idUser: userData.id, idAnime: anime.id, episodes: anime.episodes };
        setEpisodeStatus((prev) => [...prev, newEpisodeStatus]);
        const postedEpisodeStatus = await postEpisodeStatus(userData.id, anime.id, anime.episodes);
        setEpisodeStatus((prev) =>
          prev.map((status) =>
            status.id === 'temp' ? { ...status, id: postedEpisodeStatus.id } : status
          )
        );
        setLocalEpisodeValue(anime.episodes.toString());
      }

      // Delete episode status if the status is is "Select"
      

      setStatusUserData((prev) =>
        prev.map((status) => (status.id === 'temp' ? postedStatus : status))
      );
    }
    if (newStatusValue === "Select") {
      const userEpisodeStatus = episodeStatus.find(
        (status) => status.idUser === userData?.id && status.idAnime === anime?.id
      );
      if (userEpisodeStatus) {
        setEpisodeStatus((prev) => prev.filter((status) => status.id !== userEpisodeStatus.id));
        await deleteEpisodeStatus(userEpisodeStatus.id);
      }
      setLocalEpisodeValue('');
    }
    
  }

  const handleSubmitEpisode = async (e: { target: { value: string; }; }) => {
    if (!userData) {
      toast.error('Please login to change status of this anime', {
        style: {
          backgroundColor: '#070720',
          color: '#ffffff',
          fontWeight: 'bold',
          border: '1px solid #ffffff',
        },
      });
      return;
    }
  
    const newEpisodeValue = e.target.value;
    const episodeNumber = parseInt(newEpisodeValue);
    if (episodeNumber < 0 || episodeNumber > (anime?.episodes ?? 0)) {
      toast.error('Invalid episode number', {
        style: {
          backgroundColor: '#070720',
          color: '#ffffff',
          fontWeight: 'bold',
          border: '1px solid #ffffff',
        },
      });
      return;
    }
    const userEpisodeStatus = episodeStatus.find(
      (status) => status.idUser === userData?.id && status.idAnime === anime?.id
    );
  
    if (anime && userData) {
      if (userEpisodeStatus) {
        // Optimistically update the UI by removing the old status
        setEpisodeStatus((prev) => prev.filter((status) => status.id !== userEpisodeStatus.id));
  
        // Delete the old status
        await deleteEpisodeStatus(userEpisodeStatus.id);
      }
  
      // Create a new status
      const newStatus = { _id: 'temp', id: 'temp', idUser: userData.id, idAnime: anime.id, episodes: episodeNumber };
      setEpisodeStatus((prev) => [...prev, newStatus]);
  
      try {
        const postedStatus = await postEpisodeStatus(userData.id, anime.id, episodeNumber);
  
          // Only update the status if the episode number is valid
          if (episodeNumber === anime.episodes) {
            handleStatusChange({ target: { value: "Completed" } });
          } else {
            handleStatusChange({ target: { value: "Watching" } });
          }
        setEpisodeStatus((prev) =>
          prev.map((status) =>
            status.id === 'temp' ? { ...status, id: postedStatus.id } : status
          )
        );
      } catch (error) {
        console.error('Failed to post new episode status:', error);
  
        setEpisodeStatus((prev) => prev.filter((status) => status.id !== 'temp'));
      }
    }
  };
  
  
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
          <div className="mt-6 grid grid-cols-2">
            <div>
              <h2 className="text-2xl mb-4 font-bold">Status</h2>
              {/* Status dropdown */}
              <select
                className="bg-black text-white px-2 py-1 rounded-lg"
                value={
                  statusUserData
                    .find(
                      (status) => 
                        status.idUser === userData?.id &&
                        status.idAnime === anime?.id &&
                        !["Likes", "Dislikes", "Favourites"].includes(status.status)
                    )?.status || 'Select'
                }
                onChange={handleStatusChange}
              >
                <option value="Select">Select</option>
                <option value="Completed">Completed</option>
                <option value="Watching">Watching</option>
                <option value="On Hold">On Hold</option>
                <option value="Dropped">Dropped</option>
                <option value="Plan to Watch">Plan to Watch</option>
              </select>
            </div>
            {/* Episode Count*/}
            <div className=" grid grid-cols-2">
              <div>
                <h2 className="text-2xl mb-4 font-bold">Episodes</h2>
                <input
                  type="text"
                  className="bg-black text-white px-2 py-1 rounded-lg w-10"
                  value={localEpisodeValue}
                  onChange={handleInputChange}
                  onBlur={handleSubmitEpisode}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmitEpisode(e);
                    }
                  }}
                />
                <span className="text-white">/ {anime.episodes}</span>
              </div>
            </div>
            
            {/* Favourite button */}
          </div>
          <div className="mt-6">
            <button className={`px-3 py-1 rounded-lg flex items-center mt-6 gap-2 ${isFavourite ? 'bg-yellow-500 text-black' : 'bg-black text-white'}`}
                    onClick={handleFavourite}>
              <FontAwesomeIcon icon={faStar} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center mt-8 ">
        <h2 className="text-2xl mb-4 text-white font-bold">Genres</h2>
      </div>
      {/* Genres */}
      <div className="flex flex-wrap mt-2 mb-4 justify-center space-x-2">
        {anime.genres.slice(0,9).map((genres, index) => (
            <span
            key={index}
            className="bg-black px-2 py-1 rounded text-white text-sm mb-2"
            >
            {genres}
            </span>
        ))}
      </div>
      <div className="space-x-12 flex items-center relative mb-12  w-full text-white font-bold container mx-auto pl-2 bg-black pb-2 justify-between">
        <div className='text-4xl'>Episodes</div>
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
      <div className="grid grid-cols-3 gap-x-8 gap-y-4 bg-custom-blue-dark mt-6">
        {displayedEpisodes.map((episode) => (
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
  );  
}

export default AnimesPage;
