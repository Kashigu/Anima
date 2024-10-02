"use client";
import { User } from "@/lib/interfaces/interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserPageProps {
  userId: User | null;
}

const SettingPage = ({ userId }: UserPageProps) => {
  const loggedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isUser =
    userId?.id === loggedUser.id &&
    userId?.email === loggedUser.email &&
    userId?.name === loggedUser.name &&
    userId?.image_url === loggedUser.image_url &&
    userId?.isAdmin === loggedUser.isAdmin;

  const [formData, setFormData] = useState({
    name: userId?.name || '',
    email: userId?.email || '',
    image: null as File | null, // Store image file
    password: '',
    confirmPassword: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null); // For image preview

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Perform form submission logic here
    console.log(formData);
  };

  if (isUser === false) {
    const router = useRouter();

    useEffect(() => {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 3000);

      return () => clearTimeout(timeout);
    }, [router]);

    return (
      <div className="bg-custom-blue-dark h-screen flex justify-center pt-5">
        <div className="text-4xl text-white text-center font-bold">
          Error 401: Unauthorized
        </div>
      </div>
    );
  }

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
