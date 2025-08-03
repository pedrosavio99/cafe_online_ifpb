import React, { useState, useEffect } from 'react';

// URL da API configurável para testes
const API_ORDERS_URL = 'https://server-cafe-ifpb.onrender.com/api/pedidos/email/';

interface CartItem {
  nome: string;
  preco: number;
  quantidade: number;
  _id: string;
}

interface Address {
  rua: string;
  numero: string;
}

interface Order {
  _id: string;
  email: string;
  cartItems: CartItem[];
  valor: number;
  status: string;
  paymentMethod: string;
  orderType: string;
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

interface Profile {
  paymentMethod: string;
  orderType: string;
  deliveryAddress?: string;
}

interface ProfileSectionProps {
  profile: Profile;
  onUpdateProfile: (newProfile: Profile) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onUpdateProfile }) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState<Address>({
    rua: '',
    numero: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar endereço do localStorage ao iniciar
  useEffect(() => {
    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedAddress) {
      const [rua, numero] = savedAddress.split(', Nº ');
      setAddress({ rua: rua || '', numero: numero || '' });
    }
  }, []);

  // Função para buscar pedidos
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = user.email || 'pokemonpedro88@gmail.com';
      const response = await fetch(`${API_ORDERS_URL}${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // Normalizar dados do endereço para compatibilidade
      const normalizedOrders = data.map((order: Order) => {
        if (order.orderType === 'entrega' && order.address) {
          if (order.address.rua && order.address.rua.includes(',')) {
            const [rua, numero] = order.address.rua.split(', ');
            return {
              ...order,
              address: { rua, numero: numero || '' },
            };
          }
          type AddressWithCidadeEstado = { cidade: string; estado: string };
          const isAddressWithCidadeEstado = (
            addr: Address | AddressWithCidadeEstado
          ): addr is AddressWithCidadeEstado =>
            typeof (addr as AddressWithCidadeEstado).cidade === 'string' &&
            typeof (addr as AddressWithCidadeEstado).estado === 'string';

          if (!order.address.rua && isAddressWithCidadeEstado(order.address)) {
            return {
              ...order,
              address: {
                rua: order.address.cidade || '',
                numero: order.address.estado.replace('Nº ', '') || '',
              },
            };
          }
          return { ...order, address: undefined };
        }
        return { ...order, address: undefined };
      });
      setOrders(normalizedOrders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar pedidos ao carregar o componente
  useEffect(() => {
    fetchOrders();
  }, []);

  // Função para cancelar pedido
  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`https://server-cafe-ifpb.onrender.com/api/pedidos/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejeitado' }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao cancelar pedido: ${response.status} ${response.statusText}`);
      }

      // Recarregar pedidos após cancelamento
      await fetchOrders();
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      setError('Falha ao cancelar o pedido. Tente novamente.');
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSaveAddress = () => {
    if (!address.rua.trim() || !address.numero.trim()) {
      setError('Por favor, preencha both rua e número.');
      return;
    }

    const fullAddress = `${address.rua}, Nº ${address.numero}`;
    localStorage.setItem('deliveryAddress', fullAddress);
    onUpdateProfile({ ...profile, deliveryAddress: fullAddress });
    setIsEditingAddress(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <section className="bg-gray-200 p-4 sm:p-6 max-w-full mx-auto">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Perfil</h2>
      <div className="mb-6 sm:mb-8">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Endereço de Entrega</h3>
        <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
            />
          </svg>
          {address.rua && address.numero
            ? `${address.rua}, Nº ${address.numero}`
            : 'Nenhum endereço cadastrado'}
        </p>
        {isEditingAddress ? (
          <div className="flex flex-col space-y-2 sm:space-y-3">
            <input
              type="text"
              name="rua"
              value={address.rua}
              onChange={handleAddressChange}
              placeholder="Rua"
              className="p-2 text-xs sm:text-sm border border-gray-400 rounded-md bg-white text-gray-900"
            />
            <input
              type="text"
              name="numero"
              value={address.numero}
              onChange={handleAddressChange}
              placeholder="Número"
              className="p-2 text-xs sm:text-sm border border-gray-400 rounded-md bg-white text-gray-900"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex space-x-2">
              <button
                onClick={handleSaveAddress}
                className="bg-gray-900 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-gray-800 transition-all"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setIsEditingAddress(false);
                  const savedAddress = localStorage.getItem('deliveryAddress');
                  if (savedAddress) {
                    const [rua, numero] = savedAddress.split(', Nº ');
                    setAddress({ rua: rua || '', numero: numero || '' });
                  } else {
                    setAddress({ rua: '', numero: '' });
                  }
                  setError(null);
                }}
                className="bg-gray-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-gray-600 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingAddress(true)}
            className="bg-gray-900 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-gray-800 transition-all"
          >
            Editar Endereço
          </button>
        )}
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Meus Pedidos</h3>
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <svg
            className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-xs sm:text-sm text-gray-700">Carregando...</p>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-xs sm:text-sm text-gray-700">Nenhum pedido encontrado</p>
      ) : (
        <div className="flex flex-col space-y-3">
          {orders.slice().reverse().map((order) => (
            <div
              key={order._id}
              className="relative bg-gray-100 p-3 sm:p-4 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition-all duration-300 animate-bounce-in"
            >
              {/* Botão flutuante de cancelar */}
              {order.status === 'pendente' && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Cancelar Pedido"
                >
                  Cancelar
                </button>
              )}
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Pedido #{order._id.slice(-6)}
              </h4>
              <div className="text-xs sm:text-sm text-gray-700 space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold w-full sm:w-1/3">Itens:</span>
                  <ul className="list-disc pl-5 w-full sm:w-2/3">
                    {order.cartItems.map((item) => (
                      <li key={item._id}>
                        {item.nome} (x{item.quantidade}) - R$ {item.preco.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold w-full sm:w-1/3">Valor Total:</span>
                  <span className="w-full sm:w-2/3">R$ {order.valor.toFixed(2)}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="font-semibold w-full sm:w-1/3">Status:</span>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      order.status === 'pendente'
                        ? 'bg-blue-500 text-white'
                        : order.status === 'rejeitado'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold w-full sm:w-1/3">Pagamento:</span>
                  <span className="w-full sm:w-2/3">{order.paymentMethod === 'loja' ? 'Na Loja' : 'Online'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold w-full sm:w-1/3">Tipo:</span>
                  <span className="w-full sm:w-2/3">{order.orderType === 'entrega' ? 'Entrega' : 'Retirada'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold w-full sm:w-1/3">Endereço:</span>
                  <span className="w-full sm:w-2/3">
                    {order.orderType === 'entrega' && order.address && order.address.rua && order.address.numero
                      ? `${order.address.rua}, Nº ${order.address.numero}`
                      : 'Retirada na loja'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold w-full sm:w-1/3">Criado:</span>
                  <span className="w-full sm:w-2/3">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold w-full sm:w-1/3">Atualizado:</span>
                  <span className="w-full sm:w-2/3">{formatDate(order.updatedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProfileSection;