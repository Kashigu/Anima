import ProfilePage from '@/components/profilePage/ProfilePage';
import '../../../globals.css'; // Ensure this path is correct
import { User } from '@/lib/interfaces/interface';
import { getUserById } from '@/lib/client/user';


async function fetchUserById(id: string): Promise<User | null> {
    try {
      const data = await getUserById(id);
      if (!data) {
        return null; // Ensure we return null if data is not found
      }
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null; // Handle error by returning null
    }
  }


async function Profile({ params }: { params: { id: string } }) {
    const { id } = params;
    const userId = await fetchUserById(id);
    return (
      <>
      <div className=" bg-custom-blue-dark">
        <ProfilePage userId={userId} />
      </div>
      </>
      
    );
    
    
  }

  export default Profile;