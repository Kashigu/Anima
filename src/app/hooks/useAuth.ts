import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { getUserWithToken } from '@/lib/client/user';
import { User } from '@/lib/interfaces/interface';

type SetUserDataFunction = (userData: User | null) => void;

const useAuth = (setUserData :SetUserDataFunction) => {
  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken');
    const tokenFromLocalStorage = localStorage.getItem('jwtToken');

    if (tokenFromCookie || tokenFromLocalStorage) {
      const token = tokenFromCookie || tokenFromLocalStorage; // Prioritize cookie if available
      

      if (token) {
        const fetchData = async () => {
          const user = await getUserWithToken(token);
          setUserData(user); // Set user data in the state
        };
        fetchData();
      } else {
        console.log('User is not authenticated');
        setUserData(null); // Clear user data if not authenticated
      }
    }
  }, [setUserData]);
};

export default useAuth;
