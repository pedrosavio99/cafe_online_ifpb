import React, { useState, useEffect } from 'react';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CartPanelProps {
  cart: CartItem[];
  onClearCart: () => void;
  profile: { paymentMethod: string; orderType: string };
  onUpdateProfile: (profile: { paymentMethod: string; orderType: string }) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ cart, onClearCart, profile, onUpdateProfile, isLoggedIn, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setPaymentResponse] = useState<{
    preference_id?: string;
    init_point?: string;
    external_reference?: string;
    title?: string;
    amount?: number;
    quantity?: number;
    payment_method?: string;
  }>({});
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Corrigir profile.paymentMethod quando o carrinho abrir
  useEffect(() => {
    if (isOpen) {
      console.log('Carrinho aberto, verificando profile.paymentMethod:', profile.paymentMethod);
      if (!['online', 'loja'].includes(profile.paymentMethod)) {
        console.log('profile.paymentMethod inválido, corrigindo para "online"');
        onUpdateProfile({ ...profile, paymentMethod: 'online' });
      }
    }
  }, [isOpen, profile, onUpdateProfile]);

  const handlePaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Método de pagamento alterado para:', e.target.value);
    onUpdateProfile({ ...profile, paymentMethod: e.target.value });
  };

  const handleOrderTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Tipo de pedido alterado para:', e.target.value);
    onUpdateProfile({ ...profile, orderType: e.target.value });
  };

  const handleFinalize = async () => {
    console.log('handleFinalize chamado com paymentMethod:', profile.paymentMethod);
    if (!isLoggedIn) {
      console.log('Usuário não está logado, chamando onLoginClick');
      onLoginClick();
      return;
    }

    if (profile.paymentMethod === 'online') {
      console.log('Processando pagamento online...');
      setIsLoading(true);
      const title = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
      const payload = {
        title: title || 'Produtos do Carrinho',
        price: total,
        quantity: 1,
        payment_method: 'pix',
        back_urls: {
          success: 'https://example.com/success',
          failure: 'https://example.com/failure',
          pending: 'https://example.com/pending',
        },
      };

      console.log('Payload enviado:', payload);

      try {
        const response = await fetch('https://payment-microservices-c54u.onrender.com/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log('Status da resposta da API:', response.status);

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Resposta da API:', data);

        setPaymentResponse(data);
        if (data.init_point) {
          console.log('Redirecionando para init_point:', data.init_point);
          window.location.href = data.init_point;
        } else {
          console.error('Erro: A API não retornou um init_point. Resposta:', data);
          alert('Erro: A API não retornou um link de pagamento.');
        }
      } catch (error) {
        console.error('Erro ao enviar POST:', error);
        alert('Falha ao processar o pagamento. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Processando pagamento na loja...');
      setIsLoading(true);
      try {
        onClearCart();
        alert('Pedido finalizado!');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* Ícone do Carrinho (visível quando minimizado) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-gray-800 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-gray-900 transition-all duration-300 animate-shake"
          aria-label="Abrir carrinho"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      )}
      {/* Painel do Carrinho */}
      <div
        className={`fixed top-0 right-0 h-full bg-gray-200 p-4 w-64 transform transition-transform duration-500 ease-out shadow-lg ${
          isOpen ? 'translate-x-0 animate-bounce-in' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-3 mt-[50px]">
          <h2 className="text-lg font-semibold text-gray-900">Carrinho</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-gray-900"
            aria-label="Fechar carrinho"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          {cart.length === 0 ? (
            <p className="text-sm text-gray-700">Carrinho vazio</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div key={index} className="text-sm text-gray-700">
                  <p>{item.name} (x{item.quantity})</p>
                  <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <p className="text-sm font-semibold text-gray-900 mt-2">Total: R$ {total.toFixed(2)}</p>
              <div className="space-y-2">
                <select
                  value={profile.paymentMethod}
                  onChange={handlePaymentChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded"
                >
                  <option value="online">Pagamento Online</option>
                  <option value="loja">Pagamento na Loja</option>
                </select>
                <select
                  value={profile.orderType}
                  onChange={handleOrderTypeChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded"
                >
                  <option value="retirada">Retirada na Loja</option>
                  <option value="entrega">Entrega</option>
                </select>
                <button
                  onClick={handleFinalize}
                  className={`w-full bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-900 transition-all duration-300 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Carregando...' : 'Finalizar Pedido'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPanel;