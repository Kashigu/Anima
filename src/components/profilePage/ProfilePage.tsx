"use client";
import { getEpisodeStatusByUserId, getStatusByUserId } from "@/lib/client/status";
import { User } from "@/lib/interfaces/interface";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserPageProps {
  userId: User | null;
}

const ProfilePage = ({ userId }: UserPageProps) => {
  const [statusCounts, setStatusCounts] = useState({
    "Completed": 0,
    "Watching": 0,
    "On Hold": 0,
    "Dropped": 0,
    "Plan to Watch": 0,
    "Total Entries": 0,
    "Episodes": 0,
    "Favourites": 0,
    "Likes": 0,
    "Dislikes": 0,
  });
  const [episodeCounts, setEpisodeCounts] = useState(0);

  useEffect(() => {
    async function gettingStatus() {
      if (userId && userId.id) {
        const data = await getStatusByUserId(userId.id);
        const dataEpisode = await getEpisodeStatusByUserId(userId.id);

        // Count the total number of episodes watched
        const totalEpisodes = dataEpisode.reduce((acc: number, episode: { episodes: number }) => {
          return acc + episode.episodes;
        }, 0);
  
        // Count each status type, excluding specific ones from the Total Entries
        const counts = data.reduce((acc: { [key: string]: number }, stat: { status: string }) => {
          const statusType = stat.status;
  
          // Initialize the count for this status type if it doesn't exist
          if (!(statusType in acc)) {
            acc[statusType] = 0;
          }
  
          // Increment the count for this status type
          acc[statusType] += 1;
  
          // Increment Total Entries only for statuses that are NOT excluded
          if (!["Episodes", "Favourites", "Likes", "Dislikes"].includes(statusType)) {
            acc["Total Entries"] = (acc["Total Entries"] || 0) + 1;
          }
  
          return acc;
        }, {
          Completed: 0,
          Watching: 0,
          "On Hold": 0,
          Dropped: 0,
          "Plan to Watch": 0,
          "Total Entries": 0,
          Episodes: 0,
          Favourites: 0,
          Likes: 0,
          Dislikes: 0,
        });
  
        setStatusCounts(counts);
        setEpisodeCounts(totalEpisodes);
      }
    }
  
    gettingStatus();
  }, [userId]);

  if (userId === null || userId.id === null) {
    return (
      <div className="bg-custom-blue-dark h-screen flex justify-center pt-5">
        <div className="text-4xl text-white text-center font-bold">
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-custom-blue-dark h-screen flex flex-col w-full">
      {/* Display anime title */}
      <div className="text-4xl text-white text-center justify-center font-bold pt-5 mb-8">
        {userId?.name}
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full text-white">
          <div className="relative w-[250px] h-[250px] justify-self-end">
            {/* Display user image */}
            <img
              src={`/${userId?.image_url}`}
              alt={userId?.name}
              className="w-full h-full center-cropped"
            />
          </div>
          {/* Description on the right */}
          <div className="flex flex-col max-w-lg text-lg">
            <h2 className="text-2xl mb-4 font-bold">Description</h2>
            <p>{userId.description}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col container mx-auto w-full mt-16 text-white text-4xl font-bold justify-start pl-2 bg-black pb-2 mb-12">
        Status
      </div>
      {/* Grid Layout for stats */}
      <div className="container text-xl flex justify-center items-center mx-auto">
        <div className="grid grid-cols-2 gap-x-24 gap-y-4 text-white">
          {/* Left Column - 5 items */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <Link className="font-bold text-white hover:text-red-500" href={`/Profile/${userId.id}/UserList/1`}>Completed:</Link>
              <span className="ml-24">{statusCounts.Completed}</span> 
            </div>
            <div className="flex justify-between">
              <Link className="font-bold text-white hover:text-red-500" href={`/Profile/${userId.id}/UserList/2`}>Watching:</Link>
              <span className="ml-24">{statusCounts.Watching}</span> 
            </div>
            <div className="flex justify-between">
              <Link className="font-bold text-white hover:text-red-500" href={`/Profile/${userId.id}/UserList/3`}>On Hold:</Link>
              <span className="ml-24">{statusCounts["On Hold"]}</span> 
            </div>
            <div className="flex justify-between">
              <Link className="font-bold text-white hover:text-red-500" href={`/Profile/${userId.id}/UserList/4`}>Dropped:</Link>
              <span className="ml-24">{statusCounts.Dropped}</span>
            </div>
            <div className="flex justify-between">
              <Link className="font-bold text-white hover:text-red-500" href={`/Profile/${userId.id}/UserList/5`}>Plan to Watch:</Link>
              <span className="ml-24">{statusCounts["Plan to Watch"]}</span> 
            </div>
          </div>

          {/* Right Column - 5 items */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total Entries:</span>
              <span className="ml-24">{statusCounts["Total Entries"]}</span> 
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Episodes:</span>
              <span className="ml-24">{episodeCounts}</span>
            </div>
            <div className="flex justify-between">
              <Link className="font-bold text-white hover:text-red-500" href={`/Profile/${userId.id}/UserList/6`}>Favourites:</Link>
              <span className="ml-24">{statusCounts.Favourites}</span>
            </div>
            <div className="flex justify-between">
              <Link className="font-bold text-white hover:text-red-500" href={`/Profile/${userId.id}/UserList/7`}>Likes:</Link>
              <span className="ml-24">{statusCounts.Likes}</span> 
            </div>
            <div className="flex justify-between">
              <Link className="font-bold text-white hover:text-red-500" href={`/Profile/${userId.id}/UserList/8`}>Dislikes:</Link>
              <span className="ml-24">{statusCounts.Dislikes}</span> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
