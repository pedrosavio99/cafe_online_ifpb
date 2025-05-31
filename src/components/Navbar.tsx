import React from 'react';

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  return (
    <nav className="bg-gray-900 text-white p-3 flex justify-between items-center animate-fade-in z-10 fixed top-0 left-0 w-full">
      <div className="text-lg font-semibold">Café Online</div>
      <div>
        <button onClick={onLoginClick} className="text-sm hover:text-gray-200">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;