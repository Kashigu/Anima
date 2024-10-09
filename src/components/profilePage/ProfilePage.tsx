"use client";
import { User } from "@/lib/interfaces/interface";

interface UserPageProps {
  userId: User | null;
}

const ProfilePage = ({ userId }: UserPageProps) => {

  if (userId === null || userId.id === null) {
    return (
      <div className="bg-custom-blue-dark h-screen flex justify-center pt-5">
        <div className="text-4xl text-white text-center font-bold">
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-custom-blue-dark h-screen flex flex-col w-full">
      {/* Display anime title */}
      <div className="text-4xl text-white text-center justify-center font-bold pt-5 mb-8">
        {userId?.name}
      </div>
      <div className="container mx-auto">
        <div className="flex flex-row justify-center items-start gap-12 w-full text-white">
          <div className="relative w-[250px] h-[250px] bg-black">
            {/* Display user image */}
            <img
              src={`/${userId?.image_url}`}
              alt={userId?.name}
              className="w-full h-full center-cropped"
            />
          </div>
          {/* Description on the right */}
          <div className="flex flex-col max-w-lg text-lg">
            <h2 className="text-2xl mb-4 font-bold">Description</h2>
            <p>{userId.description}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col container mx-auto w-full mt-16 text-white text-4xl font-bold justify-start pl-2 bg-black pb-2 mb-12">
        Status
      </div>
      {/* Grid Layout for stats */}
      <div className="container text-xl flex justify-center items-center mx-auto">
        <div className="grid grid-cols-2 gap-x-24 gap-y-4 text-white">
          {/* Left Column - 5 items */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Completed:</span>
              <span className="ml-24">359</span> 
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Watching:</span>
              <span className="ml-24">9</span> 
            </div>
            <div className="flex justify-between">
              <span className="font-bold">On Hold:</span>
              <span className="ml-24">0</span> 
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Dropped:</span>
              <span className="ml-24">2</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Plan to Watch:</span>
              <span className="ml-24">5</span> 
            </div>
          </div>

          {/* Right Column - 3 items */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total Entries:</span>
              <span className="ml-24">412</span> 
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Rewatched:</span>
              <span className="ml-24">0</span> 
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Episodes:</span>
              <span className="ml-24">1114820</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Favourites:</span>
              <span className="ml-24">5</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Likes:</span>
              <span className="ml-24">5</span> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
