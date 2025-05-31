import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Spinner from './Spinner';
import ProgressBar from './ProgressBar';

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

const ModalLogin: React.FC<ModalLoginProps> = ({ isOpen, onClose, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoading(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsLoading(false);
        setProgress(0);
        localStorage.setItem('loginData', JSON.stringify({ email, password }));
        if (email.toLowerCase() === 'adm') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
        onClose();
      }
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login">
      <div className="space-y-3">
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
          onClick={handleLogin}
          className="w-full bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-900"
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Entrar'}
        </button>
        <button
          onClick={onRegisterClick}
          className="w-full bg-gray-600 text-white px-3 py-1 text-sm rounded hover:bg-gray-700"
        >
          Criar Conta
        </button>
        <Spinner isVisible={isLoading} />
        {isLoading && <ProgressBar progress={progress} />}
      </div>
    </Modal>
  );
};

export default ModalLogin;