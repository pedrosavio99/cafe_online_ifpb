import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin as GoogleLoginComponent } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import Modal from './Modal';
import Spinner from './Spinner';
import ProgressBar from './ProgressBar';

const GOOGLE_CLIENT_ID = "658459802459-ianqoohmua6esrb1tmjkg6p3u643jtei.apps.googleusercontent.com";

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuthState {
  user: Record<string, unknown> | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  progress: number;
}

type AuthAction =
  | { type: 'SET_USER'; payload: Record<string, unknown> }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: number };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
        isLoading: false,
        progress: 0,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, progress: 0 };
    case 'LOGOUT':
      localStorage.removeItem('user');
      return { user: null, isAuthenticated: false, error: null, isLoading: false, progress: 0 };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    default:
      return state;
  }
};

const ModalLogin: React.FC<ModalLoginProps> = ({ isOpen, onClose }) => {
  const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!JSON.parse(localStorage.getItem('user') || 'null'),
    error: null,
    isLoading: false,
    progress: 0,
  };

  const [authState, authDispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Function to decode JWT token (client-side)
  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login">
      <div className="space-y-3">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLoginComponent
            onSuccess={(credentialResponse: CredentialResponse) => {
              authDispatch({ type: 'SET_LOADING', payload: true });
              let currentProgress = 0;
              const interval = setInterval(() => {
                currentProgress += 10;
                authDispatch({ type: 'SET_PROGRESS', payload: currentProgress });
                if (currentProgress >= 100) {
                  clearInterval(interval);
                  const token = credentialResponse.credential;
                  if (token) {
                    const decoded = decodeJwt(token);
                    if (decoded) {
                      const userData = {
                        email: decoded.email,
                        name: decoded.name,
                        picture: decoded.picture,
                        sub: decoded.sub,
                      };
                      authDispatch({ type: 'SET_USER', payload: userData });
                      localStorage.setItem('user', JSON.stringify(userData));
                      if (decoded.email === 'pedro.sarmento@academico.ifpb.edu.br') {
                        navigate('/admin');
                      } else {
                        navigate('/user');
                      }
                    } else {
                      authDispatch({ type: 'SET_ERROR', payload: 'Erro ao decodificar dados do Google' });
                    }
                  } else {
                    authDispatch({ type: 'SET_ERROR', payload: 'Credenciais do Google inválidas' });
                  }
                  onClose();
                }
              }, 500);
            }}
            onError={() => {
              authDispatch({ type: 'SET_ERROR', payload: 'Erro ao fazer login com Google' });
            }}
          />
        </GoogleOAuthProvider>
        {authState.error && (
          <p className="text-red-500 mt-4 text-center font-mono text-xs sm:text-sm">
            {authState.error}
          </p>
        )}
        <Spinner isVisible={authState.isLoading} />
        {authState.isLoading && <ProgressBar progress={authState.progress} />}
      </div>
    </Modal>
  );
};

export default ModalLogin;