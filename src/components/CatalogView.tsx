import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

interface CatalogViewProps {
  searchTerm: string;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ searchTerm }) => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const featuredProducts = useMemo(() => {
    return filteredProducts.filter(p => p.featured);
  }, [filteredProducts]);

  const getCategoryDisplayName = (category: string) => {
    const names: { [key: string]: string } = {
      all: 'Todos',
      chocolates: 'Chocolates',
      gomitas: 'Gomitas',
      paletas: 'Paletas',
      caramelos: 'Caramelos',
      tradicionales: 'Tradicionales'
    };
    return names[category] || category;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Los Dulces Más Deliciosos
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Descubre nuestra increíble selección de dulces artesanales, desde chocolates gourmet hasta gomitas frutales
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-pink-300'
            }`}
          >
            {getCategoryDisplayName(category)}
          </button>
        ))}
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && selectedCategory === 'all' && !searchTerm && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🌟 Productos Destacados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* All Products */}
      <div className="mb-8">
        {searchTerm && (
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Resultados para "{searchTerm}" ({filteredProducts.length})
          </h3>
        )}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍭</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No encontramos dulces
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `No hay productos que coincidan con "${searchTerm}"`
                : 'No hay productos en esta categoría'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};