// src/components/Header.tsx
"use client"; // This is important for client-side functionality

import React from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  const handleNavigation = (path: string, event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    router.push(path);
  };

  return (
    <header className="bg-custom-dark flex justify-between items-center px-6 py-4">
      <div className="text-3xl text-white font-bold">
        <a href="/" onClick={(event) => handleNavigation("/", event)}>Ani<span className="text-red-500">ma</span></a>
      </div>
      <nav className="text-white space-x-4">
        <a href="/" onClick={(event) => handleNavigation("/", event)} className="hover:text-gray-400">Homepage</a>
        <a href="/Animes/" className="hover:text-gray-400">Animes</a>
        <a href="/Episodes/" className="hover:text-gray-400">Episodes</a>
      </nav>
      <div className="space-x-4">
        <button className="text-white hover:text-gray-400">
          <i className="fas fa-search"></i>
        </button>
        <button className="text-white hover:text-gray-400">
          <i className="fas fa-user"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
