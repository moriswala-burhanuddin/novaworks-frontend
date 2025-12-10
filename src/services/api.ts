import axios, { AxiosInstance } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMediaUrl = (path?: string) => {
  if (!path) return 'https://via.placeholder.com/400x300';
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;

  try {
    // If path is relative, append to origin of API_BASE_URL
    const url = new URL(API_BASE_URL);
    return `${url.origin}${path.startsWith('/') ? '' : '/'}${path}`;
  } catch (e) {
    return path;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const sessionId = localStorage.getItem('cart_session');
  if (sessionId) {
    config.headers['X-Cart-Session'] = sessionId;
  }
  return config;
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle Network Errors (Backend down/unreachable)
    if (!error.response) {
      // Network Error (DNS, Server Down, CORS)
      console.error("Network Error Deteced:", error);
      // You might want to trigger a global toast or redirect here
      // For now, we rely on the component catching it, but we can emit an event or use a global store
      // toast.error("Unable to connect to server. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

// Production Console Cleanup
if (import.meta.env.PROD) {
  const noop = () => { };
  console.log = noop;
  console.info = noop;
  // We keep console.error for critical debugging if needed, or remove it too:
  // console.error = noop; 
}

export const projectsAPI = {
  getAll: (params?: any) => api.get('/projects/', { params }),
  getById: (id: string) => api.get(`/projects/${id}/`),
  create: (data: any) => api.post('/projects/', data),
  update: (id: string, data: any) => api.put(`/projects/${id}/`, data),
  delete: (id: string) => api.delete(`/projects/${id}/`),
};

export const designsAPI = {
  getAll: (params?: any) => api.get('/designs/', { params }),
  getById: (id: string) => api.get(`/designs/${id}/`),
  create: (data: any) => api.post('/designs/', data),
  update: (id: string, data: any) => api.put(`/designs/${id}/`, data),
  delete: (id: string) => api.delete(`/designs/${id}/`),
};

export const miniProjectsAPI = {
  getAll: (params?: any) => api.get('/mini-projects/', { params }),
  getById: (id: string) => api.get(`/mini-projects/${id}/`),
  create: (data: any) => api.post('/mini-projects/', data),
  update: (id: string, data: any) => api.put(`/mini-projects/${id}/`, data),
  delete: (id: string) => api.delete(`/mini-projects/${id}/`),
};

export interface CartItem {
  id: number;
  project: Project;
  quantity: number;
  price_at_add_time: string;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_price: number;
  count: number;
}

export const cartAPI = {
  getCart: () => api.get<Cart>('/store/cart/'),
  addToCart: (project_id: number, quantity: number = 1, session_id?: string) =>
    api.post('/store/cart/add/', { project_id, quantity, session_id }),
  updateCartItem: (itemId: number, quantity: number) =>
    api.put(`/store/cart/items/${itemId}/`, { quantity }),
  removeFromCart: (itemId: number) => api.delete(`/store/cart/items/${itemId}/`),
  clearCart: () => api.post('/store/cart/clear/'),
};

export const ordersAPI = {
  getAll: (params?: any) => api.get('/orders/', { params }),
  getById: (id: string) => api.get(`/orders/${id}/`),
  create: (data: any) => api.post('/orders/', data),
};

export const paymentAPI = {
  createPaymentIntent: (data: any) => api.post('/payments/create-intent/', data),
  confirmPayment: (data: any) => api.post('/payments/confirm/', data),
};

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Technology {
  id: number;
  name: string;
  icon?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface ProjectImage {
  id: number;
  image: string;
  is_thumbnail: boolean;
}

export interface KeyFeature {
  id: number;
  title: string;
  description: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  price_inr: number;
  price_usd: number;
  discount_percentage: number;
  final_price: number; // This comes from serializer method field
  category: Category;
  tags: Tag[];
  technologies: Technology[];
  thumbnail?: string;
  images?: ProjectImage[];
  features?: KeyFeature[];
  version: string;
  demo_link?: string;
  demo_video_url?: string;
  github_release_url?: string;
  license_type: string;
  featured: boolean;
  created_at: string;
  updated_at?: string;
  readme_file?: string;
}

export interface Design {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string | Category;
  category_id?: number;
  image?: string; // Kept for backward compat
  images?: { id: number; image: string; is_thumbnail: boolean }[];
  file?: string;
  tool: string;
  rating: number;
  created_at: string;
}

export interface MiniProject {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  source_code?: string;
  demo_link?: string;
  price: string;
  rating: number;
  technologies: Technology[];
  created_at: string;
}

export interface Review {
  id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}


export const storeAPI = {
  getProjects: (params: any = {}) => api.get('/store/projects/', { params }),
  getProjectBySlug: (slug: string) => api.get<Project>(`/store/projects/${slug}/`),
  getCategories: () => api.get<Category[]>('/store/categories/'),
  getDesigns: (params: any = {}) => api.get('/store/designs/', { params }),
  getDesignBySlug: (slug: string) => api.get<Design>(`/store/designs/${slug}/`),
  getMiniProjects: (params: any = {}) => api.get('/store/mini-projects/', { params }),
  getMiniProjectBySlug: (slug: string) => api.get<MiniProject>(`/store/mini-projects/${slug}/`),
  createRazorpayOrder: (project_id?: number) => api.post('/store/create-order/', { project_id }),
  verifyPayment: (data: any) => api.post('/store/verify-payment/', data),
  getTechnologies: () => api.get<Technology[]>('/store/technologies/'),
  getTags: () => api.get<Tag[]>('/store/tags/'),
  getOrders: () => api.get('/store/orders/'),
  getOrderById: (orderId: string) => api.get(`/store/orders/${orderId}/`),
  downloadItem: (orderId: string, itemId: number) =>
    api.get(`/store/orders/${orderId}/download/${itemId}/`, { responseType: 'blob' }),
  submitContact: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post('/store/contact/', data),
  getProjectReadme: (slug: string) => api.get<{ content: string }>(`/store/projects/${slug}/readme/`),
};

export const usersAPI = {
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data: any) => {
    // If data is FormData, let axios set correct headers (multipart/form-data)
    if (data instanceof FormData) {
      return api.put('/auth/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put('/auth/profile/', data);
  },
};
export interface Feedback {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
  created_at: string;
}

export const feedbackAPI = {
  submitFeedback: (data: Partial<Feedback>) => api.post('/store/feedback/', data),
  getFeedbacks: () => api.get<Feedback[]>('/store/feedback/'),
};

export interface CodeCategory {
  id: number;
  name: string;
  slug: string;
}

export interface CodeComponent {
  id: number;
  category: CodeCategory;
  title: string;
  description: string;
  html_code: string;
  css_code: string;
  js_code: string;
  created_at: string;
}

export const codeLibraryAPI = {
  getCategories: () => api.get<CodeCategory[]>('/store/code-categories/'),
  getComponents: (params: any = {}) => api.get<CodeComponent[]>('/store/code-components/', { params }),
  getComponentById: (id: number) => api.get<CodeComponent>(`/store/code-components/${id}/`),
};

export const reviewsAPI = {
  getReviews: (modelType: string, objectId: number) =>
    api.get(`/store/reviews/?model_type=${modelType}&object_id=${objectId}`),

  createReview: (data: { model_type: string; object_id: number; rating: number; comment: string }) =>
    api.post('/store/reviews/', data),

  deleteReview: (reviewId: number) =>
    api.delete(`/store/reviews/${reviewId}/`),

  updateReview: (reviewId: number, data: { rating: number; comment: string }) =>
    api.put(`/store/reviews/${reviewId}/`, data),
};



export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/token/', { email, password }),
  register: (data: any) => api.post('/auth/register/', data),
  logout: () => api.post('/auth/logout/', { refresh: localStorage.getItem('authToken') }), // Note: usually refresh token is stored separately
  refreshToken: () => api.post('/auth/refresh/'),
  requestPasswordReset: (email: string) => api.post('/auth/password-reset/', { email }),
  confirmPasswordReset: (data: any) => api.post('/auth/password-reset/confirm/', data),
  changePassword: (data: any) => api.post('/auth/change-password/', data),
  verifyEmail: (uid: string, token: string) => api.get(`/auth/verify-email/${uid}/${token}/`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats/'),
  getUsers: () => api.get('/admin/users/'),
  getOrders: () => api.get('/admin/orders/'),
  getProjects: (params: any = {}) => api.get('/admin/projects/', { params }),
  getProject: (id: number) => api.get<Project>(`/admin/projects/${id}/`),
  createProject: (data: FormData) => api.post('/admin/projects/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateProject: (id: number, data: FormData) => api.put(`/admin/projects/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteProject: (id: number) => api.delete(`/admin/projects/${id}/`),

  getDesigns: () => api.get('/admin/designs/'),
  getDesign: (id: number) => api.get<Design>(`/admin/designs/${id}/`),
  createDesign: (data: FormData) => api.post('/admin/designs/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateDesign: (id: number, data: FormData) => api.put(`/admin/designs/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteDesign: (id: number) => api.delete(`/admin/designs/${id}/`),

  getMiniProjects: () => api.get('/admin/mini-projects/'),
  createMiniProject: (data: FormData) => api.post('/admin/mini-projects/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateMiniProject: (id: number, data: FormData) => api.put(`/admin/mini-projects/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteMiniProject: (id: number) => api.delete(`/admin/mini-projects/${id}/`),

  getReviews: () => api.get('/admin/reviews/'),
  deleteReview: (id: number) => api.delete(`/admin/reviews/${id}/`),

  getFeedback: () => api.get('/admin/feedback/'),
};

export default api;
