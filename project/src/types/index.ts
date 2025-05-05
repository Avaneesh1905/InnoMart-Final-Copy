export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  dob?: string;
  age?: number;
  phoneNumber?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  items: number;
  customerId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}