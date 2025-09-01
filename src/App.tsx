import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { CatalogView } from './components/CatalogView';
import { CartView } from './components/CartView';
import { AdminView } from './components/AdminView';

function App() {
  const [currentView, setCurrentView] = useState<'catalog' | 'cart' | 'admin'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'catalog':
        return <CatalogView searchTerm={searchTerm} />;
      case 'cart':
        return <CartView />;
      case 'admin':
        return <AdminView />;
      default:
        return <CatalogView searchTerm={searchTerm} />;
    }
  };

  return (
    <StoreProvider>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
        <Header
          currentView={currentView}
          onViewChange={setCurrentView}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <main>
          {renderCurrentView()}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Dulce Paraíso</h3>
            <p className="text-gray-300 mb-4">
              Los dulces más deliciosos al mejor precio, entregados con amor
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>📧 info@dulceparaiso.com</span>
              <span>📞 (555) 123-4567</span>
              <span>📍 Ciudad de México</span>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              © 2025 Dulce Paraíso. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </StoreProvider>
  );
}

export default App;