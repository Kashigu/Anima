"use client";
import '../../../globals.css'; // Ensure this path is correct
import AdminListPage from '@/components/adminList/AdminListPage';


export default function AdminList({ params }: { params: { id: string } })  {
  const { id } = params;
  return (
    <>
    <div className=" bg-custom-blue-dark">
      <AdminListPage id={id}/>
    </div>
    </>
  );
}