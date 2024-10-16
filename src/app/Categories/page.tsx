"use client";
import '../globals.css'; // Ensure this path is correct
import NewCategory from '@/components/categoryPage/NewCategory';


export default function CreatingNewCategory() {
  return (
    <>
    <div className=" bg-custom-blue-dark">
      <NewCategory/>
    </div>
    </>
  );
}