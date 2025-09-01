import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, BarChart3, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ProductForm } from './ProductForm';

export const AdminView: React.FC = () => {
  const { products, setProducts, orders } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // Simple authentication (en producción usarías un sistema más seguro)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'dulces123') {
      setIsAuthenticated(true);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      // Actualizar producto existente
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...productData, id: editingProduct.id }
          : p
      ));
    } else {
      // Crear nuevo producto
      const newProduct: Product = {
        ...productData,
        id: `product-${Date.now()}`
      };
      setProducts([...products, newProduct]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <Package className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Panel de Administración</h2>
            <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="admin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="dulces123"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-orange-500 transition-all"
            >
              Iniciar Sesión
            </button>
          </form>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Demo: admin / dulces123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Package className="h-6 w-6" />
              <span>Panel de Administración</span>
            </h2>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'products'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Productos ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'orders'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pedidos ({orders.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-semibold">Gestión de Productos</h3>
                  <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                    {products.length} productos
                  </span>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-500 transition-all flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Agregar Producto</span>
                </button>
              </div>

              <div className="grid gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-gray-50 rounded-xl p-4 flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        {product.featured && (
                          <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs font-medium">
                            Destacado
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{product.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-pink-600 font-bold">${product.price.toFixed(2)}</span>
                        <span className="text-gray-500">Stock: {product.stock}</span>
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <h3 className="text-xl font-semibold">Pedidos Recientes</h3>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  {orders.length} pedidos
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay pedidos aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.reverse().map(order => (
                    <div key={order.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-800">Pedido #{order.id.slice(-8)}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-pink-600">${order.total.toFixed(2)}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-600' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {order.status === 'completed' ? 'Completado' : 
                             order.status === 'processing' ? 'Procesando' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Cliente:</h5>
                          <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                          <p className="text-sm text-gray-600">{order.customerInfo.email}</p>
                          <p className="text-sm text-gray-600">{order.customerInfo.phone}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Dirección:</h5>
                          <p className="text-sm text-gray-600">{order.customerInfo.address}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Productos:</h5>
                        <div className="space-y-1">
                          {order.items.map(item => (
                            <div key={item.product.id} className="flex justify-between text-sm">
                              <span>{item.product.name} x{item.quantity}</span>
                              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};