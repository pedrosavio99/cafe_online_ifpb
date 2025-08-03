import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Importar useLocation
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
  imageUrl?: string;
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  type?: 'coffee' | 'snack' | 'reservation';
  imageUrl?: string;
}

interface Profile {
  paymentMethod: string;
  orderType: string;
}

interface Table {
  number: number;
  capacity: number;
  fee: number;
  imageUrl?: string;
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
  const location = useLocation(); // Hook para obter a rota atual

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
    { name: 'Espresso', description: 'Café forte e encorpado', price: 8.0, type: 'coffee', imageUrl: 'https://loucodocafe.com.br/wp-content/uploads/2016/11/Caf%C3%A9-espresso.jpg' },
    { name: 'Cappuccino', description: 'Café com leite e espuma', price: 12.0, type: 'coffee', imageUrl: 'https://blog.cybercook.com.br/wp-content/uploads/2022/07/capuccino-caseiro-suavizando-e-saborizando-o-seu-cafe.jpg' },
    { name: 'Latte', description: 'Café suave com leite vaporizado', price: 10.0, type: 'coffee', imageUrl: 'https://uniquecafes.com.br/wp-content/uploads/2021/08/Destaque-cafe-Latte.jpg' },
    { name: 'Mocha', description: 'Café com chocolate', price: 14.0, type: 'coffee', imageUrl: 'https://recursos.puravida.com.br/i/receitas/lp-mochea-coffee-foto-desk.jpg' },
    { name: 'Coxinha', description: 'Salgado frito com frango', price: 6.0, type: 'snack', imageUrl: 'https://guiadacozinha.com.br/wp-content/uploads/2018/08/coxinhadefrangocremosa.webp' },
    { name: 'Pão de Queijo', description: 'Pãozinho de queijo quentinho', price: 5.0, type: 'snack', imageUrl: 'https://togocongelados.com.br/wp-content/uploads/2022/05/pao-de-queijo.png' },
  ];

  const tables: Table[] = [
    { number: 1, capacity: 4, fee: 5.0, imageUrl: 'https://servircomrequinte.francobachot.com.br/wp-content/uploads/2021/07/post_thumbnail-8b950c0bb89fd9f5c0c7c0b5e0b02df6.jpg' },
    { number: 2, capacity: 2, fee: 5.0, imageUrl: 'https://servircomrequinte.francobachot.com.br/wp-content/uploads/2021/07/post_thumbnail-8b950c0bb89fd9f5c0c7c0b5e0b02df6.jpg' },
    { number: 3, capacity: 6, fee: 5.0, imageUrl: 'https://servircomrequinte.francobachot.com.br/wp-content/uploads/2021/07/post_thumbnail-8b950c0bb89fd9f5c0c7c0b5e0b02df6.jpg' },
  ];

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    // Verificar se o usuário está logado e na rota /user
    const isInUserRoute = location.pathname.includes('/user');
    if (isLoggedIn && isInUserRoute) {
      setIsQuantityOpen(true);
    } else {
      console.log('Usuário não está logado ou não está na rota /user, abrindo modal de login');
      setIsLoginOpen(true);
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    // Verificar se o usuário está logado e na rota /user
    const isInUserRoute = location.pathname.includes('/user');
    if (isLoggedIn && isInUserRoute) {
      setIsTableReservationOpen(true);
    } else {
      console.log('Usuário não está logado ou não está na rota /user, abrindo modal de login');
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
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cafés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems
              .filter((item) => item.type === 'coffee')
              .map((item, index) => (
                <MenuItemCard
                  imageUrl={item.imageUrl || 'https://via.placeholder.com/150'}
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
                  imageUrl={item.imageUrl || 'https://via.placeholder.com/150'}
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
                imageUrl={table.imageUrl || 'https://via.placeholder.com/150'}
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