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
        image_url: file, // Store the file object
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
    
    const formDataToSend = new FormData();
    if (userData?.id) {
      formDataToSend.append("id", userData.id);
    }
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("description", formData.description);
    if (formData.image_url) {
      formDataToSend.append("image_url", formData.image_url);
    } else if (userData?.image_url) {
      formDataToSend.append("existing_image_url", userData.image_url);
    }
    formDataToSend.append("password", formData.password === '' ? userData?.password || '' : formData.password);
    try {
      const response = await updateUser(formDataToSend); // Ensure updateUser is adjusted to accept FormData
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
          window.location.reload();
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
   // Redirect if user data is not available
   useEffect(() => {
    if (!loading && !userData) {
      router.push("/"); 
    }
  }, [loading, userData, router]);

  return (
    <div className="bg-custom-blue-dark h-screen flex flex-col w-full">
      <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start">
        <p></p>
      </div>
      <div className="flex flex-col mb-12 w-full text-white text-4xl font-bold justify-start container mx-auto pl-2 bg-black pb-2">
        Settings
      </div>
      <div className="container mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 text-white"
          method="PUT"
          encType="multipart/form-data"
        >
          {/* Other input fields */}
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

          <div className="w-full max-w-md">
            <label className="block mb-2 text-2xl">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black text-white rounded"
              required
            />
          </div>

          {/* File Input */}
          <div className="w-full max-w-md">
            <label className="block mb-2 text-2xl">Image Upload</label>
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

          <div className="w-full max-w-md">
            <label className="block mb-2 text-2xl">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black text-white rounded"
            />
          </div>

          <div className="w-full max-w-md">
            <label className="block mb-2 text-2xl">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black text-white rounded"
            />
          </div>

          <div className="w-full max-w-md">
            <label className="block mb-2 text-2xl">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black text-white rounded"
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
