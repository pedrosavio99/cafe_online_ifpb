import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import MenuItemCard from '../components/MenuItemCard';
import ModalLogin from '../components/ModalLogin';
import QuantityModal from '../components/QuantityModal';
import CartPanel from '../components/CartPanel';
import TableReservationModal from '../components/TableReservationModal';

interface MenuItem {
  name: string;
  description: string;
  price: number;
  type: 'coffee' | 'snack';
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  type?: 'coffee' | 'snack' | 'reservation';
}

interface Profile {
  paymentMethod: string;
  orderType: string;
}

interface Table {
  number: number;
  capacity: number;
  fee: number;
}

const LandingPage: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const [isTableReservationOpen, setIsTableReservationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Profile>({ paymentMethod: 'pix', orderType: 'retirada' });

  useEffect(() => {
    const loginData = localStorage.getItem('loginData');
    if (loginData) setIsLoggedIn(true);
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  const menuItems: MenuItem[] = [
    { name: 'Espresso', description: 'Café forte e encorpado', price: 8.0, type: 'coffee' },
    { name: 'Cappuccino', description: 'Café com leite e espuma', price: 12.0, type: 'coffee' },
    { name: 'Latte', description: 'Café suave com leite vaporizado', price: 10.0, type: 'coffee' },
    { name: 'Mocha', description: 'Café com chocolate', price: 14.0, type: 'coffee' },
    { name: 'Coxinha', description: 'Salgado frito com frango', price: 6.0, type: 'snack' },
    { name: 'Pão de Queijo', description: 'Pãozinho de queijo quentinho', price: 5.0, type: 'snack' },
  ];

  const tables: Table[] = [
    { number: 1, capacity: 4, fee: 5.0 },
    { number: 2, capacity: 2, fee: 5.0 },
    { number: 3, capacity: 6, fee: 5.0 },
  ];

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    if (isLoggedIn) {
      setIsQuantityOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    if (isLoggedIn) {
      setIsTableReservationOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleAddToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleUpdateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-gray-200 relative">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <div className='mt-[50px] w-full pt-4 mx-auto container'>
        <Slider />
      </div>

      <main className="container mx-auto p-4 relative w-full max-w-3xl sm:max-w-4xl lg:w-[95%] lg:max-w-5xl">
       
        <section className="mb-8 ">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cafés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems
              .filter((item) => item.type === 'coffee')
              .map((item, index) => (
                <MenuItemCard
                  key={index}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  onClick={() => handleItemClick(item)}
                />
              ))}
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Salgados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems
              .filter((item) => item.type === 'snack')
              .map((item, index) => (
                <MenuItemCard
                  key={index}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  onClick={() => handleItemClick(item)}
                />
              ))}
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mesas Disponíveis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <MenuItemCard
                key={table.number}
                name={`Mesa ${table.number}`}
                description={`Capacidade: ${table.capacity} pessoas`}
                price={table.fee}
                onClick={() => handleTableClick(table)}
              />
            ))}
          </div>
        </section>
      </main>
      <ModalLogin
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
      <QuantityModal
        isOpen={isQuantityOpen}
        onClose={() => setIsQuantityOpen(false)}
        item={selectedItem}
        onAddToCart={handleAddToCart}
      />
      <TableReservationModal
        isOpen={isTableReservationOpen}
        onClose={() => setIsTableReservationOpen(false)}
        table={selectedTable}
        onAddToCart={handleAddToCart}
      />
      <CartPanel
        cart={cart}
        onClearCart={handleClearCart}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setIsLoginOpen(true)}
      />
    </div>
  );
};

export default LandingPage;