import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import { User } from '@/lib/interfaces/interface';

const useUser = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useAuth(setUserData); // Call useAuth to get user data

  useEffect(() => {
    if (userData !== null) {
      setLoading(false); // Loading complete once userData is set
    }
  }, [userData]);

  return { userData, loading };
};

export default useUser;
