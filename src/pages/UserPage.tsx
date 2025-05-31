import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from '../components/Slider';
import MenuItemCard from '../components/MenuItemCard';
import ModalLogin from '../components/ModalLogin';
import ModalRegister from '../components/ModalRegister';
import QuantityModal from '../components/QuantityModal';
import CartPanel from '../components/CartPanel';
import ProfileSection from '../components/ProfileSection';

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
}

interface Profile {
  paymentMethod: string;
  orderType: string;
  deliveryAddress?: string;
}

interface Order {
  id: number;
  item: string;
  status: string;
}

const UserPage: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Profile>({ paymentMethod: 'pix', orderType: 'retirada', deliveryAddress: '' });
  const [orders] = useState<Order[]>([
    { id: 1, item: 'Café Espresso', status: 'Pendente' },
    { id: 2, item: 'Cappuccino', status: 'Aprovado' },
  ]);
  const [showProfile, setShowProfile] = useState(false);

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

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    if (isLoggedIn) {
      setIsQuantityOpen(true);
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
      <nav className="z-10 fixed w-full bg-gray-900 text-white p-3 flex justify-between items-center">
        <div className="text-lg font-semibold">Café Online - Usuário</div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="text-sm hover:text-gray-200"
          >
            {showProfile ? 'Voltar ao Cardápio' : 'Perfil'}
          </button>
          <Link to="/" className="text-sm hover:text-gray-200">Voltar</Link>
        </div>
      </nav>
      <main className="container mx-auto p-4 pt-[70px]">
        {showProfile ? (
          <ProfileSection profile={profile} orders={orders} onUpdateProfile={handleUpdateProfile} />
        ) : (
          <>
            <Slider />
            <h1 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Cardápio Café Online
            </h1>
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cafés</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
          </>
        )}
      </main>
      <ModalLogin
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onRegisterClick={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <ModalRegister
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onLoginClick={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
      <QuantityModal
        isOpen={isQuantityOpen}
        onClose={() => setIsQuantityOpen(false)}
        item={selectedItem}
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

export default UserPage;