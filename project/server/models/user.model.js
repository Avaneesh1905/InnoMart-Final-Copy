const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Insert into customer table with Email included
      const [customerResult] = await db.query(
        'INSERT INTO customer (First_Name, Last_Name, Phone_Number, Password, Email) VALUES (?, ?, ?, ?, ?)',
        [userData.firstName, userData.lastName, userData.phoneNumber, hashedPassword, userData.email]
      );

      const customerId = customerResult.insertId;

      // If successful, return user info without password
      return {
        id: customerId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async findByCredentials(email, password) {
    try {
      // For demonstration, simulating user lookup
      // In a real app, you would query the database
      const user = {
        id: 1,
        firstName: 'Demo',
        lastName: 'User',
        email: email,
        password: await bcrypt.hash(password, 10)
      };

      // Check if credentials match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return null;
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  static async updateProfile(userId, userData) {
    try {
      // Update user profile in database
      const [result] = await db.query(
        'UPDATE customer SET First_Name = ?, Last_Name = ?, Phone_Number = ?, Email = ? WHERE Customer_ID = ?',
        [userData.firstName, userData.lastName, userData.phoneNumber, userData.email, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  static async getById(userId) {
    try {
      const [rows] = await db.query(
        'SELECT Customer_ID as id, First_Name as firstName, Last_Name as lastName, Phone_Number as phoneNumber, Email as email FROM customer WHERE Customer_ID = ?',
        [userId]
      );
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }
}

module.exports = User;
