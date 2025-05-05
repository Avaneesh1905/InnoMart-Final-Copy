const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let connection;

async function setupDatabase() {
  
  console.log("Starting MySQL connection setup");
  try {
    // Create connection to MySQL server
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'TargetGPA@9.0',
      port: process.env.DB_PORT || 3306
    }).catch(err => {
      console.error('Error connecting to MySQL:', err.message);
      process.exit(1);
    });

    console.log('Connected to MySQL server');

    // Check if database exists, create if not
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created or already exists`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Create tables if they don't exist
    console.log('Creating tables if they don\'t exist...');

    // Customer table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customer (
        Customer_ID INT AUTO_INCREMENT PRIMARY KEY,
        First_Name VARCHAR(50),
        Last_Name VARCHAR(50),
        Phone_Number VARCHAR(15) UNIQUE,
        Password VARCHAR(255),
        Email VARCHAR(100) UNIQUE
      )
    `);

    // Category table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS category (
        Category_ID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(100) UNIQUE
      )
    `);

    // Product table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product (
        Product_ID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(100),
        Price DECIMAL(10,2),
        Category_ID INT,
        Description TEXT,
        Image_URL VARCHAR(255),
        FOREIGN KEY (Category_ID) REFERENCES category(Category_ID)
      )
    `);

    // Cart table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart (
        Cart_ID INT AUTO_INCREMENT PRIMARY KEY,
        User_ID INT,
        FOREIGN KEY (User_ID) REFERENCES customer(Customer_ID)
      )
    `);

    // Cart item table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart_item (
        Cart_Item_ID INT AUTO_INCREMENT PRIMARY KEY,
        Cart_ID INT,
        Product_ID INT,
        Quantity INT DEFAULT 1,
        FOREIGN KEY (Cart_ID) REFERENCES cart(Cart_ID),
        FOREIGN KEY (Product_ID) REFERENCES product(Product_ID)
      )
    `);

    // Order table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`order\` (
        Order_ID INT AUTO_INCREMENT PRIMARY KEY,
        Total_Amount DECIMAL(10,2),
        Items INT,
        Customer_ID INT,
        FOREIGN KEY (Customer_ID) REFERENCES customer(Customer_ID)
      )
    `);

    // Order delete log table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_delete_log (
        Order_ID INT,
        Total_Amount DECIMAL(10,2),
        Items INT,
        Customer_ID INT,
        Deleted_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bad order table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bad_order (
        Order_ID INT,
        Customer_Name VARCHAR(50),
        Total_Amount DECIMAL(10,2)
      )
    `);

    // Payment table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payment (
        Order_ID INT PRIMARY KEY,
        Type VARCHAR(50),
        Status VARCHAR(50),
        FOREIGN KEY (Order_ID) REFERENCES \`order\`(Order_ID)
      )
    `);

    // Tracking detail table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tracking_detail (
        Tracking_ID INT AUTO_INCREMENT PRIMARY KEY,
        Order_Number INT,
        Status VARCHAR(50),
        FOREIGN KEY (Order_Number) REFERENCES \`order\`(Order_ID)
      )
    `);

    // Customer status table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customerstatus (
        First_Name VARCHAR(50),
        Order_ID INT NOT NULL DEFAULT 0,
        Status VARCHAR(50)
      )
    `);

    // Prime table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS prime (
        Customer_ID INT PRIMARY KEY,
        Join_Date DATE,
        Subscription_Fee DECIMAL(10,2),
        Benefits VARCHAR(255),
        FOREIGN KEY (Customer_ID) REFERENCES customer(Customer_ID)
      )
    `);

    // Prime customers view
    await connection.query(`
      CREATE OR REPLACE VIEW primecustomers AS
      SELECT c.Customer_ID, c.First_Name, c.Last_Name
      FROM customer c
      JOIN prime p ON c.Customer_ID = p.Customer_ID
    `);

    // Create triggers
    console.log('Creating triggers...');

    // Check if order_delete_trigger exists
    const [triggerExists] = await connection.query(`
      SELECT TRIGGER_NAME 
      FROM information_schema.TRIGGERS 
      WHERE TRIGGER_SCHEMA = ? AND TRIGGER_NAME = 'order_delete_trigger'
    `, [process.env.DB_NAME]);

    if (triggerExists.length === 0) {
      // Order delete trigger
      await connection.query(`
        CREATE TRIGGER order_delete_trigger
        BEFORE DELETE ON \`order\`
        FOR EACH ROW
        BEGIN
          INSERT INTO order_delete_log (Order_ID, Total_Amount, Items, Customer_ID)
          VALUES (OLD.Order_ID, OLD.Total_Amount, OLD.Items, OLD.Customer_ID);
        END
      `);
      console.log('Created order_delete_trigger');
    }

    // Check if bad_order_trigger exists
    const [badOrderTriggerExists] = await connection.query(`
      SELECT TRIGGER_NAME 
      FROM information_schema.TRIGGERS 
      WHERE TRIGGER_SCHEMA = ? AND TRIGGER_NAME = 'bad_order_trigger'
    `, [process.env.DB_NAME]);

    if (badOrderTriggerExists.length === 0) {
      // Bad order trigger
      await connection.query(`
        CREATE TRIGGER bad_order_trigger
        AFTER DELETE ON \`order\`
        FOR EACH ROW
        BEGIN
          INSERT INTO bad_order (Order_ID, Customer_Name, Total_Amount)
          SELECT OLD.Order_ID, CONCAT(c.First_Name, ' ', c.Last_Name), OLD.Total_Amount
          FROM customer c
          WHERE c.Customer_ID = OLD.Customer_ID;
        END
      `);
      console.log('Created bad_order_trigger');
    }

    // Insert sample data
    console.log('Inserting sample data...');

    // Insert categories
    await connection.query(`
      INSERT INTO category (Name) VALUES ('electronics'), ('clothing')
      ON DUPLICATE KEY UPDATE Name = VALUES(Name)
    `);

    // Get category IDs
    const [categories] = await connection.query('SELECT Category_ID, Name FROM category');
    const electronicsCategoryId = categories.find(c => c.Name === 'electronics').Category_ID;
    const clothingCategoryId = categories.find(c => c.Name === 'clothing').Category_ID;

    // Insert products (Electronics)
    const electronicsProducts = [
      {
        name: 'Premium Wireless Headphones',
        price: 19999,
        description: 'Experience crystal clear sound with our noise-cancelling wireless headphones. Perfect for music lovers and professionals.',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        name: 'Ultra HD Smart TV (55")',
        price: 64999,
        description: 'Immerse yourself in stunning 4K resolution with our smart TV featuring vibrant colors and seamless streaming capabilities.',
        image: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Professional Camera DSLR',
        price: 89999,
        description: 'Capture moments with exceptional clarity using our professional-grade DSLR camera with advanced image processing.',
        image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        name: 'Portable Bluetooth Speaker',
        price: 5999,
        description: 'Take your music anywhere with this waterproof and durable Bluetooth speaker offering impressive sound quality.',
        image: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        name: 'Gaming Laptop Pro',
        price: 149999,
        description: 'Experience lag-free gaming with this powerful gaming laptop featuring the latest GPU and cooling technology.',
        image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ];

    for (const product of electronicsProducts) {
      await connection.query(`
        INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
        SELECT ?, ?, ?, ?, ?
        FROM dual
        WHERE NOT EXISTS (SELECT 1 FROM product WHERE Name = ?)
      `, [product.name, product.price, electronicsCategoryId, product.description, product.image, product.name]);
    }

    // Insert products (Clothing)
    const clothingProducts = [
      {
        name: "Men's Premium Cotton T-Shirt",
        price: 1499,
        description: 'Classic-fit t-shirt made from 100% soft cotton for everyday comfort and style.',
        image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        name: "Women's Casual Denim Jacket",
        price: 3999,
        description: 'Versatile denim jacket with a modern cut and premium stitching, perfect for any casual outfit.',
        image: 'https://images.pexels.com/photos/29466467/pexels-photo-29466467/free-photo-of-fashionable-woman-posing-in-trendy-outfit-indoors.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Classic Fit Formal Shirt',
        price: 2499,
        description: 'Elegant formal shirt crafted from premium cotton with a perfect fit for business and special occasions.',
        image: 'https://images.pexels.com/photos/1043148/pexels-photo-1043148.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: "Women's Full Sleeved Hoodie",
        price: 1999,
        description: 'Comfortable and stylish full-sleeved hoodie perfect for casual wear and outdoor activities.',
        image: 'https://images.pexels.com/photos/17664142/pexels-photo-17664142/free-photo-of-a-woman-in-white-sweatshirt-and-shorts-standing-on-the-beach.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Winter Wool Coat',
        price: 8999,
        description: 'Luxurious wool-blend coat designed to keep you warm and stylish during winter.',
        image: 'https://images.pexels.com/photos/1868735/pexels-photo-1868735.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ];

    for (const product of clothingProducts) {
      await connection.query(`
        INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
        SELECT ?, ?, ?, ?, ?
        FROM dual
        WHERE NOT EXISTS (SELECT 1 FROM product WHERE Name = ?)
      `, [product.name, product.price, clothingCategoryId, product.description, product.image, product.name]);
    }


    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Setup the database but don't close the connection
setupDatabase().catch(err => {
  console.error("Unhandled error during setup:", err);
});

// Export the connection for reuse
module.exports = connection;