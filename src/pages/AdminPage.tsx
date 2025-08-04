import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

// Constante para a URL da API
const API_BASE_URL = 'https://server-cafe-ifpb.onrender.com/api/pedidos';

// Interface para o endereço
interface Address {
  rua: string;
  cidade: string;
  estado: string;
  cep: string;
}

// Interface para os itens do carrinho
interface CartItem {
  _id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

// Interface para o pedido
interface Order {
  _id: string;
  email: string;
  address: Address;
  cartItems: CartItem[];
  valor: number;
  status: string;
  paymentMethod: string;
  orderType: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para as propriedades do modal
interface OrderActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onFinalize: (id: string) => void;
}

// Componente do Modal de Ações do Pedido
const OrderActionModal: React.FC<OrderActionModalProps> = ({ isOpen, onClose, order, onApprove, onReject, onFinalize }) => {
  if (!order) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Pedido #${order._id.slice(-6)}`}>
      <div className="space-y-4 text-sm text-gray-700 px-4 sm:px-6">
        <p><strong>Cliente:</strong> {order.email}</p>
        <p><strong>Endereço:</strong> {order.address.cidade}, {order.address.estado}</p>
        <p><strong>Tipo de Pedido:</strong> {order.orderType}</p>
        <p><strong>Método de Pagamento:</strong> {order.paymentMethod}</p>
        <p><strong>Valor Total:</strong> R${order.valor.toFixed(2)}</p>
        <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Itens:</strong></p>
        <ul className="list-disc pl-5">
          {order.cartItems.map(item => (
            <li key={item._id}>
              {item.nome} - {item.quantidade}x (R${item.preco.toFixed(2)})
            </li>
          ))}
        </ul>
        <p><strong>Status:</strong> {order.status}</p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => onApprove(order._id)}
            className="w-full bg-green-600 text-white px-3 py-2 text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
            disabled={order.status !== 'pendente'}
          >
            Aprovar
          </button>
          <button
            onClick={() => onReject(order._id)}
            className="w-full bg-red-600 text-white px-3 py-2 text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
            disabled={order.status !== 'pendente'}
          >
            Rejeitar
          </button>
          <button
            onClick={() => onFinalize(order._id)}
            className="w-full bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={order.status !== 'aprovado'}
          >
            Finalizar
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Componente Principal da Página de Administração
const AdminPage: React.FC = () => {
  const [pendenteOrders, setPendenteOrders] = useState<Order[]>([]);
  const [aprovadoOrders, setAprovadoOrders] = useState<Order[]>([]);
  const [rejeitadoOrders, setRejeitadoOrders] = useState<Order[]>([]);
  const [finalizadoOrders, setFinalizadoOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>('pendente');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const [pollingTimeout, setPollingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Função para verificar se há mudanças nos pedidos
  const hasOrdersChanged = (currentOrders: Order[], newOrders: Order[]): boolean => {
    if (currentOrders.length !== newOrders.length) return true;

    const currentOrderMap = new Map(currentOrders.map(order => [order._id, order.updatedAt]));
    for (const newOrder of newOrders) {
      const currentUpdatedAt = currentOrderMap.get(newOrder._id);
      if (!currentUpdatedAt || currentUpdatedAt !== newOrder.updatedAt) {
        return true;
      }
    }
    return false;
  };

  // Função para buscar pedidos de um status específico
  const fetchOrders = async (status: string): Promise<Order[] | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/status/${status}`);
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      const data: Order[] = await response.json();
      return data;
    } catch (err) {
      setError(`Erro ao carregar pedidos (${status})`);
      console.error(err);
      return null;
    }
  };

  // Função para buscar pedidos de todos os status
  const fetchAllOrders = async (showLoading: boolean = false) => {
    if (showLoading) {
      setLoading(true);
    }
    const statuses = ['pendente', 'aprovado', 'rejeitado', 'finalizado'];
    const results = await Promise.all(statuses.map(status => fetchOrders(status)));

    let hasAnyChange = false;
    results.forEach((data, index) => {
      if (data) {
        const status = statuses[index];
        if (status === 'pendente') {
          setPendenteOrders(current => {
            const changed = hasOrdersChanged(current, data);
            if (changed) hasAnyChange = true;
            return changed ? data : current;
          });
        } else if (status === 'aprovado') {
          setAprovadoOrders(current => {
            const changed = hasOrdersChanged(current, data);
            if (changed) hasAnyChange = true;
            return changed ? data : current;
          });
        } else if (status === 'rejeitado') {
          setRejeitadoOrders(current => {
            const changed = hasOrdersChanged(current, data);
            if (changed) hasAnyChange = true;
            return changed ? data : current;
          });
        } else if (status === 'finalizado') {
          setFinalizadoOrders(current => {
            const changed = hasOrdersChanged(current, data);
            if (changed) hasAnyChange = true;
            return changed ? data : current;
          });
        }
      }
    });

    if (showLoading || hasAnyChange) {
      setLoading(false);
    }
  };

  // Função para iniciar o polling
  const startPolling = () => {
    setIsPolling(true);
    fetchAllOrders(true); // Mostra loading na primeira busca
    const interval = setInterval(() => {
      fetchAllOrders(false); // Não mostra loading nas buscas do polling
    }, 6000); // 4 segundos

    // Para o polling após 2 minutos (120000ms)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsPolling(false);
      setLoading(false);
    }, 120000);

    setPollingTimeout(timeout);
  };

  // Inicia o polling ao carregar a página
  useEffect(() => {
    startPolling();
    // Limpa o intervalo e o timeout ao desmontar o componente
    return () => {
      if (pollingTimeout) {
        clearTimeout(pollingTimeout);
      }
    };
  }, []);

  // Função para aprovar pedido
  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'aprovado' }),
      });
      if (!response.ok) {
        throw new Error('Erro ao aprovar pedido');
      }
      await fetchAllOrders(true); // Mostra loading após ação
      setSelectedOrder(null);
    } catch (err) {
      setError('Erro ao aprovar pedido');
      console.error(err);
      setLoading(false);
    }
  };

  // Função para rejeitar pedido
  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejeitado' }),
      });
      if (!response.ok) {
        throw new Error('Erro ao rejeitar pedido');
      }
      await fetchAllOrders(true); // Mostra loading após ação
      setSelectedOrder(null);
    } catch (err) {
      setError('Erro ao rejeitar pedido');
      console.error(err);
      setLoading(false);
    }
  };

  // Função para finalizar pedido
  const handleFinalize = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'finalizado' }),
      });
      if (!response.ok) {
        throw new Error('Erro ao finalizar pedido');
      }
      await fetchAllOrders(true); // Mostra loading após ação
      setSelectedOrder(null);
    } catch (err) {
      setError('Erro ao finalizar pedido');
      console.error(err);
      setLoading(false);
    }
  };

  // Selecionar a lista de pedidos com base no filtro
  const getCurrentOrders = () => {
    switch (filter) {
      case 'pendente':
        return pendenteOrders;
      case 'aprovado':
        return aprovadoOrders;
      case 'rejeitado':
        return rejeitadoOrders;
      case 'finalizado':
        return finalizadoOrders;
      default:
        return pendenteOrders;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white p-4 flex flex-col sm:flex-row justify-between items-center animate-fade-in">
        <div className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">Café Online - Admin</div>
        <Link to="/" className="text-sm hover:text-gray-200">Voltar</Link>
      </nav>
      <main className="container mx-auto px-4 sm:px-6 py-6 relative">
        {/* Botão flutuante para reiniciar polling */}
        {!isPolling && (
          <button
            onClick={startPolling}
            className="fixed top-16 right-4 sm:right-6 bg-blue-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-700 z-10 text-sm sm:text-base"
          >
            Iniciar Polling
          </button>
        )}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-6 sm:mb-8 animate-fade-in">
          Gerenciamento de Pedidos
        </h1>
        {/* Filtros de Status */}
        <div className="flex flex-wrap justify-center mb-6 gap-2 sm:gap-3">
          {['pendente', 'aprovado', 'rejeitado', 'finalizado'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                filter === status
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        {loading && <p className="text-center text-gray-600">Carregando...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {getCurrentOrders().map(order => (
            <div
              key={order._id}
              className="bg-white p-4 sm:p-5 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 animate-fade-in"
              onClick={() => setSelectedOrder(order)}
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Pedido #{order._id.slice(-6)}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2"><strong>Cliente:</strong> {order.email}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1"><strong>Endereço:</strong> {order.address.cidade}, {order.address.estado}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1"><strong>Valor:</strong> R${order.valor.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1"><strong>Itens:</strong> {order.cartItems.map(item => item.nome).join(', ')}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1"><strong>Status:</strong> {order.status}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1"><strong>Data:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <OrderActionModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          onApprove={handleApprove}
          onReject={handleReject}
          onFinalize={handleFinalize}
        />
      </main>
    </div>
  );
};

export default AdminPage;