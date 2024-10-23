import ProfilePage from '@/components/profilePage/ProfilePage';
import '../../../globals.css';
import { User } from '@/lib/interfaces/interface';
import { getUserById } from '@/lib/client/user';


async function fetchUserById(id: string): Promise<User | null> {
    try {
      const data = await getUserById(id);
      if (!data) {
        return null; 
      }
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null; 
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