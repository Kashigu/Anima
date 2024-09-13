"use client";
import React from "react";
import Image from 'next/image';
import mongoose from 'mongoose';
import { Anime, Episode } from "@/lib/interfaces/interface";



interface EpisodesPageProps {
  animeEpisode: Episode | null;
  anime?: Anime; // Use the Anime interface here
}

const EpisodesPage = ({ animeEpisode, anime }: EpisodesPageProps) => {
  if (!animeEpisode) {
    return <p>Episode not found</p>;
  }

  return (
    <>
      <div className="flex flex-col mb-12 w-full">
        {/* Display anime title */}
        <h1 className="text-4xl text-white">{anime?.title}</h1>
        {/* You can display more details from the anime object here */}
        <p className="text-lg text-white">{anime?.description}</p>
      </div>
      <div className="flex justify-center pb-10 items-center ">
        <div className="relative w-[975px] h-[675px]"> 
          <Image
            src={animeEpisode.thumbnail_url}
            alt={animeEpisode.title}
            fill
            sizes="(max-width: 975px) 100vw, 975px"
            style={{ objectFit: "cover" }}
            className="absolute inset-0"
            priority={true}
          />
          <div className="absolute inset-0 flex flex-col justify-end items-start p-8 text-white bg-gradient-to-r from-darkBlue via-transparent to-transparent">
            {/* You can add more details about the episode here */}
            <h2 className="text-2xl">{animeEpisode.title}</h2>
            <p>Episode {animeEpisode.episodeNumber}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EpisodesPage;
