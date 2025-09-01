import React from 'react';
import { ShoppingCart, Candy, User, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange, 
  searchTerm, 
  onSearchChange 
}) => {
  const { getCartItemsCount } = useStore();
  const cartCount = getCartItemsCount();

  return (
    <header className="bg-gradient-to-r from-pink-500 to-orange-400 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Candy className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Dulce Paraíso</h1>
          </div>
          
          {currentView === 'catalog' && (
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar dulces..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border-0 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                />
              </div>
            </div>
          )}

          <nav className="flex items-center space-x-4">
            <button
              onClick={() => onViewChange('catalog')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'catalog'
                  ? 'bg-white text-pink-500 font-semibold'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              Catálogo
            </button>
            
            <button
              onClick={() => onViewChange('cart')}
              className={`relative px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                currentView === 'cart'
                  ? 'bg-white text-pink-500 font-semibold'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Carrito</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-pink-600 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('admin')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                currentView === 'admin'
                  ? 'bg-white text-pink-500 font-semibold'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Admin</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};