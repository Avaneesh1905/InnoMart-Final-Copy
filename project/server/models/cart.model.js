const db = require('../config/db');

class Cart {
  static async getCartItems(userId) {
    try {
      const [rows] = await db.query(`
        SELECT 
          ci.Cart_Item_ID as id,
          ci.Product_ID as productId,
          ci.Quantity as quantity,
          p.Name as name,
          p.Price as price,
          p.Description as description,
          p.Image_URL as image,
          c.Name as category
        FROM 
          cart_item ci
        JOIN 
          product p ON ci.Product_ID = p.Product_ID
        JOIN 
          category c ON p.Category_ID = c.Category_ID
        JOIN 
          cart ca ON ci.Cart_ID = ca.Cart_ID
        WHERE 
          ca.User_ID = ?
      `, [userId]);
      
      // Transform the results to match the expected format
      return rows.map(item => ({
        id: item.id.toString(),
        productId: item.productId.toString(),
        quantity: item.quantity,
        product: {
          id: item.productId.toString(),
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          category: item.category.toLowerCase()
        }
      }));
    } catch (error) {
      console.error('Error getting cart items:', error);
      throw error;
    }
  }

  static async addToCart(userId, productId, quantity) {
    try {
      // Check if user has a cart
      let cartId;
      const [carts] = await db.query('SELECT Cart_ID FROM cart WHERE User_ID = ?', [userId]);
      
      if (carts.length === 0) {
        // Create a new cart for the user
        const [result] = await db.query('INSERT INTO cart (User_ID) VALUES (?)', [userId]);
        cartId = result.insertId;
      } else {
        cartId = carts[0].Cart_ID;
      }

      // Check if item already exists in cart
      const [existingItems] = await db.query(
        'SELECT Cart_Item_ID, Quantity FROM cart_item WHERE Cart_ID = ? AND Product_ID = ?', 
        [cartId, productId]
      );

      if (existingItems.length > 0) {
        // Update quantity
        const newQuantity = existingItems[0].Quantity + quantity;
        await db.query(
          'UPDATE cart_item SET Quantity = ? WHERE Cart_Item_ID = ?',
          [newQuantity, existingItems[0].Cart_Item_ID]
        );
        return existingItems[0].Cart_Item_ID;
      } else {
        // Add new item
        const [result] = await db.query(
          'INSERT INTO cart_item (Cart_ID, Product_ID, Quantity) VALUES (?, ?, ?)',
          [cartId, productId, quantity]
        );
        return result.insertId;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  static async updateCartItemQuantity(itemId, change) {
    try {
      // Get current quantity
      const [items] = await db.query(
        'SELECT Quantity FROM cart_item WHERE Cart_Item_ID = ?', 
        [itemId]
      );
      
      if (items.length === 0) {
        throw new Error('Cart item not found');
      }
      
      const newQuantity = items[0].Quantity + change;
      
      if (newQuantity <= 0) {
        // Remove item if quantity becomes 0 or negative
        await db.query('DELETE FROM cart_item WHERE Cart_Item_ID = ?', [itemId]);
        return 0;
      } else {
        // Update quantity
        await db.query(
          'UPDATE cart_item SET Quantity = ? WHERE Cart_Item_ID = ?',
          [newQuantity, itemId]
        );
        return newQuantity;
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  }

  static async removeFromCart(itemId) {
    try {
      await db.query('DELETE FROM cart_item WHERE Cart_Item_ID = ?', [itemId]);
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  static async clearCart(userId) {
    try {
      // Get cart ID
      const [carts] = await db.query('SELECT Cart_ID FROM cart WHERE User_ID = ?', [userId]);
      
      if (carts.length === 0) {
        return false;
      }
      
      // Delete all items in the cart
      await db.query('DELETE FROM cart_item WHERE Cart_ID = ?', [carts[0].Cart_ID]);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}

module.exports = Cart;