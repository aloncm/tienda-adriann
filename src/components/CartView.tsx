import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CheckoutModal } from './CheckoutModal';

export const CartView: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useStore();
  const [showCheckout, setShowCheckout] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-600 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-8">¡Agrega algunos dulces deliciosos para empezar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6" />
            <span>Tu Carrito de Dulces</span>
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm">{item.product.description}</p>
                  <p className="text-pink-600 font-bold">${item.product.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700 transition-colors mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold text-gray-800">Total:</span>
              <span className="text-3xl font-bold text-pink-600">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={clearCart}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Limpiar Carrito
              </button>
              
              <button
                onClick={() => setShowCheckout(true)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Proceder al Pago</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};