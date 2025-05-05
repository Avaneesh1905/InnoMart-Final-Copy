const db = require('../config/db');

class Product {
  static async getAllProducts() {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.Product_ID as id, 
          p.Name as name, 
          p.Price as price, 
          c.Name as category,
          p.Description as description,
          p.Image_URL as image
        FROM 
          product p
        JOIN 
          category c ON p.Category_ID = c.Category_ID
      `);
      
      return rows;
    } catch (error) {
      console.error('Error getting all products:', error);
      throw error;
    }
  }

  static async getProductsByCategory(categoryName) {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.Product_ID as id, 
          p.Name as name, 
          p.Price as price, 
          c.Name as category,
          p.Description as description,
          p.Image_URL as image
        FROM 
          product p
        JOIN 
          category c ON p.Category_ID = c.Category_ID
        WHERE 
          c.Name = ?
      `, [categoryName]);
      
      return rows;
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  }

  static async getProductById(productId) {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.Product_ID as id, 
          p.Name as name, 
          p.Price as price, 
          c.Name as category,
          p.Description as description,
          p.Image_URL as image
        FROM 
          product p
        JOIN 
          category c ON p.Category_ID = c.Category_ID
        WHERE 
          p.Product_ID = ?
      `, [productId]);
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting product by ID:', error);
      throw error;
    }
  }
}

module.exports = Product;