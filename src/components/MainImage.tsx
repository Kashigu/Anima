"use client";
import React from "react";
import Image from 'next/image'; // Import the Image component from Next.js
import codegeassImage from "../../public/images/codegeassF.jpg"; // Correct the import

function MainImage(){
  return (
    <>
      <div className="flex flex-col mb-12 w-full">
      </div>
      <div className="flex justify-center items-center "> 
        <div className="relative w-[975px] h-[555px]"> 
          <Image
            src={codegeassImage} 
            alt="Code Geass"
            fill
            sizes="(max-width: 975px) 100vw, 975px"
            style={{ objectFit: "cover" }} 
            className="absolute inset-0"
            priority={true}
          />
          <div className="absolute inset-0 flex flex-col justify-end items-start p-8 text-white bg-gradient-to-r from-darkBlue via-transparent to-transparent">
          <span className="bg-custom-blue-dark px-2 py-1 rounded text-sm mb-2">Adventure</span>
          <h1 className="text-4xl mb-4 font-bold text-left text-stroke">Code Geass</h1>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            WATCH NOW
          </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainImage;
