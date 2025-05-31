import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

interface ModalRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const ModalRegister: React.FC<ModalRegisterProps> = ({ isOpen, onClose, onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    localStorage.setItem('registerData', JSON.stringify({ name, email, password }));
    localStorage.setItem('loginData', JSON.stringify({ email, password }));
    navigate('/');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar">
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 rounded"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-900"
        >
          Registrar
        </button>
        <button
          onClick={onLoginClick}
          className="w-full bg-gray-600 text-white px-3 py-1 text-sm rounded hover:bg-gray-700"
        >
          Já tem conta?
        </button>
      </div>
    </Modal>
  );
};

export default ModalRegister;