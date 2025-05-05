import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CheckoutSuccessPage: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/');
    }
  }, [authState.isAuthenticated, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
      <div className="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto">
        <Check size={48} className="text-green-600" />
      </div>
      
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Order Placed Successfully!</h1>
      <p className="mt-2 text-lg text-gray-600">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>
      
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Order Details</h2>
        <div className="space-y-2 text-left">
          <p className="flex justify-between">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-medium">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">Credit Card</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-green-600">Confirmed</span>
          </p>
        </div>
      </div>
      
      <div className="mt-10 flex flex-col items-center">
        <Link 
          to="/"
          className="bg-blue-600 text-white py-3 px-8 rounded-md font-medium hover:bg-blue-700 flex items-center"
        >
          <ShoppingBag size={20} className="mr-2" />
          Continue Shopping
        </Link>
        
        <Link 
          to="/profile"
          className="mt-4 text-blue-600 hover:text-blue-500"
        >
          View Order History
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;