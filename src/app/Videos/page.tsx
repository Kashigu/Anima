"use client";
import Videos from '@/components/video/Videos';
import '../globals.css'; // Ensure this path is correct



export default function Home() {
  return (
    <>
    <div className=" bg-custom-blue-dark">
      <Videos/>
    </div>
    </>
  );
}