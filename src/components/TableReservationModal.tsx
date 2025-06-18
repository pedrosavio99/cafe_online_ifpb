import React, { useState } from 'react';
import Modal from './Modal';
import Spinner from './Spinner';
import ProgressBar from './ProgressBar';

interface TableReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  onAddToCart: (item: CartItem) => void;
}

interface Table {
  number: number;
  capacity: number;
  fee: number;
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  type?: 'coffee' | 'snack' | 'reservation';
}

const TableReservationModal: React.FC<TableReservationModalProps> = ({ isOpen, onClose, table, onAddToCart }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!table || !date || !time || !creditCard) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        const reservationDetails = {
          tableNumber: table.number,
          date,
          time,
          creditCard: `**** **** **** ${creditCard.slice(-4)}`,
          fee: table.fee,
        };
        localStorage.setItem(`reservation_${table.number}`, JSON.stringify(reservationDetails));
        onAddToCart({
          name: `Reserva Mesa ${table.number}`,
          price: table.fee,
          quantity: 1,
          type: 'reservation',
        });
        setIsLoading(false);
        setProgress(0);
        setDate('');
        setTime('');
        setCreditCard('');
        setError(null);
        onClose();
      }
    }, 500);
  };

  if (!table) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reservar Mesa ${table.number}`}>
      <div className="space-y-3">
        <p className="text-gray-700">Capacidade: {table.capacity} pessoas</p>
        <p className="text-red-600">
          Taxa de reserva: R${table.fee.toFixed(2)}. Será cobrada em caso de não comparecimento.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Hora</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Número do Cartão de Crédito</label>
            <input
              type="text"
              value={creditCard}
              onChange={(e) => setCreditCard(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 mt-4 text-center font-mono text-xs sm:text-sm">
              {error}
            </p>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              Confirmar Reserva
            </button>
          </div>
        </form>
        <Spinner isVisible={isLoading} />
        {isLoading && <ProgressBar progress={progress} />}
      </div>
    </Modal>
  );
};

export default TableReservationModal;