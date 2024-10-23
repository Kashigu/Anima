"use client";
import useUser from "@/app/hooks/useUser";
import { postCategory, updateCategory } from "@/lib/client/categories";
import { Category } from "@/lib/interfaces/interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CategoriesPageProps {
    category?: Category | null;
}

const NewCategory = ({ category }: CategoriesPageProps) => {
    const { userData, loading } = useUser();
    const [formData, setFormData] = useState({
        name: ""
    });

    const router = useRouter();

    useEffect(() => {
        if (category) {
            setFormData({
              name: category.name || "",
            });
          }
        


    }, [category]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name); 
        try {
            const response = await postCategory(formDataToSend);
            if (response) {
                toast.success('Category Created successfully!', {
                    style: {
                        backgroundColor: '#070720',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        border: '1px solid #ffffff',
                    },
                });
                setTimeout(() => {
                    router.push("/AdminList/3");
                }, 2000); // 2000 milliseconds = 2 seconds
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
    const handleCategoryUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        if (category?.id) {
            formDataToSend.append("id", category.id);
        }
        formDataToSend.append("name", formData.name);
        
        

        
        try {
            const response = await updateCategory(formDataToSend);
            if (response) {
                toast.success('Category Updated successfully!', {
                    style: {
                        backgroundColor: '#070720',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        border: '1px solid #ffffff',
                    },
                });
                setTimeout(() => {
                    router.push("/AdminList/3");
                }, 2000); // 2000 milliseconds = 2 seconds
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
                {category ? "Editing Category" : "New Category"}
            </div>
            <div className="container mx-auto">
                <div className="w-full max-w-4xl mx-auto mb-5 flex justify-between items-center">
                    <Link href="/AdminList/3">
                        <button className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600">
                            Back
                        </button>
                    </Link>
                </div>
                <form 
                    onSubmit={category ? handleCategoryUpdate : handleSubmit}
                    className="flex flex-col items-center gap-6 text-white"
                    method="POST" // Changed to POST
                    encType="multipart/form-data"
                >
                    {/* Name Field */}
                    <div className="w-full max-w-md">
                        <label className="block mb-2 text-2xl">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-black text-white rounded"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600"
                    >
                        {category ? "Save Changes" : "Create Category"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default NewCategory;
