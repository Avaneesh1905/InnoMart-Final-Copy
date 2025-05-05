import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/category/:category" element={<Layout><CategoryPage /></Layout>} />
      <Route path="/product/:id" element={<Layout><ProductPage /></Layout>} />
      <Route path="/cart" element={<Layout><CartPage /></Layout>} />
      <Route path="/checkout-success" element={<Layout><CheckoutSuccessPage /></Layout>} />
      <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
    </Routes>
  );
}

export default App;