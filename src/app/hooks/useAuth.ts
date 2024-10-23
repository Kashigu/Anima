import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { getUserWithToken } from '@/lib/client/user';
import { User } from '@/lib/interfaces/interface';

type SetUserDataFunction = (userData: User | null) => void;

const useAuth = (setUserData: SetUserDataFunction) => {
  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken');
    const tokenFromLocalStorage = localStorage.getItem('jwtToken');
    
    const token = tokenFromCookie || tokenFromLocalStorage; // Prioritize cookie if available

    if (token) {
      const fetchData = async () => {
        try {
          const user = await getUserWithToken(token);
          if (user) {
            setUserData(user); // Set user data in the state
          } else {
            setUserData(null); // Clear user data if no user found
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null); // Clear user data on error
        }
      };
      fetchData();
    } else {
      setUserData(null); // Clear user data if not authenticated
    }
  }, [setUserData]);
};

export default useAuth;
