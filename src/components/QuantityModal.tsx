import React, { useState } from 'react';
import Modal from './Modal';

interface QuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: { name: string; price: number } | null;
  onAddToCart: (item: { name: string; price: number; quantity: number }) => void;
}

const QuantityModal: React.FC<QuantityModalProps> = ({ isOpen, onClose, item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const handleAdd = () => {
    onAddToCart({ name: item.name, price: item.price, quantity });
    setQuantity(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adicionar ${item.name}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-700">Quantidade:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 p-2 text-sm border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handleAdd}
          className="w-full bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-900"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </Modal>
  );
};

export default QuantityModal;