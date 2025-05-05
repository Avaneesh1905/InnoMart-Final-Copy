import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  // Get a few products from each category for the homepage
  const electronics = products.filter(p => p.category === 'electronics').slice(0, 3);
  const clothing = products.filter(p => p.category === 'clothing').slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-900 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to InnoMart
            </h1>
            <p className="mt-6 text-xl max-w-3xl">
              Your one-stop destination for premium electronics and stylish clothing at affordable prices.
            </p>
            <div className="mt-10 flex space-x-4">
              <Link
                to="/category/electronics"
                className="bg-white text-blue-600 border border-transparent rounded-md px-5 py-3 text-base font-medium hover:bg-gray-100"
              >
                Shop Electronics
              </Link>
              <Link
                to="/category/clothing"
                className="bg-blue-600 text-white border border-transparent rounded-md px-5 py-3 text-base font-medium hover:bg-blue-700"
              >
                Shop Clothing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Electronics Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Electronics</h2>
          <Link to="/category/electronics" className="text-blue-600 hover:text-blue-800 font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {electronics.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Clothing Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Clothing</h2>
          <Link to="/category/clothing" className="text-blue-600 hover:text-blue-800 font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clothing.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;