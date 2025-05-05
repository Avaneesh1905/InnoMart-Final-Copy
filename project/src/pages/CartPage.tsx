import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, Trash2 } from 'lucide-react';
import CartItemComponent from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { ordersAPI } from '../api';
import { toast } from 'react-toastify';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateItemQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!authState.isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setIsProcessing(true);

    try {
      // Call the API to create an order
      const response = await ordersAPI.createOrder();
      
      if (response.status === 201) {
        toast.success('Order placed successfully!');
        navigate('/checkout-success');
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process your order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-400" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-600">Looks like you haven't added any products to your cart yet.</p>
        <div className="mt-6">
          <Link to="/" className="text-blue-600 font-medium hover:text-blue-500">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-7">
          <div className="border-t border-gray-200 divide-y divide-gray-200">
            {items.map(item => (
              <CartItemComponent
                key={item.id}
                item={item}
                onRemove={removeFromCart}
                onUpdateQuantity={updateItemQuantity}
              />
            ))}
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => clearCart()}
              className="flex items-center text-red-600 hover:text-red-500"
            >
              <Trash2 size={18} className="mr-1" />
              Clear Cart
            </button>
          </div>
        </div>
        
        <div className="mt-16 lg:mt-0 lg:col-span-5">
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal ({getTotalItems()} items)</p>
                <p className="text-sm font-medium text-gray-900">{formatCurrency(getTotalPrice())}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="text-sm font-medium text-gray-900">₹99.00</p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Tax</p>
                <p className="text-sm font-medium text-gray-900">{formatCurrency(getTotalPrice() * 0.18)}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <p className="text-base font-medium text-gray-900">Order Total</p>
                <p className="text-base font-bold text-blue-600">{formatCurrency(getTotalPrice() + 99 + (getTotalPrice() * 0.18))}</p>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`mt-6 w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  <CreditCard size={20} className="mr-2" />
                  Proceed to Checkout
                </>
              )}
            </button>
            
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-blue-600 hover:text-blue-500">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;