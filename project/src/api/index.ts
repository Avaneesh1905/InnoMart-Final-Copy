import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add authorization token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
    
  signup: (userData: any) => 
    api.post('/auth/signup', userData),
    
  getProfile: () => 
    api.get('/auth/profile'),
    
  updateProfile: (userData: any) => 
    api.put('/auth/profile', userData),
};

// Products API
export const productsAPI = {
  getAllProducts: () => 
    api.get('/products'),
    
  getProductsByCategory: (category: string) => 
    api.get(`/products/category/${category}`),
    
  getProductById: (id: string) => 
    api.get(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  getCartItems: () => 
    api.get('/cart'),
    
  addToCart: (productId: string, quantity = 1) => 
    api.post('/cart', { productId, quantity }),
    
  updateCartItemQuantity: (itemId: string, change: number) => 
    api.put(`/cart/${itemId}`, { change }),
    
  removeFromCart: (itemId: string) => 
    api.delete(`/cart/${itemId}`),
    
  clearCart: () => 
    api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  createOrder: () => 
    api.post('/orders'),
    
  getOrderHistory: () => 
    api.get('/orders/history'),
};

export default api;