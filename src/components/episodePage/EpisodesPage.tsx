"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { Anime, Episode } from "@/lib/interfaces/interface";
import { getEpisodesOfAnimeById } from "@/lib/client/animesClient";
import Link from "next/link";

interface EpisodesPageProps {
  animeEpisode: Episode | null;
  anime: Anime;
}

function EpisodesPage ({ animeEpisode, anime }: EpisodesPageProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);



  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fullscreen toggle handler
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Request fullscreen for the video container
      if (videoRef.current) {
        videoRef.current.requestFullscreen?.();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Mute/unmute handler
  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Adjust video time by seconds
  const adjustVideoTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Keypress event listener for "F" to trigger fullscreen, "M" to mute/unmute, and arrow keys to adjust time
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        handleFullscreen();
      } else if (e.key === "m" || e.key === "M") {
        handleMuteToggle();
      } else if (e.key === "ArrowRight") {
        adjustVideoTime(5); // Move 5 seconds forward
      } else if (e.key === "ArrowLeft") {
        adjustVideoTime(-5); // Move 5 seconds backward
      }
    };

    async function gettingEpisodesOfAnime() {
      if (anime?.id) {
        const data = await getEpisodesOfAnimeById(anime.id); // Call the getEpisodesOfAnimeById function
        setEpisodes(data || []);
      }
    }
    gettingEpisodesOfAnime();

    // Add keydown event listener
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isMuted]);
  if (!animeEpisode) {
    return <p>Episode not found</p>;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Display anime title */}
      <div className="text-4xl text-white text-center justify-center font-bold pt-5 mb-8">
        <Link href={`/AnimesPage/${anime.id}`}>{anime.title}</Link>
      </div>
      <div className="flex justify-center pb-10 items-center">
        <div className="relative w-[975px] h-[675px] bg-black">
          {/* Video or Image */}
          {!isVideoPlaying ? (
            <>
              {/* Thumbnail Image */}
              <Image
                src={animeEpisode.thumbnail_url}
                alt={animeEpisode.title}
                fill
                sizes="(max-width: 975px) 100vw, 975px"
                style={{ objectFit: "cover" }}
                className="absolute inset-0"
                priority={true}
              />

              {/* Play Button */}
              <div className="absolute inset-0 flex justify-center items-center z-10">
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="bg-white text-black p-4 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-12 h-12 text-black"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            /* Video Player */
            <video
              ref={videoRef}
              src={animeEpisode.video_url} // Replace with actual video URL
              controls
              autoPlay
              className="absolute inset-0 w-full h-full z-0" // Make sure z-index is lower than the play button
            />
          )}

          {/* Episode overlay */}
          <div className={`absolute inset-0 flex flex-col justify-end items-start font-bold text-stroke-sm stroke-black p-8 text-white bg-gradient-to-r from-darkBlue via-transparent to-transparent ${isVideoPlaying ? 'pointer-events-none' : ''}`}>
            <h2 className="text-2xl">{animeEpisode.title}</h2>
            <p>Episode {animeEpisode.episodeNumber}</p>
          </div>
        </div>
      </div>
      {/* Anime and episode details at the bottom */}
      <div className="flex justify-between items-center w-full mt-6 p-4 bg-black text-white">
        <div className="flex items-center">
          <Link href={`/AnimesPage/${anime.id}`}>
            <Image
              src={anime.image_url}
              alt={anime.title}
              width={50}
              height={50}
              className="mr-4"
            />
          </Link>
          <Link href={`/AnimesPage/${anime.id}`}>
            <div>
              <h3 className="text-lg">{anime.title}</h3>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          {episodes.map((episode) => (
            <div key={episode.id} className="bg-custom-blue-dark text-white p-2 rounded-lg">
              <Link href={`/EpisodesPage/${anime.id}/${episode.id}`} className="relative flex flex-col items-center">
                {episode.episodeNumber}
              </Link>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-6">
          <p>SubsPlease - 720p</p>
          <a href="/download-link" className="text-yellow-500">Download</a>
        </div>
      </div>
    </div>
  );
};

export default EpisodesPage;
