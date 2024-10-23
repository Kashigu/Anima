"use client";
import '../globals.css'; // Ensure this path is correct
import AdminPage from '@/components/adminPage/AdminPage';


export default function Home() {
  return (
    <>
    <div className=" bg-custom-blue-dark">
      <AdminPage/>
    </div>
    </>
  );
}