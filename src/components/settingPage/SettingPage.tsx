"use client";
import useAuth from "@/app/hooks/useAuth";
import useUser from "@/app/hooks/useUser";
import { updateUser } from "@/lib/client/user";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";


const SettingPage = () => {
  const { userData, loading } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image_url: null as File | null,
    password: '',
    confirmPassword: '',
    description: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Update formData whenever userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        image_url: null,
        password: '',
        confirmPassword: '',
        description: userData.description || "",
      });
    }
  }, [userData]);

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
        image: file, // Store the file object
      }));
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!', {
        style: {
          backgroundColor: '#070720',
          color: '#ffffff',
          fontWeight: 'bold',
          border: '1px solid #ffffff',
        },
      });
      return;
    }
    console.log (userData?.id);

    try {
      const response = await updateUser({
        id: userData?.id,
        name: formData.name,
        email: formData.email,
        description: formData.description,
        image_url: formData.image_url === null ? userData?.image_url : formData.image_url,
        password: formData.password === '' ? userData?.password : formData.password
      });

      if (response) {
        toast.success('Changes successful!', {
          style: {
            backgroundColor: '#070720',
            color: '#ffffff',
            fontWeight: 'bold',
            border: '1px solid #ffffff',
          },
        });
       

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
   // Redirect if user data is not available
   useEffect(() => {
    if (!loading && !userData) {
      router.push("/"); 
    }
  }, [loading, userData, router]);

  return (
    <div className="bg-custom-blue-dark h-screen flex flex-col w-full">
      <div className="text-4xl text-white text-center justify-center font-bold pt-5 mb-8">
        Settings
      </div>
      <div className="container mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 text-white"
        >
          {/* Other input fields */}
          <div className="w-full max-w-md">
            <label className="block mb-2 text-2xl">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-custom-dark text-white rounded"
              required
            />
          </div>

          <div className="w-full max-w-md">
            <label className="block mb-2 text-2xl">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-custom-dark text-white rounded"
              required
            />
          </div>

          {/* File Input */}
          <div className="w-full max-w-md">
            <label className="block mb-2 text-2xl">Image Upload</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-custom-dark text-white rounded"
              accept="image/*"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="w-full max-w-md">
              <img src={imagePreview} alt="Preview" className="w-full mt-4" />
            </div>
          )}

          <div className="w-full max-w-md">
            <label className="block mb-2 text-2xl">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-custom-dark text-white rounded"
            />
          </div>

          <div className="w-full max-w-md">
            <label className="block mb-2 text-2xl">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-custom-dark text-white rounded"
            />
          </div>

          <div className="w-full max-w-md">
            <label className="block mb-2 text-2xl">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-custom-dark text-white rounded"
            />
          </div>

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

export default SettingPage;
