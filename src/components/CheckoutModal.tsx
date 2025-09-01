import React, { useState } from 'react';
import { X, CreditCard, MapPin, User, Mail, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, getCartTotal, clearCart, addOrder } = useStore();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));

    const order: Order = {
      id: `order-${Date.now()}`,
      items: [...cart],
      total: getCartTotal(),
      customerInfo,
      status: 'completed',
      createdAt: new Date()
    };

    addOrder(order);
    clearCart();
    setIsProcessing(false);
    setOrderCompleted(true);
  };

  if (orderCompleted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-4">¡Pedido Confirmado!</h3>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación pronto.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-orange-500 transition-all"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Finalizar Compra</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Resumen del pedido */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Resumen del Pedido</h4>
            <div className="bg-gray-50 rounded-xl p-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between items-center py-2">
                  <span className="text-gray-700">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-xl font-bold text-pink-600">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información del cliente */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Información de Contacto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Dirección
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Método de Pago</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'card' 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-pink-500" />
                  <span className="font-semibold">Tarjeta de Crédito/Débito</span>
                </div>
              </label>
              
              <label className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'cash' 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 text-green-500">💵</div>
                  <span className="font-semibold">Pago en Efectivo</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isProcessing}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                isProcessing
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:from-pink-600 hover:to-orange-500 transform hover:scale-105'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Confirmar Pedido (${getCartTotal().toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};