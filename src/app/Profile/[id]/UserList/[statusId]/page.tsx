"use client"
import '../../../../globals.css';
import UserListPage from '@/components/userList/UserListPage';

export default function UserList({ params }: { params: { id: string; statusId: string } }) {
    const { id,statusId } = params;
    return (
      <>
      <div className=" bg-custom-blue-dark">
        <UserListPage statusId={statusId} id={id} />
      </div>
      </>
      
    );
    
    
}