import { blockUser, deleteUser, getSearchedUsers, getUsers } from "@/lib/client/user";
import { Anime, Category, Episode, User } from "@/lib/interfaces/interface";
import Link from "next/link";
import { SetStateAction, use, useEffect, useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import useUser from "@/app/hooks/useUser";
import { deleteAnime, deleteEpisode, getAnimes, getEpisodes, getSearchedAnimes, getSearchedEpisodes } from "@/lib/client/animesClient";
import { deleteCategory, getCategories, getSearchedCategory } from "@/lib/client/categories";
import usePagination from "@/app/hooks/usePagination";
import PaginationControls from "../PaginationControls";


function AdminListPage({ id }: { id: string }) {
    {/* User */}
    const [users, setUsers] = useState<User[]>([]);
    const [isDeleteModal, setDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [searchUserQuery, setUserSearchQuery] = useState('');
    
    {/* Anime */}
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [isAnimeDeleteModal, setAnimeDelete] = useState(false);
    const [animeToDelete, setAnimeToDelete] = useState<string | null>(null);
    const [searchAnimeQuery, setAnimeSearchQuery] = useState('');
    
    {/* Episode */}
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [isEpisodeDeleteModal, setEpisodeDelete] = useState(false);
    const [episodeToDelete, setEpisodeToDelete] = useState<string | null>(null);
    const [searchEpisodeQuery, setEpisodeSearchQuery] = useState('');

    {/* Categories */}
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCategoryDeleteModal, setCategoryDelete] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null); 
    const [searchCategoryQuery, setCategorySearchQuery] = useState('');

    {/* Pagination */}
    const itemsPerPage = 12;
    const [resetPagination, setResetPagination] = useState(false);
    const { currentPage: animeCurrentPage, totalPages: animeTotalPages, displayedItems: displayedAnimes, goToNextPage: goToNextAnimePage, goToPreviousPage: goToPreviousAnimePage } = usePagination(animes, itemsPerPage , resetPagination);
    const { currentPage: userCurrentPage, totalPages: userTotalPages, displayedItems: displayedUsers, goToNextPage: goToNextUserPage, goToPreviousPage: goToPreviousUserPage } = usePagination(users, itemsPerPage, resetPagination);
    const { currentPage: episodeCurrentPage, totalPages: episodeTotalPages, displayedItems: displayedEpisodes, goToNextPage: goToNextEpisodePage, goToPreviousPage: goToPreviousEpisodePage } = usePagination(episodes, itemsPerPage, resetPagination);
    const { currentPage: categoryCurrentPage, totalPages: categoryTotalPages, displayedItems: displayedCategories, goToNextPage: goToNextCategoryPage, goToPreviousPage: goToPreviousCategoryPage } = usePagination(categories, itemsPerPage, resetPagination);


    {/* Logged User*/ }
    const { userData, loading } = useUser();

    useEffect(() => {
        async function fetchData() {
            try {
                const [usersData, animesData, episodesData, categoriesData] = await Promise.all([
                    getUsers(),
                    getAnimes(),
                    getEpisodes(),
                    getCategories()
                ]);
    
                setUsers(usersData || []);
                setAnimes(animesData || []);
                setEpisodes(episodesData || []);
                setCategories(categoriesData || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }
        fetchData();
    }, []);

    const useDebouncedSearch = (query, fetchFunction, setData, defaultDataFetch, setResetPagination) => {
        useEffect(() => {
            const delayDebounceFn = setTimeout(async () => {
                if (query.trim()) {
                    try {
                        const results = await fetchFunction(query);
                        if (results) {
                            setData(results);
                            setResetPagination(true); // Reset pagination flag after fetching new results
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                } else {
                    const defaultData = await defaultDataFetch();
                    setData(defaultData || []);
                    setResetPagination(false); // Also reset when default data is fetched
                }
            }, 300);
    
            return () => clearTimeout(delayDebounceFn);
        }, [query, fetchFunction, setData, defaultDataFetch, setResetPagination]);
    };
    
    
    // Using the useDebouncedSearch hook for each query
    
    useDebouncedSearch(searchAnimeQuery, getSearchedAnimes, setAnimes, getAnimes, setResetPagination);
    useDebouncedSearch(searchCategoryQuery, getSearchedCategory, setCategories, getCategories, setResetPagination);
    useDebouncedSearch(searchEpisodeQuery, getSearchedEpisodes, setEpisodes, getEpisodes, setResetPagination);
    useDebouncedSearch(searchUserQuery, getSearchedUsers, setUsers, getUsers, setResetPagination);
    
    const handleDeleteUserSubmit = async () => {
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

    const handleDeleteAnimeSubmit = async () => {
        if (!animeToDelete) return;
        try {
            const response = await deleteAnime(animeToDelete);
            if (response) {
            setAnimes((prevAnimes) => prevAnimes.filter((anime) => anime.id !== animeToDelete));
            setAnimeDelete(false);
            setAnimeToDelete(null);
            toast.success('Anime Deleted successfully!', {
                style: {
                  backgroundColor: '#070720',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: '1px solid #ffffff',
                },
              });
            }
        } catch (error) {
            toast.error('Failed Deleting Anime.', {
                style: {
                  backgroundColor: '#070720',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: '1px solid #ffffff',
                },
              });
        }
    }

    const handleDeleteEpisodeSubmit = async () => {
        if (!episodeToDelete) return;
        try {
            const response = await deleteEpisode(episodeToDelete);
            if (response) {
            setEpisodes((prevEpisodes) => prevEpisodes.filter((episode) => episode.id !== episodeToDelete));
            setEpisodeDelete(false);
            setEpisodeToDelete(null);
            toast.success('Episode Deleted successfully!', {
                style: {
                  backgroundColor: '#070720',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: '1px solid #ffffff',
                },
              });
            }
        } catch (error) {
            toast.error('Failed Deleting Episode.', {
                style: {
                  backgroundColor: '#070720',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: '1px solid #ffffff',
                },
              });
        }
    }

    const handleDeleteCategorySubmit = async () => {
        if (!categoryToDelete) return;
        try {
            const response = await deleteCategory(categoryToDelete);
            if (response) {
            setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryToDelete));
            setCategoryDelete(false);
            setCategoryToDelete(null);
            toast.success('Category Deleted successfully!', {
                style: {
                  backgroundColor: '#070720',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: '1px solid #ffffff',
                },
              });
             }
        } catch (error) {
            toast.error('Failed Deleting Category.', {
                style: {
                  backgroundColor: '#070720',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: '1px solid #ffffff',
                },
              });
        }
    }

    const openDeleteModal = (userId: string) => {
        setUserToDelete(userId);
        setDelete(true);
    };
    const openDeleteAnimeModal = (animeId: string) => {
        setAnimeToDelete(animeId);
        setAnimeDelete(true);
    };
    const openDeleteEpisodeModal = (episodeId: string) => {
        setEpisodeToDelete(episodeId);
        setEpisodeDelete(true);
    };
    const openDeleteCategoryModal = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setCategoryDelete(true);
    }

    const handleAnimeSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setAnimeSearchQuery(e.target.value);
        setResetPagination(true);
    };
    const handleCategorySearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setCategorySearchQuery(e.target.value);
        setResetPagination(true);
    };

    const handleEpisodeSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setEpisodeSearchQuery(e.target.value);
        setResetPagination(true);
    };

    const handleUserSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setUserSearchQuery(e.target.value);
        setResetPagination(true);
    }

    const handleBlockUser = async (userId: string, isBlocked: boolean) => {
        try {
            // Call the blockUser function with the userId and new blocked state
            const response = await blockUser(userId, !isBlocked);
    
            // Ensure the response contains the updated user object
            if (response && response.id) { // Check if the response has the expected user ID
                toast.success(`User ${response.isBlocked ? 'blocked' : 'unblocked'} successfully!`, {
                    style: {
                        backgroundColor: '#070720',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        border: '1px solid #ffffff',
                    },
                });
    
                // Update the users state
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? { ...user, isBlocked: response.isBlocked } : user
                    )
                );
            } else {
                toast.error('User status update failed.', {
                    style: {
                        backgroundColor: '#070720',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        border: '1px solid #ffffff',
                    },
                });
            }
        } catch (error) {
            toast.error('Failed to block or unblock user.', {
                style: {
                    backgroundColor: '#070720',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    border: '1px solid #ffffff',
                },
            });
        }
    }


   

    // Redirect unauthorized users early
    if (!loading && (!userData || !userData.isAdmin)) {
        return (
        <div className="bg-custom-blue-dark h-screen flex justify-center items-center">
            <div className="text-4xl text-white text-center font-bold">
            Unauthorized
            </div>
        </div>
        );
    }

    // If still loading user data, show a loading indicator
    if (loading) {
        return (
        <div className="bg-custom-blue-dark h-screen flex justify-center items-center">
            <div className="text-4xl text-white text-center font-bold">
            Loading...
            </div>
        </div>
        );
    }
    return (
        <>
            <div className="container mx-auto h-screen bg-custom-blue-dark">
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                    <p></p>
                </div>
                {(id == '1' && (
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start container mx-auto pl-2 bg-black pb-2">
                    List of Animes
                </div>
                )) || (id == '2' && (
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start container mx-auto pl-2 bg-black pb-2">
                    List of Episodes
                </div>
                )) || (id == '3' && (
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start container mx-auto pl-2 bg-black pb-2">
                    List of Categories
                </div>
                )) || (id == '4' && (
                <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start container mx-auto pl-2 bg-black pb-2">
                    List of Users
                </div>
                ))}
                <div className="w-full max-w-4xl mx-auto mb-5 flex justify-between items-center">
                    <Link href="/Admin">
                        <button className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600">
                            Back
                        </button>
                    </Link>
                    {(id == '1' && (
                        <>
                        <input
                            type="text"
                            placeholder="Search Anime"
                            value={searchAnimeQuery}
                            onChange={handleAnimeSearchChange}
                            className="bg-black text-white px-4 py-2 rounded "
                        />
                        <Link href="/Animes/SettingAnimes">
                            <button className="bg-green-500 text-white font-bold px-4 py-2 rounded hover:bg-green-600">
                                New Anime
                            </button>
                        </Link>
                        </>
                    )) || (id == '2' && (
                        <>
                        <input
                            type="text"
                            placeholder="Search Episode"
                            value={searchEpisodeQuery}
                            onChange={handleEpisodeSearchChange}
                            className="bg-black text-white px-4 py-2 rounded "
                        />
                        <Link href="/Episodes/SettingEpisodes">
                            <button className="bg-green-500 text-white font-bold px-4 py-2 rounded hover:bg-green-600">
                                New Episode
                            </button>
                        </Link>
                        </>
                    )) || (id == '3' && (
                        <>
                        <input
                            type="text"
                            placeholder="Search Category"
                            value={searchCategoryQuery}
                            onChange={handleCategorySearchChange}
                            className="bg-black text-white px-4 py-2 rounded "
                        />
                        <Link href="/Categories">
                            <button className="bg-green-500 text-white font-bold px-4 py-2 rounded hover:bg-green-600">
                                New Category
                            </button>
                        </Link>
                        </>
                    )) || (id == '4' && (
                        <input
                            type="text"
                            placeholder="Search User"
                            value={searchUserQuery}
                            onChange={handleUserSearchChange}
                            className="bg-black text-white px-4 py-2 rounded "
                        />
                        ))}
                </div>
                
                <div className="list-container w-full max-w-4xl mx-auto">
                    {id == '1' && (
                        <div>
                            <table className="w-full text-white">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-2 text-left">ID</th>
                                        <th className="px-4 py-2 text-left">Title</th>
                                        <th className="px-4 py-2 text-left">Small Image</th>
                                        <th className="px-4 py-2 text-left">Edit</th>
                                        <th className="px-4 py-2 text-left">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedAnimes.map((anime) => (
                                        <tr key={anime.id} className="bg-black border-b border-gray-700 hover:bg-gray-900">
                                            <td className="px-4 py-2">{anime.id}</td>
                                            <td className="px-4 py-2">
                                                <Link href={`/AnimesPage/${anime.id}`} className="text-white hover:text-red-500">
                                                    {anime.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2">
                                                <img
                                                    src={`${anime?.image_url}`}
                                                    alt={anime.title}
                                                    className="w-16 h-16 object-cover"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <Link href={`/Animes/SettingAnimes/${anime.id}`}>
                                                <button className="text-white hover:text-red-500">
                                                    <FontAwesomeIcon icon={faEdit}/>
                                                </button>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    className="text-white hover:text-red-500"
                                                    onClick={() => openDeleteAnimeModal(anime.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <PaginationControls
                                currentPage={animeCurrentPage}
                                totalPages={animeTotalPages}
                                onNext={goToNextAnimePage}
                                onPrevious={goToPreviousAnimePage}
                            />
                        </div>
                    )}
                    {id == '2' && (
                        <div>
                            <table className="w-full text-white">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-2 text-left">ID</th>
                                        <th className="px-4 py-2 text-left">Title</th>
                                        <th className="px-4 py-2 text-left">Episode Number</th>
                                        <th className="px-4 py-2 text-left">Thumbnail</th>
                                        <th className="px-4 py-2 text-left">Edit</th>
                                        <th className="px-4 py-2 text-left">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedEpisodes.map((episode) => (
                                        <tr key={episode.id} className="bg-black border-b border-gray-700 hover:bg-gray-900">
                                            <td className="px-4 py-2">{episode.id}</td>
                                            <td className="px-4 py-2">
                                                <Link href={`/EpisodesPage/${episode.idAnime}/${episode.id}`} className="text-white hover:text-red-500">
                                                    {episode.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2">
                                                {episode.episodeNumber}
                                            </td>
                                            <td className="px-4 py-2">
                                                <img
                                                    src={`${episode?.thumbnail_url}`}
                                                    alt={episode.title}
                                                    className="w-16 h-16 object-cover"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <Link href={`/Episodes/SettingEpisodes/${episode.id}`} className="text-white hover:text-red-500">
                                                <button className="text-white hover:text-red-500">
                                                    <FontAwesomeIcon icon={faEdit}/>
                                                </button>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    className="text-white hover:text-red-500"
                                                    onClick={() => openDeleteEpisodeModal(episode.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <PaginationControls
                                currentPage={episodeCurrentPage}
                                totalPages={episodeTotalPages}
                                onNext={goToNextEpisodePage}
                                onPrevious={goToPreviousEpisodePage}
                            />
                        </div>
                    )}
                    {id == '3' && (
                        <div>
                            <table className="w-full text-white">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-2 text-left">ID</th>
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Edit</th>
                                        <th className="px-4 py-2 text-left">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedCategories.map((category) => (
                                        <tr key={category.id} className="bg-black border-b border-gray-700 hover:bg-gray-900">
                                            <td className="px-4 py-2">{category.id}</td>
                                            <td className="px-4 py-2">
                                                {category.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                <Link href={`/Categories/SettingCategories/${category.id}`}>
                                                <button className="text-white hover:text-red-500">
                                                    <FontAwesomeIcon icon={faEdit}/>
                                                </button>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    className="text-white hover:text-red-500"
                                                    onClick={() => openDeleteCategoryModal(category.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <PaginationControls
                                currentPage={categoryCurrentPage}
                                totalPages={categoryTotalPages}
                                onNext={goToNextCategoryPage}
                                onPrevious={goToPreviousCategoryPage}
                            />
                        </div>
                            
                    )}
                    {id == '4' && (
                        <div>
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
                                    {displayedUsers.map((user) => (
                                        <tr key={user.id} className="bg-black border-b border-gray-700 hover:bg-gray-900">
                                            <td className="px-4 py-2">{user.id}</td>
                                            <td className="px-4 py-2">
                                                <Link href={`/Profile/${user.id}`} className="text-white hover:text-red-500">
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
                                                <button className="text-white hover:text-red-500" 
                                                onClick={() =>handleBlockUser(user.id, !user.isBlocked)}>
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
                            <PaginationControls
                                currentPage={userCurrentPage}
                                totalPages={userTotalPages}
                                onNext={goToNextUserPage}
                                onPrevious={goToPreviousUserPage}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Delete User Modal */}
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
                                onClick={handleDeleteUserSubmit}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

             {/* Delete Anime Modal */}
             {isAnimeDeleteModal && (
                <div className="w-screen h-screen bg-custom-dark bg-opacity-50 z-50 fixed top-0 left-0 flex">
                    <div className="bg-custom-blue-dark relative rounded-2xl text-white shadow-lg shadow-[#7887dd] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
                        <div
                            className="absolute top-4 right-4 cursor-pointer text-4xl"
                            onClick={() => setAnimeDelete(false)}
                        >
                            &times;
                        </div>

                        <div className="text-3xl font-bold mx-auto mb-6">Delete</div>

                        <div className="flex mb-5 text-2xl justify-center">
                            <p>Are you sure you want to delete this Anime?</p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                className="bg-red-500 text-white px-4 font-bold py-2 rounded hover:bg-red-600"
                                onClick={handleDeleteAnimeSubmit}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
                
            {/* Delete Episode Modal */}
            {isEpisodeDeleteModal && (
                <div className="w-screen h-screen bg-custom-dark bg-opacity-50 z-50 fixed top-0 left-0 flex">
                    <div className="bg-custom-blue-dark relative rounded-2xl text-white shadow-lg shadow-[#7887dd] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
                        <div
                            className="absolute top-4 right-4 cursor-pointer text-4xl"
                            onClick={() => setEpisodeDelete(false)}
                        >
                            &times;
                        </div>

                        <div className="text-3xl font-bold mx-auto mb-6">Delete</div>

                        <div className="flex mb-5 text-2xl justify-center">
                            <p>Are you sure you want to delete this Episode?</p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                className="bg-red-500 text-white px-4 font-bold py-2 rounded hover:bg-red-600"
                                onClick={handleDeleteEpisodeSubmit}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Category Modal */}
            {isCategoryDeleteModal && (
                <div className="w-screen h-screen bg-custom-dark bg-opacity-50 z-50 fixed top-0 left-0 flex">
                    <div className="bg-custom-blue-dark relative rounded-2xl text-white shadow-lg shadow-[#7887dd] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
                        <div
                            className="absolute top-4 right-4 cursor-pointer text-4xl"
                            onClick={() => setCategoryDelete(false)}
                        >
                            &times;
                        </div>

                        <div className="text-3xl font-bold mx-auto mb-6">Delete</div>

                        <div className="flex mb-5 text-2xl justify-center">
                            <p>Are you sure you want to delete this Category?</p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                className="bg-red-500 text-white px-4 font-bold py-2 rounded hover:bg-red-600"
                                onClick={handleDeleteCategorySubmit}
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