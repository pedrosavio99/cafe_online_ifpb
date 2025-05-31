import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

interface Order {
  id: number;
  customer: string;
  item: string;
  status: string;
}

interface OrderActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const OrderActionModal: React.FC<OrderActionModalProps> = ({ isOpen, onClose, order, onApprove, onReject }) => {
  if (!order) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Pedido #${order.id}`}>
      <div className="space-y-3 text-sm text-gray-700">
        <p><strong>Cliente:</strong> {order.customer}</p>
        <p><strong>Item:</strong> {order.item}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <div className="flex space-x-3">
          <button
            onClick={() => onApprove(order.id)}
            className="w-full bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-900"
            disabled={order.status !== 'Pendente'}
          >
            Aprovar
          </button>
          <button
            onClick={() => onReject(order.id)}
            className="w-full bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-900"
            disabled={order.status !== 'Pendente'}
          >
            Rejeitar
          </button>
        </div>
      </div>
    </Modal>
  );
};

const AdminPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, customer: 'João', item: 'Café Espresso', status: 'Pendente' },
    { id: 2, customer: 'Maria', item: 'Cappuccino', status: 'Pendente' },
  ]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleApprove = (id: number) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: 'Aprovado' } : order
    ));
    setSelectedOrder(null);
  };

  const handleReject = (id: number) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: 'Rejeitado' } : order
    ));
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <nav className="bg-gray-900 text-white p-3 flex justify-between items-center animate-fade-in">
        <div className="text-lg font-semibold">Café Online - Admin</div>
        <Link to="/" className="text-sm hover:text-gray-200">Voltar</Link>
      </nav>
      <main className="container mx-auto p-4">
        <h1 className="text-xl font-semibold text-gray-900 text-center mb-6 animate-fade-in">
          Gerenciamento de Pedidos
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-gray-300 p-4 rounded-md cursor-pointer hover:bg-gray-400 animate-fade-in"
              onClick={() => setSelectedOrder(order)}
            >
              <h3 className="text-base font-semibold text-gray-900">Pedido #{order.id}</h3>
              <p className="text-sm text-gray-700 mt-1"><strong>Cliente:</strong> {order.customer}</p>
              <p className="text-sm text-gray-700 mt-1"><strong>Item:</strong> {order.item}</p>
              <p className="text-sm text-gray-700 mt-1"><strong>Status:</strong> {order.status}</p>
            </div>
          ))}
        </div>
        <OrderActionModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </main>
    </div>
  );
};

export default AdminPage;