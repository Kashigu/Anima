"use client";
import '../globals.css'; // Ensure this path is correct
import MainImage from '../components/MainImage'; // Ensure this path is correct

export default function Home() {
  return (
    <div className="bg-custom-blue-dark">
      <MainImage />
      {/* Header is included in the layout */}
    </div>
  );
}
