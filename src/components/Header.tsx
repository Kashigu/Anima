"use client"; 
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUser ,faSearch } from '@fortawesome/free-solid-svg-icons'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast,{ Toaster } from 'react-hot-toast';
import { postUser , signIn} from '@/lib/client/user';
import { User } from '@/lib/interfaces/interface';
import userAuth from '@/app/hooks/useAuth'; 
import Cookies from 'js-cookie';


function Header() {
  const [isLogin, setLogin] = useState(false);
  const [isRegister, setRegister] = useState(false);
  const [isLogoutModal, setLogout] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmationPassword: ''
  });
  const [userData, setUserData] = useState<User | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleRegisterSubmit = async () => {
    if (formData.password !== formData.confirmationPassword) {
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

    try {
      const response = await postUser({
        name: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response) {
        toast.success('Registration successful!', {
          style: {
            backgroundColor: '#070720',
            color: '#ffffff',
            fontWeight: 'bold',
            border: '1px solid #ffffff',
          },
        });
        setRegister(false); // Close modal after successful registration
      } else {
        toast.error('Error during registration!', {
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
      toast.error('Error during registration!', {
        style: {
          backgroundColor: '#070720',
          color: '#ffffff',
          fontWeight: 'bold',
          border: '1px solid #ffffff',
        },
      });
    }
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await signIn(formData.email, formData.password);
      
  
      if (response) {
        const { token, user } = response; // Get both the token and user data
  
        if (token) { // Ensure the token exists before setting it
          localStorage.setItem('jwtToken', token); // Store the token in localStorage
          Cookies.set('authToken', token, { expires: 7, path: '/', sameSite: 'lax' });
          
  
          setUserData(user); // Store user data
          if (user.isBlocked) {
            handleLogoutSubmit('Your account is blocked. You have been logged out.','error');
            return;
          }
          else{
            toast.success('Login successful!', {
              style: {
                backgroundColor: '#070720',
                color: '#ffffff',
                fontWeight: 'bold',
                border: '1px solid #ffffff',
              },
            });
            sessionStorage.setItem('user', JSON.stringify(user));
          }

          
          
          setLogin(false); // Close modal after successful login
        } else {
          console.error('No token received.');
          toast.error('Login failed! No token received.', {
            style: {
              backgroundColor: '#070720',
              color: '#ffffff',
              fontWeight: 'bold',
              border: '1px solid #ffffff',
            },
          });
        }
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Login failed! Please check your credentials.', {
        style: {
          backgroundColor: '#070720',
          color: '#ffffff',
          fontWeight: 'bold',
          border: '1px solid #ffffff',
        },
      });
    }
  };

  const handleLogoutSubmit = (message = 'Logout successful!', type = 'success') => {
    localStorage.removeItem('jwtToken'); // Remove token from localStorage
    Cookies.remove('authToken'); // Remove token from cookies
    setUserData(null); // Clear user data
    setLogout(false); // Close modal after successful logout
    router.push('/'); // Redirect to homepage
  
    if (type === 'error') {
      toast.error(message, { // Display the toast as an error
        style: {
          backgroundColor: '#070720',
          color: '#ffffff',
          fontWeight: 'bold',
          border: '1px solid #ffffff',
        },
      });
    } else {
      toast.success(message, { // Display the toast as a success
        style: {
          backgroundColor: '#070720',
          color: '#ffffff',
          fontWeight: 'bold',
          border: '1px solid #ffffff',
        },
      });
    }
  };
  
 
  userAuth(setUserData); 

  return (
    <>
    <Toaster />
    <header className="bg-black flex justify-between items-center px-6 py-4">
      
      <div className="text-3xl text-white font-bold">
        <Link href="/">
          Ani<span className="text-red-500">ma</span>
        </Link>
      </div>
      <nav className="text-white font-bold space-x-12">
        <Link href="/" className="hover:text-red-500">
          Homepage
        </Link>
        <Link href="/Animes" className="hover:text-red-500">
          Animes
        </Link>
        <Link href="/Episodes" className="hover:text-red-500">
          Episodes
        </Link>
      </nav>
      <div className="space-x-12 flex  ">
        <button className="text-white hover:text-red-500">
          <FontAwesomeIcon icon={faSearch} />
        </button>
        {userData ? ( 
        <>
        <img
          src={`/${userData?.image_url}`}
          alt="User Avatar"
          className="h-10 w-10 rounded-full cursor-pointer" 
          onClick={() => setDropdownOpen(!isDropdownOpen)} 
        />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-14 w-48 bg-black rounded-md shadow-lg py-2 z-50">
              <a href = {`/Profile/${userData.id}`} className="block px-4 py-2  text-white hover:bg-red-500">
                Profile
              </a>
              <a href={`/Settings`} className="block px-4 py-2 text-white hover:bg-red-500">
                Settings
              </a>
              {userData.isAdmin && (
              <a href={`/Admin`} className="block px-4 py-2 text-white hover:bg-red-500">
                Admin Page
              </a>
              )}
              <a href='#' onClick={() => setLogout(true)} className="block px-4 py-2 text-white hover:bg-red-500">
                Logout
              </a>
            </div>
          )}
        </>
        ) : (
          <button className="text-white hover:text-red-500" onClick={() => setLogin(true)}>
            <FontAwesomeIcon icon={faUser} />
          </button>
        )}
      </div>
    </header>

    {/* Login Modal */}
    {isLogin === true ? (
      <div className="w-screen h-screen bg-custom-dark bg-opacity-50 z-50 fixed top-0 left-0 flex">
      {/* Modal container */}
        <div className="bg-custom-blue-dark relative rounded-2xl text-white shadow-lg shadow-[#7887dd] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
          
          {/* Close button */}
          <div
            className="absolute top-4 right-4 cursor-pointer text-4xl"
            onClick={() => setLogin(false)}
          >
            &times;
          </div>
          
          <div className="text-2xl font-bold  mx-auto mb-6">
            Login
          </div>
      
          {/* Email Input */}
          <div className="bg-black rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="email"
              type="text"
              placeholder="Email"
              className="bg-black w-full outline-none"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
      
          {/* Password Input */}
          <div className="bg-black rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="bg-black w-full outline-none"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
      
          {/* Forgot Password & Register */}
          <div className="flex mb-5 justify-between">
            <div>
              <p>Forgot Password ?</p>
            </div>
            <div onClick={() => {
              setLogin(false);
              setRegister(true);
            }}>
              <p>Register</p>
            </div>
          </div>
      
          {/* Login Button */}
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white px-4 font-bold py-2 rounded hover:bg-red-600"
              onClick={handleLoginSubmit}
            >
              Login
            </button>
          </div>
      </div>
    </div>
    
    ) : null}

    {/* Logout Modal */}
    {isLogoutModal === true ? (
      <div className="w-screen h-screen bg-custom-dark bg-opacity-50 z-50 fixed top-0 left-0 flex">
      {/* Modal container */}
        <div className="bg-custom-blue-dark relative rounded-2xl text-white shadow-lg shadow-[#7887dd] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
          
          {/* Close button */}
          <div
            className="absolute top-4 right-4 cursor-pointer text-4xl"
            onClick={() => setLogout(false)}
          >
            &times;
          </div>
          
          <div className="text-3xl font-bold  mx-auto mb-6">
            Logout
          </div>   

          {/* Logout */}
          <div className="flex  mb-5 text-2xl justify-center">
            <div>
              <p>Are you sure you want to Logout ?</p>
            </div>
          </div>
      
          {/* Logout Button */}
          <div className="flex justify-center ">
            <button
              className="bg-red-500 text-white px-4 font-bold py-2 rounded hover:bg-red-600"
              onClick={() => handleLogoutSubmit('Logout successful!', 'success')}
            >
              Logout
            </button>
          </div>
      </div>
    </div>
    
    ) : null}

    {/* Register Modal */}
    {isRegister === true ? (
      <div className="w-screen h-screen bg-custom-dark bg-opacity-50 z-50 fixed top-0 left-0 flex">
      {/* Modal container */}
        <div className="bg-custom-blue-dark relative rounded-2xl text-white shadow-lg shadow-[#7887dd] xl:w-4/12 lg:w-6/12 md:w-8/12 w-10/12 p-8 mx-auto my-auto flex flex-col">
          
          {/* Close button */}
          <div
            className="absolute top-4 right-4 cursor-pointer text-4xl"
            onClick={() => setRegister(false)}
          >
            &times;
          </div>
          
          <div className="text-2xl font-bold mx-auto mb-6">
            Register
          </div>
      
          {/* Username Input */}
          <div className="bg-black rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="bg-black w-full outline-none"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
        
          {/* Email Input */}
          <div className="bg-black rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="bg-black w-full outline-none"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
      
          {/* Password Input */}
          <div className="bg-black rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="bg-black w-full outline-none"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          {/* Confirmation Password Input */}
          <div className="bg-black rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="confirmationPassword"
              type="password"
              placeholder="Confirmation Password"
              className="bg-black w-full outline-none"
              value={formData.confirmationPassword}
              onChange={handleInputChange}
            />
          </div>
      
          {/* Forgot Password & Register */}
          <div className="flex mb-5 justify-between">
            <div>
              <p></p>
            </div>
            <div onClick={() => {
              setLogin(true);
              setRegister(false);
            }}>
              <p>Sign In</p>
            </div>
          </div>
      
          {/* Register Button */}
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600"
              onClick={handleRegisterSubmit}
            >
              Register
            </button>
          </div>
      </div>
    </div>
    ) : null}
    </>
  );
};

export default Header;
