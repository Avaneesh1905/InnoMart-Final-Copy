-- Create cart_item table if it doesn't exist
CREATE TABLE IF NOT EXISTS cart_item (
  Cart_Item_ID INT AUTO_INCREMENT PRIMARY KEY,
  Cart_ID INT NOT NULL,
  Product_ID INT NOT NULL,
  Quantity INT NOT NULL DEFAULT 1,
  FOREIGN KEY (Cart_ID) REFERENCES cart(Cart_ID),
  FOREIGN KEY (Product_ID) REFERENCES product(Product_ID)
);

-- Add Description and Image_URL columns to product table if they don't exist
ALTER TABLE product 
ADD COLUMN IF NOT EXISTS Description TEXT,
ADD COLUMN IF NOT EXISTS Image_URL VARCHAR(255);

-- Create trigger for order deletion logging
DELIMITER //
CREATE TRIGGER IF NOT EXISTS order_delete_trigger
BEFORE DELETE ON `order`
FOR EACH ROW
BEGIN
  INSERT INTO order_delete_log (Order_ID, Total_Amount, Items, Customer_ID)
  VALUES (OLD.Order_ID, OLD.Total_Amount, OLD.Items, OLD.Customer_ID);
END //
DELIMITER ;

-- Create trigger for bad orders
DELIMITER //
CREATE TRIGGER IF NOT EXISTS bad_order_trigger
AFTER DELETE ON `order`
FOR EACH ROW
BEGIN
  INSERT INTO bad_order (Order_ID, Customer_Name, Total_Amount)
  SELECT OLD.Order_ID, CONCAT(c.First_Name, ' ', c.Last_Name), OLD.Total_Amount
  FROM customer c
  WHERE c.Customer_ID = OLD.Customer_ID;
END //
DELIMITER ;

-- Sample data insertion for categories
INSERT INTO category (Name) VALUES ('electronics') ON DUPLICATE KEY UPDATE Name = Name;
INSERT INTO category (Name) VALUES ('clothing') ON DUPLICATE KEY UPDATE Name = Name;

-- Sample data insertion for products (Electronics)
INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
SELECT 'Premium Wireless Headphones', 19999, c.Category_ID, 
       'Experience crystal clear sound with our noise-cancelling wireless headphones. Perfect for music lovers and professionals.',
       'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
FROM category c 
WHERE c.Name = 'electronics'
AND NOT EXISTS (SELECT 1 FROM product WHERE Name = 'Premium Wireless Headphones');

INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
SELECT 'Ultra HD Smart TV (55")', 64999, c.Category_ID, 
       'Immerse yourself in stunning 4K resolution with our smart TV featuring vibrant colors and seamless streaming capabilities.',
       'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=600'
FROM category c 
WHERE c.Name = 'electronics'
AND NOT EXISTS (SELECT 1 FROM product WHERE Name = 'Ultra HD Smart TV (55")');

INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
SELECT 'Professional Camera DSLR', 89999, c.Category_ID, 
       'Capture moments with exceptional clarity using our professional-grade DSLR camera with advanced image processing.',
       'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
FROM category c 
WHERE c.Name = 'electronics'
AND NOT EXISTS (SELECT 1 FROM product WHERE Name = 'Professional Camera DSLR');

INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
SELECT 'Portable Bluetooth Speaker', 5999, c.Category_ID, 
       'Take your music anywhere with this waterproof and durable Bluetooth speaker offering impressive sound quality.',
       'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
FROM category c 
WHERE c.Name = 'electronics'
AND NOT EXISTS (SELECT 1 FROM product WHERE Name = 'Portable Bluetooth Speaker');

INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
SELECT 'Gaming Laptop Pro', 149999, c.Category_ID, 
       'Experience lag-free gaming with this powerful gaming laptop featuring the latest GPU and cooling technology.',
       'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
FROM category c 
WHERE c.Name = 'electronics'
AND NOT EXISTS (SELECT 1 FROM product WHERE Name = 'Gaming Laptop Pro');

-- Sample data insertion for products (Clothing)
INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
SELECT 'Men''s Premium Cotton T-Shirt', 1499, c.Category_ID, 
       'Classic-fit t-shirt made from 100% soft cotton for everyday comfort and style.',
       'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
FROM category c 
WHERE c.Name = 'clothing'
AND NOT EXISTS (SELECT 1 FROM product WHERE Name = 'Men''s Premium Cotton T-Shirt');

INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
SELECT 'Women''s Casual Denim Jacket', 3999, c.Category_ID, 
       'Versatile denim jacket with a modern cut and premium stitching, perfect for any casual outfit.',
       'https://images.pexels.com/photos/29466467/pexels-photo-29466467/free-photo-of-fashionable-woman-posing-in-trendy-outfit-indoors.jpeg?auto=compress&cs=tinysrgb&w=600'
FROM category c 
WHERE c.Name = 'clothing'
AND NOT EXISTS (SELECT 1 FROM product WHERE Name = 'Women''s Casual Denim Jacket');

INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
SELECT 'Classic Fit Formal Shirt', 2499, c.Category_ID, 
       'Elegant formal shirt crafted from premium cotton with a perfect fit for business and special occasions.',
       'https://images.pexels.com/photos/1043148/pexels-photo-1043148.jpeg?auto=compress&cs=tinysrgb&w=600'
FROM category c 
WHERE c.Name = 'clothing'
AND NOT EXISTS (SELECT 1 FROM product WHERE Name = 'Classic Fit Formal Shirt');

INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
SELECT 'Women''s Full Sleeved Hoodie', 1999, c.Category_ID, 
       'Comfortable and stylish full-sleeved hoodie perfect for casual wear and outdoor activities.',
       'https://images.pexels.com/photos/17664142/pexels-photo-17664142/free-photo-of-a-woman-in-white-sweatshirt-and-shorts-standing-on-the-beach.jpeg?auto=compress&cs=tinysrgb&w=600'
FROM category c 
WHERE c.Name = 'clothing'
AND NOT EXISTS (SELECT 1 FROM product WHERE Name = 'Women''s Full Sleeved Hoodie');

INSERT INTO product (Name, Price, Category_ID, Description, Image_URL)
SELECT 'Winter Wool Coat', 8999, c.Category_ID, 
       'Luxurious wool-blend coat designed to keep you warm and stylish during winter.',
       'https://images.pexels.com/photos/1868735/pexels-photo-1868735.jpeg?auto=compress&cs=tinysrgb&w=600'
FROM category c 
WHERE c.Name = 'clothing'
AND NOT EXISTS (SELECT 1 FROM product WHERE Name = 'Winter Wool Coat');