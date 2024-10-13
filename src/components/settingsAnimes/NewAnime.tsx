import useUser from "@/app/hooks/useUser";
import { postAnime } from "@/lib/client/animesClient";
import { getCategories } from "@/lib/client/categories";
import { Category } from "@/lib/interfaces/interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NewAnime = () => {
    const { userData, loading } = useUser();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image_url: null as File | null,
        genres: [] as string[], // Array to hold selected genres
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();

    useEffect(() => {
        const gettingCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data || []);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        gettingCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({
                ...prev,
                image_url: file,
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            genres: checked
                ? [...prev.genres, value]
                : prev.genres.filter((genre) => genre !== value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        
        // Correctly append genres from formData
        formData.genres.forEach((genre) => formDataToSend.append('genres[]', genre)); 
        
        if (formData.image_url) {
            formDataToSend.append("image_url", formData.image_url);
        }
        
        try {
            const response = await postAnime(formDataToSend);
            if (response) {
                toast.success('Changes successful!', {
                    style: {
                        backgroundColor: '#070720',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        border: '1px solid #ffffff',
                    },
                });
                setTimeout(() => {
                    router.push("/AdminList/1");
                }, 2000); // 2000 milliseconds = 2 seconds
            } else {
                console.error('Error:', response);
                toast.error('Error during Changes!', {
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
            toast.error('Error during Changes!', {
                style: {
                    backgroundColor: '#070720',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    border: '1px solid #ffffff',
                },
            });
        }
    };

    // Redirect unauthorized users early
    if (!loading && (!userData || !userData.isAdmin)) {
        return (
            <div className="bg-custom-blue-dark h-screen flex justify-center items-center">
                <div className="text-4xl text-white text-center font-bold">Unauthorized</div>
            </div>
        );
    }

    // If still loading user data, show a loading indicator
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
                New Anime
            </div>
            <div className="container mx-auto">
                <form 
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center gap-6 text-white"
                    method="POST" // Changed to POST
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

                    {/* Description Field */}
                    <div className="w-full max-w-md">
                        <label className="block mb-2 text-2xl">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-black text-white rounded"
                            required
                        />
                    </div>

                    {/* File Input */}
                    <div className="w-full max-w-md">
                        <label className="block mb-2 text-2xl">Small Image Upload</label>
                        <input
                            type="file"
                            name="image_url"
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

                    {/* Genre Checkboxes */}
                    <div className="w-full max-w-md">
                        <label className="block mb-2 text-2xl">Genres</label>
                        <div className="flex flex-wrap gap-4">
                            {categories.map((category) => (
                                <div key={category.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="genres"
                                        id={category.id}
                                        value={category.name}
                                        onChange={handleCheckboxChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor={category.id} className="text-white">
                                        {category.name} 
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewAnime;
