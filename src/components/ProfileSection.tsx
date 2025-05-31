import React, { useState } from 'react';

interface Order {
  id: number;
  item: string;
  status: string;
}

interface Profile {
  paymentMethod: string;
  orderType: string;
  deliveryAddress?: string;
}

interface ProfileSectionProps {
  profile: Profile;
  orders: Order[];
  onUpdateProfile: (newProfile: Profile) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, orders, onUpdateProfile }) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(profile.deliveryAddress || '');

  const handleSaveAddress = () => {
    onUpdateProfile({ ...profile, deliveryAddress: newAddress });
    setIsEditingAddress(false);
  };

  return (
    <section className="bg-gray-300 p-4 rounded-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Perfil</h2>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Endereço de Entrega</h3>
        <p className="text-sm text-gray-700 mb-2">
          {profile.deliveryAddress || 'Nenhum endereço cadastrado'}
        </p>
        {isEditingAddress ? (
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Digite o novo endereço"
              className="p-2 border border-gray-400 rounded-md bg-white text-gray-900"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveAddress}
                className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setIsEditingAddress(false);
                  setNewAddress(profile.deliveryAddress || '');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingAddress(true)}
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Editar Endereço
          </button>
        )}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">Meus Pedidos</h3>
      <table className="w-full text-sm text-gray-700">
        <thead>
          <tr className="bg-gray-400">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-400">
              <td className="p-2">{order.id}</td>
              <td className="p-2">{order.item}</td>
              <td className="p-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ProfileSection;