"use client";
import '../../globals.css'; // Ensure this path is correct
import NewEpisode from '@/components/settingsEpisodes/NewEpisode';


export default function CreatingNewAnime() {
  return (
    <>
    <div className=" bg-custom-blue-dark">
      <NewEpisode/>
    </div>
    </>
  );
}