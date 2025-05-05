import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { cartAPI } from '../api'; // Make sure this path is correct
import { toast } from 'react-toastify';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart: addToLocalCart } = useCart(); // Optional: update local state

  const product = products.find(p => p.id === id);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      // Call backend API
      await cartAPI.addToCart(product.id, 1);

      // Optional: also update client-side cart context if needed
      addToLocalCart(product);

      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mb-8"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-center object-cover"
          />
        </div>

        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-blue-600 font-bold">{formatCurrency(product.price)}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-10 flex sm:flex-col1">
            <button
              onClick={handleAddToCart}
              className="max-w-xs flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-full"
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-sm font-medium text-gray-900">Product Details</h2>
            <div className="mt-4 prose prose-sm text-gray-500">
              <ul role="list">
                <li>Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</li>
                <li>Product ID: {product.id}</li>
                <li>In Stock: Yes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;