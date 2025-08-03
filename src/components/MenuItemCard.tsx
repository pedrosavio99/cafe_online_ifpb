import React from 'react';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Novo campo para a URL da imagem
  onClick: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ name, description, price, imageUrl, onClick }) => {
  return (
    <div
      className="bg-gray-300 p-4 rounded-md flex items-center gap-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      {/* Imagem à esquerda */}
      <div className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={`Imagem de ${name}`}
          className="w-16 h-16 object-cover rounded-md"
          loading="lazy"
        />
      </div>
      {/* Conteúdo do card */}
      <div className="flex-1 text-left">
        <h3 className="text-base font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-700 mt-1">{description}</p>
        <p className="text-sm font-semibold text-gray-900 mt-1">R$ {price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MenuItemCard;