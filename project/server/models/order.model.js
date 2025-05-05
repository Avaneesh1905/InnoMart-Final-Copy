const db = require('../config/db');

class Order {
  static async createOrder(userId, cartItems) {
    try {
      // Start a transaction
      await db.query('START TRANSACTION');
      
      // Calculate total amount and item count
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + (item.product.price * item.quantity), 
        0
      );
      const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      
      // Create order
      const [orderResult] = await db.query(
        'INSERT INTO `order` (Total_Amount, Items, Customer_ID) VALUES (?, ?, ?)',
        [totalAmount, itemCount, userId]
      );
      
      const orderId = orderResult.insertId;
      
      // Create tracking entry
      await db.query(
        'INSERT INTO tracking_detail (Order_Number, Status) VALUES (?, ?)',
        [orderId, 'Pending']
      );
      
      // Create payment entry
      await db.query(
        'INSERT INTO payment (Order_ID, Type, Status) VALUES (?, ?, ?)',
        [orderId, 'Credit Card', 'Completed']
      );
      
      // Update customer status
      await db.query(
        'INSERT INTO customerstatus (First_Name, Order_ID, Status) SELECT c.First_Name, ?, "Ordered" FROM customer c WHERE c.Customer_ID = ?',
        [orderId, userId]
      );
      
      // Clear the cart after successful order
      // Get cart ID
      const [carts] = await db.query('SELECT Cart_ID FROM cart WHERE User_ID = ?', [userId]);
      
      if (carts.length > 0) {
        // Delete all items in the cart
        await db.query('DELETE FROM cart_item WHERE Cart_ID = ?', [carts[0].Cart_ID]);
      }
      
      // Commit transaction
      await db.query('COMMIT');
      
      return {
        orderId,
        totalAmount,
        itemCount
      };
    } catch (error) {
      // Rollback in case of error
      await db.query('ROLLBACK');
      console.error('Error creating order:', error);
      throw error;
    }
  }
  
  static async getOrderHistory(userId) {
    try {
      const [rows] = await db.query(`
        SELECT 
          o.Order_ID as id,
          o.Total_Amount as totalAmount,
          o.Items as itemCount,
          td.Status as status,
          p.Type as paymentMethod,
          p.Status as paymentStatus
        FROM 
          \`order\` o
        JOIN 
          tracking_detail td ON o.Order_ID = td.Order_Number
        JOIN 
          payment p ON o.Order_ID = p.Order_ID
        WHERE 
          o.Customer_ID = ?
        ORDER BY
          o.Order_ID DESC
      `, [userId]);
      
      return rows;
    } catch (error) {
      console.error('Error getting order history:', error);
      throw error;
    }
  }
}

module.exports = Order;