export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  images?: string[];
  category: string;
  price: number;
  rating: number;
  reviews: number;
  features: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
}

export interface Design {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  type: string;
  category: string;
  price: number;
  rating: number;
  tool: string;
  files?: string[];
  createdAt: string;
}

export interface MiniProject {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
  rating: number;
  technologies: string[];
  sourceCode?: string;
  demo?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productType: 'project' | 'design' | 'mini_project';
  title: string;
  price: number;
  image: string;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id?: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
