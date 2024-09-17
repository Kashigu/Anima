// src/components/Header.tsx
"use client"; // This is important for client-side functionality

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

function Header() {
  return (
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
        <button className="text-white hover:text-gray-400">
          <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
    </header>
  );
};

export default Header;
