import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Designs from './pages/Designs';
import DesignDetail from './pages/DesignDetail';
import MiniProjects from './pages/MiniProjects';
import MiniProjectDetail from './pages/MiniProjectDetail';
import CodeLibrary from './pages/CodeLibrary';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import ProjectDetails from './pages/ProjectDetails';
import PaymentSuccess from './pages/PaymentSuccess';
import DownloadPage from './pages/DownloadPage';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProjects from './pages/admin/AdminProjects';
import AdminDesigns from './pages/admin/AdminDesigns';
import AdminMiniProjects from './pages/admin/AdminMiniProjects';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminRoute from './components/AdminRoute';


import WebsiteLayout from './layouts/WebsiteLayout';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-transparent flex flex-col">
              <Toaster position="top-center" richColors />

              <Routes>
                {/* Public Website Routes */}
                <Route element={<WebsiteLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
                  <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:slug" element={<ProjectDetails />} />
                  <Route path="/designs" element={<Designs />} />
                  <Route path="/designs/:slug" element={<DesignDetail />} />
                  <Route path="/mini-projects" element={<MiniProjects />} />
                  <Route path="/mini-projects/:slug" element={<MiniProjectDetail />} />
                  <Route path="/code-library" element={<CodeLibrary />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/downloads/:orderId" element={<DownloadPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Admin Routes (No Navbar/Footer) */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="designs" element={<AdminDesigns />} />
                    <Route path="mini-projects" element={<AdminMiniProjects />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="feedback" element={<AdminFeedback />} />
                    <Route index element={<AdminDashboard />} /> {/* Default to dashboard */}
                  </Route>
                </Route>
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
