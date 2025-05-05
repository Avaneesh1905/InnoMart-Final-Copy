import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { cartAPI } from '../api';
import { toast } from 'react-toastify';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, change: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { authState } = useAuth();

  // Load cart items when user is authenticated
  useEffect(() => {
    const fetchCartItems = async () => {
      if (authState.isAuthenticated && authState.user) {
        try {
          const response = await cartAPI.getCartItems();
          
          if (response.status === 200) {
            setItems(response.data);
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
          toast.error('Failed to load your cart items');
        }
      } else {
        // Load from local storage if not authenticated
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setItems(JSON.parse(storedCart));
        }
      }
    };
    
    fetchCartItems();
  }, [authState.isAuthenticated, authState.user, authState.token]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (!authState.isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, authState.isAuthenticated]);

  const addToCart = async (product: Product) => {
    try {
      // Check if product already in cart
      const existingItem = items.find(item => item.productId === product.id);
      
      if (existingItem) {
        await updateItemQuantity(existingItem.id, 1);
        toast.success(`Added another ${product.name} to your cart`);
      } else {
        if (authState.isAuthenticated) {
          const response = await cartAPI.addToCart(product.id);
          
          if (response.status === 201) {
            setItems(response.data.cartItems);
            toast.success(`${product.name} added to your cart`);
          }
        } else {
          // For unauthenticated users, handle locally
          const newItem: CartItem = {
            id: `temp-${Date.now()}`,
            productId: product.id,
            product,
            quantity: 1,
          };
          
          setItems(prevItems => [...prevItems, newItem]);
          toast.success(`${product.name} added to your cart`);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const updateItemQuantity = async (itemId: string, change: number) => {
    try {
      if (authState.isAuthenticated) {
        const response = await cartAPI.updateCartItemQuantity(itemId, change);
        
        if (response.status === 200) {
          setItems(response.data.cartItems);
        }
      } else {
        // For unauthenticated users, handle locally
        setItems(prevItems => 
          prevItems.map(item => {
            if (item.id === itemId) {
              const newQuantity = item.quantity + change;
              return newQuantity <= 0 
                ? null 
                : { ...item, quantity: newQuantity };
            }
            return item;
          }).filter(Boolean) as CartItem[]
        );
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      toast.error('Failed to update item quantity');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (authState.isAuthenticated) {
        const response = await cartAPI.removeFromCart(itemId);
        
        if (response.status === 200) {
          setItems(response.data.cartItems);
          toast.info('Item removed from cart');
        }
      } else {
        // For unauthenticated users, handle locally
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        toast.info('Item removed from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    try {
      if (authState.isAuthenticated) {
        await cartAPI.clearCart();
      }
      
      setItems([]);
      localStorage.removeItem('cart');
      toast.info('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateItemQuantity,
      clearCart, 
      getTotalPrice, 
      getTotalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};