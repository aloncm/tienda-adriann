import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-pink-600 px-3 py-1 rounded-full text-sm font-bold">
            Destacado
          </span>
        )}
        {product.stock < 10 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            ¡Últimos!
          </span>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-pink-600">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Stock: {product.stock}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:from-pink-600 hover:to-orange-500 transform hover:scale-105'
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}</span>
        </button>
      </div>
    </div>
  );
};