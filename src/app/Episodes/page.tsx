"use client";
import '../globals.css'; // Ensure this path is correct
import Episodes from '@/components/Episodes';


export default function Home() {
  return (
    <>
    <div className=" bg-custom-blue-dark">
      <Episodes/>
    </div>
    </>
  );
}