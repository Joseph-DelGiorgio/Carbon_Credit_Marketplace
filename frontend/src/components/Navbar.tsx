import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ConnectButton } from '@mysten/dapp-kit';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <Link to="/" className="text-2xl font-bold text-green-700 tracking-tight">Carbon Marketplace</Link>
      <div className="space-x-6 hidden md:flex">
        <NavLink to="/" className={({ isActive }) => isActive ? 'text-green-700 font-semibold' : 'text-gray-700 hover:text-green-700'}>Marketplace</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-green-700 font-semibold' : 'text-gray-700 hover:text-green-700'}>Dashboard</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'text-green-700 font-semibold' : 'text-gray-700 hover:text-green-700'}>About</NavLink>
      </div>
      <div className="flex items-center space-x-4">
        <ConnectButton />
      </div>
      {/* Mobile menu placeholder */}
      <div className="md:hidden">
        <button className="text-green-700 focus:outline-none">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 