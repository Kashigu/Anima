"use client";
import '../../../globals.css';
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