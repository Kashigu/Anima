"use client";
import useUser from "@/app/hooks/useUser";
import { getAnimes, getSearchedAnimes, postEpisode, updateEpisode } from "@/lib/client/animesClient";
import { Anime, Episode } from "@/lib/interfaces/interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface EpisodesPageProps {
    episode?: Episode | null;
}

const NewEpisode = ({ episode }: EpisodesPageProps) => {
    const { userData, loading } = useUser();
    const [formData, setFormData] = useState({
        title: "",
        episodeNumber: "",
        thumbnail_url: null as File | null,
        idAnime: "",
        video_url: null as File | null
    });
    const [searchAnimeQuery, setAnimeSearchQuery] = useState('');
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false); // Control visibility of search results
    const router = useRouter();

    useEffect(() => {
        const gettingAnimes = async () => {
            try {
                const data = await getAnimes();
                setAnimes(data || []);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        if (episode) {
            setFormData({
                title: episode.title || "",
                episodeNumber: episode.episodeNumber || "",
                thumbnail_url: null,
                idAnime: episode.idAnime || "",
                video_url: null,
            });
        }
        gettingAnimes();
    }, [episode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            const file = files[0];
            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));
            const imagePreviewUrl = URL.createObjectURL(file);
            if (name === 'thumbnail_url') {
                setImagePreview(imagePreviewUrl);
            } 
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("episodeNumber", formData.episodeNumber);
        formDataToSend.append("idAnime", formData.idAnime);
        
        if (formData.thumbnail_url) {
            formDataToSend.append("thumbnail_url", formData.thumbnail_url);
        }
        if (formData.video_url) {
            formDataToSend.append("video_url", formData.video_url);
        }

        try {
            const response = await postEpisode(formDataToSend);
            if (response) {
                toast.success('Episode Created successfully!', {    
                    style: {
                        backgroundColor: '#070720',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        border: '1px solid #ffffff',
                    },
                });
                setTimeout(() => {
                    router.push("/AdminList/2");
                }, 2000);
            } else {
                console.error('Error:', response);
                toast.error('Error during Creation!', {
                    style: {
                        backgroundColor: '#070720',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        border: '1px solid #ffffff',
                    },
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error during Creation!', {
                style: {
                    backgroundColor: '#070720',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    border: '1px solid #ffffff',
                },
            });
        }
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        if (episode?.id) {
            formDataToSend.append("id", episode.id);
        }
        formDataToSend.append("title", formData.title);
        formDataToSend.append("episodeNumber", formData.episodeNumber);
        formDataToSend.append("idAnime", formData.idAnime);
        
        if (formData.thumbnail_url) {
            formDataToSend.append("thumbnail_url", formData.thumbnail_url);
        }
        if (formData.video_url) {
            formDataToSend.append("video_url", formData.video_url);
        }

        try {
            const response = await updateEpisode(formDataToSend);
            if (response) {
                toast.success('Episode Updated successfully!', {
                    style: {
                        backgroundColor: '#070720',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        border: '1px solid #ffffff',
                    },
                });
                setTimeout(() => {
                    router.push("/AdminList/2");
                }, 2000);
            } else {
                console.error('Error:', response);
                toast.error('Error during Update!', {
                    style: {
                        backgroundColor: '#070720',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        border: '1px solid #ffffff',
                    },
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error during Update!', {
                style: {
                    backgroundColor: '#070720',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    border: '1px solid #ffffff',
                },
            });
        }
    };

    const handleAnimeSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnimeSearchQuery(e.target.value);
        setShowResults(true); // Show results while typing
    };

    useEffect(() => {
        const fetchSearchedAnimes = async () => {
            if (searchAnimeQuery.trim()) {
                try {
                    const results = await getSearchedAnimes(searchAnimeQuery);
                    setAnimes(results);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                setAnimes([]); // Clear results when the input is empty
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchSearchedAnimes();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchAnimeQuery]);

    const handleAnimeSelect = (anime: Anime) => {
        setFormData((prev) => ({ ...prev, idAnime: anime.id }));
        setAnimeSearchQuery(anime.title); // Set the input to the selected anime title
        setShowResults(false); // Hide results when an anime is selected
    };

    // Redirect unauthorized users early
    if (!loading && (!userData || !userData.isAdmin)) {
        return (
            <div className="bg-custom-blue-dark h-screen flex justify-center items-center">
                <div className="text-4xl text-white text-center font-bold">Unauthorized</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-custom-blue-dark h-screen flex justify-center items-center">
                <div className="text-4xl text-white text-center font-bold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto h-screen bg-custom-blue-dark">
            <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
                <p></p>
            </div>
            <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start container mx-auto pl-2 bg-black pb-2">
                {episode ? "Editing Episode" : "New Episode"}
            </div>
            <div className="container mx-auto">
                <div className="w-full max-w-4xl mx-auto mb-5 flex justify-between items-center">
                    <Link href="/AdminList/2">
                        <button className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600">
                            Back
                        </button>
                    </Link>
                </div>
                <form 
                    onSubmit={episode ? handleUpdateSubmit : handleSubmit}
                    className="flex flex-col items-center gap-6 text-white"
                    method="POST"
                    encType="multipart/form-data"
                >
                    {/* Title Field */}
                    <div className="w-full max-w-md">
                        <label className="block mb-2 text-2xl">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-black text-white rounded"
                            required
                        />
                    </div>

                    {/* Episode Number Field */}
                    <div className="w-full max-w-md">
                        <label className="block mb-2 text-2xl">Episode Number</label>
                        <input
                            type="text"
                            name="episodeNumber"
                            value={formData.episodeNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-black text-white rounded"
                            required
                        />
                    </div>

                    {/* Video Input */}
                    <div className="w-full max-w-md">
                        <label className="block mb-2 text-2xl">Video Episode</label>
                        <input
                            type="file"
                            name="video_url"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 bg-black text-white rounded"
                            accept="video/*"
                        />
                    </div>

                    {/* File Input */}
                    <div className="w-full max-w-md">
                        <label className="block mb-2 text-2xl">Thumbnail Episode</label>
                        <input
                            type="file"
                            name="thumbnail_url"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 bg-black text-white rounded"
                            accept="image/*"
                        />
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="w-full max-w-md">
                            <img src={imagePreview} alt="Preview" className="w-full mt-4" />
                        </div>
                    )}

                    {/* Anime Search Input */}
                    <div className="w-full max-w-md">
                        <label className="block mb-2 text-2xl">Anime</label>
                        <input
                            type="text"
                            value={searchAnimeQuery}
                            onChange={handleAnimeSearchChange}
                            onFocus={() => setShowResults(true)} // Show results on focus
                            className="w-full px-4 py-2 bg-black text-white rounded"
                            placeholder="Search Anime"
                            required
                        />
                        {/* Display the list of anime results */}
                        {showResults && searchAnimeQuery && animes.length > 0 && (
                            <ul className="bg-black text-white max-h-40 overflow-y-auto mt-2 rounded shadow-lg">
                                {animes.map((anime) => (
                                    <li
                                        key={anime.id}
                                        onClick={() => handleAnimeSelect(anime)}
                                        className="flex items-center px-4 py-2 cursor-pointer hover:bg-red-500"
                                    >
                                        <img
                                            src={anime.image_url}
                                            alt={anime.title}
                                            className="w-12 h-12 mr-2 rounded"
                                        />
                                        <span>{anime.title}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600"
                    >
                        {episode ? "Save Changes" : "Create Episode"}
                    </button>
                    <div className="mt-16" /> {/* This adds space below the button */}
                </form>
            </div>
        </div>
    );
};

export default NewEpisode;
