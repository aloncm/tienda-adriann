import React, { createContext, useContext, ReactNode } from 'react';
import { Product, CartItem, Order } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface StoreContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Chocolates Gourmet',
    description: 'Deliciosos chocolates artesanales con relleno de trufa',
    price: 25.99,
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'chocolates',
    stock: 50,
    featured: true
  },
  {
    id: '2',
    name: 'Gomitas Frutales',
    description: 'Gomitas suaves con sabores naturales de frutas',
    price: 12.50,
    image: 'https://images.pexels.com/photos/1302242/pexels-photo-1302242.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'gomitas',
    stock: 75,
    featured: true
  },
  {
    id: '3',
    name: 'Paletas Artesanales',
    description: 'Paletas hechas a mano con ingredientes naturales',
    price: 8.99,
    image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'paletas',
    stock: 30,
    featured: false
  },
  {
    id: '4',
    name: 'Caramelos Duros',
    description: 'Caramelos tradicionales con sabores clásicos',
    price: 6.75,
    image: 'https://images.pexels.com/photos/1263617/pexels-photo-1263617.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'caramelos',
    stock: 100,
    featured: false
  },
  {
    id: '5',
    name: 'Bombones Premium',
    description: 'Bombones de chocolate belga con rellenos exquisitos',
    price: 45.00,
    image: 'https://images.pexels.com/photos/1090387/pexels-photo-1090387.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'chocolates',
    stock: 25,
    featured: true
  },
  {
    id: '6',
    name: 'Dulces Mexicanos',
    description: 'Variedad de dulces tradicionales mexicanos',
    price: 18.50,
    image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'tradicionales',
    stock: 40,
    featured: false
  }
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useLocalStorage<Product[]>('candy-store-products', initialProducts);
  const [cart, setCart] = useLocalStorage<CartItem[]>('candy-store-cart', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('candy-store-orders', []);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(currentCart => currentCart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(currentCart =>
      currentCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (order: Order) => {
    setOrders(currentOrders => [...currentOrders, order]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value: StoreContextType = {
    products,
    setProducts,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    orders,
    addOrder,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};