import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">InnoMart</h2>
            <p className="text-gray-300">
              Your one-stop shop for electronics and clothing. Quality products at affordable prices.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/category/electronics" className="text-gray-300 hover:text-white">Electronics</Link>
              </li>
              <li>
                <Link to="/category/clothing" className="text-gray-300 hover:text-white">Clothing</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white">Cart</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-300">
              Email: support@innomart.com<br />
              Phone: +91 1234567890<br />
              Address: 123 Commerce Street, Mumbai, India
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} InnoMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;