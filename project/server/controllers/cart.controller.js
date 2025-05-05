// src/controllers/cart.controller.js

const Cart = require('../models/cart.model');

const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.getCartItems(userId);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    await Cart.addToCart(userId, productId, quantity);
    res.status(200).send('Item added to cart');
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

const updateCartItemQuantity = async (req, res) => {
  const { change } = req.body;
  const { id } = req.params;

  try {
    const newQuantity = await Cart.updateCartItemQuantity(id, change);
    res.json({ quantity: newQuantity });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

const removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    await Cart.removeFromCart(id);
    res.status(200).send('Item removed from cart');
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    await Cart.clearCart(userId);
    res.status(200).send('Cart cleared');
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};