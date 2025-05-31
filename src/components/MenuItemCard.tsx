import React from 'react';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number;
  onClick: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ name, description, price, onClick }) => {
  return (
    <div
      className="bg-gray-300 p-4 rounded-md text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <h3 className="text-base font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-700 mt-1">{description}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">R$ {price.toFixed(2)}</p>
    </div>
  );
};

export default MenuItemCard;