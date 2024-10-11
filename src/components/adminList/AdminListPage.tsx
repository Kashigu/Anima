import { deleteUser, getUsers } from "@/lib/client/user";
import { User } from "@/lib/interfaces/interface";
import Link from "next/link";
import { useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";

function AdminListPage({ id }: { id: string }) {
    const [users, setUsers] = useState<User[]>([]);
    const [isDeleteModal, setDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    useEffect(() => {
        async function gettingUsers() {
            try {
                const data = await getUsers();
                setUsers(data || []);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        }

        gettingUsers();
    }, []);

    const handleDeleteSubmit = async () => {
        if (!userToDelete) return;
        try {
            const response = await deleteUser(userToDelete);
            if (response) {
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete));
            setDelete(false);
            setUserToDelete(null);
            toast.success('User Deleted successfully!', {
                style: {
                  backgroundColor: '#070720',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: '1px solid #ffffff',
                },
              });
            }
        } catch (error) {
            toast.error('Failed Deleting User.', {
                style: {
                  backgroundColor: '#070720',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: '1px solid #ffffff',
                },
              });
        }
    };

    const openDeleteModal = (userId: string) => {
        setUserToDelete(userId);
        setDelete(true);
    };

    return (
        <>
            <div className="container mx-auto h-screen bg-custom-blue-dark">
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                    <p></p>
                </div>
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start container mx-auto pl-2 bg-black pb-2">
                    List of Users
                </div>
                <div className="list-container w-full max-w-4xl mx-auto">
                    <table className="w-full text-white">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Image</th>
                                <th className="px-4 py-2 text-left">Block/Unblock</th>
                                <th className="px-4 py-2 text-left">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="bg-black border-b border-gray-700 hover:bg-gray-900">
                                    <td className="px-4 py-2">{user.id}</td>
                                    <td className="px-4 py-2">
                                        <Link href={`/Profile/${user.id}`} className="text-blue-400 hover:underline">
                                            {user.name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2">
                                        <img
                                            src={`/${user?.image_url}`}
                                            alt={user.name}
                                            className="w-16 h-16 object-cover rounded-full"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <button className="text-white hover:text-red-500">
                                            {user.isBlocked ? 'Unblock' : 'Block'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            className="text-white hover:text-red-500"
                                            onClick={() => openDeleteModal(user.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Modal */}
            {isDeleteModal && (
                <div className="w-screen h-screen bg-custom-dark bg-opacity-50 z-50 fixed top-0 left-0 flex">
                    <div className="bg-custom-blue-dark relative rounded-2xl text-white shadow-lg shadow-[#7887dd] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
                        <div
                            className="absolute top-4 right-4 cursor-pointer text-4xl"
                            onClick={() => setDelete(false)}
                        >
                            &times;
                        </div>

                        <div className="text-3xl font-bold mx-auto mb-6">Delete</div>

                        <div className="flex mb-5 text-2xl justify-center">
                            <p>Are you sure you want to delete this user?</p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                className="bg-red-500 text-white px-4 font-bold py-2 rounded hover:bg-red-600"
                                onClick={handleDeleteSubmit}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminListPage;