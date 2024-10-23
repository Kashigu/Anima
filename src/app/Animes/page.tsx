"use client";
import '../globals.css'; // Ensure this path is correct
import Animes from '@/components/Animes';


export default function Home() {
  return (
    <>
    <div className=" bg-custom-blue-dark">
      <Animes showFeature={false}/>
    </div>
    </>
  );
}