import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ConnectButton } from '@mysten/dapp-kit';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow">
      <div className="font-bold text-xl tracking-tight">Carbon Credit Marketplace</div>
      <div className="flex gap-6">
        <a href="/" className="hover:underline">Marketplace</a>
        <a href="#" className="hover:underline">My Credits</a>
        <a href="#" className="hover:underline">About</a>
      </div>
    </nav>
  );
};

export default Navbar; 