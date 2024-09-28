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
        <div className="flex justify-center gap-12 pb-10 items-center">
          <div className="relative w-[250px] h-[250px] bg-black">
            {/* Display user image */}
            <img
              src={`/${userId?.image_url}`}
              alt={userId?.name}
              className="w-full h-full center-cropped"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="text-white text-2xl font-bold">Name:</div>
              <div className="text-white text-2xl">{userId?.name}</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
  
  };
  
  
  
  export default ProfilePage;