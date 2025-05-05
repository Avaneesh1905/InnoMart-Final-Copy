const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

exports.createOrder = async (req, res) => {
  try {
    // Get cart items
    const cartItems = await Cart.getCartItems(req.user.id);
    
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Create order
    const order = await Order.createOrder(req.user.id, cartItems);
    
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.getOrderHistory(req.user.id);
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting order history:', error);
    res.status(500).json({ message: 'Server error getting order history' });
  }
};