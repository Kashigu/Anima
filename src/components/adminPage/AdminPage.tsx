"use client";
import useUser from "@/app/hooks/useUser";
import Link from "next/link";

const AdminPage = () => {
  const { userData, loading } = useUser();

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

  // Render the admin page content if the user is authorized
  return (
    <div className="bg-custom-blue-dark h-screen flex flex-col w-full">
      <div className="flex flex-col container mx-auto w-full mt-16 text-white text-4xl font-bold justify-start pl-2 bg-black pb-2 mb-12">
        Content Management
      </div>
  
      <div className="container mx-auto flex justify-center items-center">
        <div className="flex flex-row justify-center items-center gap-16 w-full text-white">
          {/* Create Animes Section */}
          <div className="flex flex-col items-center bg-black p-4 rounded-lg shadow-lg w-[250px] h-[350px]">
            <div className="w-full h-[200px] bg-gray-800 mb-4">
              <img
                src="images/imagenami.png"
                alt="Create Animes"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl mb-4 font-bold">Animes</h2>
            <Link href={`/AdminList/1`}>
              <button className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600">
                List of Animes
              </button>
            </Link>
          </div>
  
          {/* Create Episodes Section */}
          <div className="flex flex-col items-center bg-black p-4 rounded-lg shadow-lg w-[250px] h-[350px]">
            <div className="w-full h-[200px] bg-gray-800 mb-4">
              <img
                src="images/imagesyndra.png"
                alt="Create Episodes"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl mb-4 font-bold">Episodes</h2>
            <Link href={`/AdminList/2`}>
              <button className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600">
              List of Episodes
              </button>
            </Link>
          </div>
          {/* Create Manga Section */}
          <div className="flex flex-col items-center bg-black p-4 rounded-lg shadow-lg w-[250px] h-[350px]">
            <div className="w-full h-[200px] bg-gray-800 mb-4">
              <img
                src="images/cover2.jpg"
                alt="Create Mangas"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl mb-4 font-bold">Categories</h2>
            <Link href={`/AdminList/3`}>
              <button className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600">
                List of Categories
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col container mx-auto w-full mt-16 text-white text-4xl font-bold justify-start pl-2 bg-black pb-2 mb-12">
        Administration
      </div>

      <div className="container mx-auto flex justify-center items-center">
        <div className="flex flex-row justify-center items-center gap-16 w-full text-white">
          {/* User Administration Section */}
          <div className="flex flex-col items-center bg-black p-4 rounded-lg shadow-lg w-[250px] h-[350px]">
              <div className="w-full h-[200px] bg-gray-800 mb-4">
                <img
                  src="images/darktarr.png"
                  alt="User Administration"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl mb-4 font-bold">Users</h2>
              <Link href={`/AdminList/4`}>
                <button className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600">
                  List of Users
                </button>
              </Link> 
           </div>
        </div>
      </div>
    </div>
  );
  
};

export default AdminPage;
