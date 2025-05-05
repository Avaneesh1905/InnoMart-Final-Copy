// src/api/cartAPI.ts

import axios from 'axios';

const cartAPI = {
  async getCartItems() {
    return await axios.get('/api/cart');
  },

  async addToCart(productId: number) {
    return await axios.post('/api/cart', { productId, quantity: 1 });
  },

  async updateCartItemQuantity(itemId: string, change: number) {
    return await axios.put(`/api/cart/${itemId}`, { change });
  },

  async removeFromCart(itemId: string) {
    return await axios.delete(`/api/cart/${itemId}`);
  },

  async clearCart() {
    return await axios.delete('/api/cart');
  },
};

export { cartAPI };