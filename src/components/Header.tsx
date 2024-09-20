// src/components/Header.tsx
"use client"; // This is important for client-side functionality

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

function Header() {

  const [isLogin, setLogin] = useState(false);
  const [isRegister, setRegister] = useState(false);


  return (
    <>
    <header className="bg-custom-dark flex justify-between items-center px-6 py-4">
      <div className="text-3xl text-white font-bold">
        <Link href="/">
          Ani<span className="text-red-500">ma</span>
        </Link>
      </div>
      <nav className="text-white font-bold space-x-8">
        <Link href="/" className="hover:text-gray-400">
          Homepage
        </Link>
        <Link href="/Animes" className="hover:text-gray-400">
          Animes
        </Link>
        <Link href="/Episodes" className="hover:text-gray-400">
          Episodes
        </Link>
      </nav>
      <div className="space-x-4">
        <button className="text-white hover:text-gray-400">
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button className="text-white hover:text-gray-400" onClick={() => setLogin(true)}>
          <FontAwesomeIcon icon={faUser} />
          
        </button>
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
      
          {/* Username Input */}
          <div className="bg-custom-dark rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="bg-custom-dark w-full outline-none"
            />
          </div>
      
          {/* Password Input */}
          <div className="bg-custom-dark rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="bg-custom-dark w-full outline-none"
            />
          </div>
      
          {/* Forgot Password & Register */}
          <div className="flex justify-between">
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
            >
              Login
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
          <div className="bg-custom-dark rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="bg-custom-dark w-full outline-none"
            />
          </div>
        
          {/* Email Input */}
          <div className="bg-custom-dark rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="bg-custom-dark w-full outline-none"
            />
          </div>
      
          {/* Password Input */}
          <div className="bg-custom-dark rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="bg-custom-dark w-full outline-none"
            />
          </div>
          {/* Confirmation Password Input */}
          <div className="bg-custom-dark rounded-full flex items-center gap-2 py-2 px-2 mb-4">
            <input
              id="confirmationPassword"
              type="password"
              placeholder="Confirmation Password"
              className="bg-custom-dark w-full outline-none"
            />
          </div>
      
          {/* Forgot Password & Register */}
          <div className="flex justify-between">
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
      
          {/* Login Button */}
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600"
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
