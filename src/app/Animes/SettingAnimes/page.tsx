"use client";
import '../../globals.css'; // Ensure this path is correct
import NewAnime from '@/components/settingsAnimes/NewAnime';


export default function Home() {
  return (
    <>
    <div className=" bg-custom-blue-dark">
      <NewAnime/>
    </div>
    </>
  );
}