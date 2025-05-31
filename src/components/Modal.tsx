import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in z-100">
      <div className="bg-gray-200 p-4 rounded-md max-w-sm w-full">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
        {children}
        <button onClick={onClose} className="mt-3 bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-900">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Modal;