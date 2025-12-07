import { useState, useEffect } from 'react';
import { ShoppingCart, User as UserIcon, ChevronDown, Menu, X, Sparkles, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Projects', path: '/projects' },
    { label: 'Designs', path: '/designs' },
    { label: 'Mini Projects', path: '/mini-projects' },
    { label: 'Code Library', path: '/code-library' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'py-3 bg-main/80 backdrop-blur-md border-b border-white/5 shadow-xl shadow-black/20'
          : 'py-5 bg-transparent border-b border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center space-x-3 group relative z-50">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-500" />
                <div className="relative bg-white/5 border border-white/10 p-2 rounded-xl backdrop-blur-sm group-hover:border-primary/50 transition-colors">
                  <Sparkles size={20} className="text-primary" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Nova<span className="text-primary">Works</span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-sm">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="bubble"
                        className="absolute inset-0 bg-white/10 rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-4">
              {/* CART - Visible on Mobile too now */}
              <Link
                to="/cart"
                className="relative p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/10"
              >
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-primary text-[10px] w-5 h-5 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-main"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* DESKTOP AUTH */}
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.full_name || user?.username || 'User'}&background=random`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border border-white/10"
                      />
                      <span className="text-sm font-medium text-gray-200 group-hover:text-white max-w-[100px] truncate">
                        {user?.full_name || user?.username || 'User'}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-4 w-60 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5"
                        >
                          <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                            <p className="text-sm font-semibold text-white">{user?.full_name || user?.username}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                          </div>
                          <div className="p-2 space-y-1">
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            >
                              <UserIcon size={16} /> My Profile
                            </Link>
                            <Link
                              to="/profile?tab=orders"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            >
                              <Package size={16} /> My Orders
                            </Link>
                            {user?.is_superuser && (
                              <Link
                                to="/admin"
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-colors font-medium border border-blue-500/10"
                              >
                                <LayoutDashboard size={16} /> Admin Panel
                              </Link>
                            )}
                          </div>
                          <div className="border-t border-white/5 p-2">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                            >
                              <LogOut size={16} /> Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-all shadow-lg shadow-white/10"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* MOBILE MENU BTN */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-white/5 text-gray-300 hover:text-white transition-colors relative z-50 border border-transparent hover:border-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY - Moved outside motion.nav to avoid transform stacking context issues */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 bg-[#020617] z-40 md:hidden overflow-y-auto pt-24"
          >
            <div className="flex flex-col p-6 space-y-1">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`block py-3 px-4 rounded-xl text-base font-light tracking-wide transition-all ${location.pathname === link.path
                      ? 'bg-primary/10 text-primary font-normal'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                    >
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
                        className="w-8 h-8 rounded-full border border-white/10"
                        alt=""
                      />
                      <div className="flex-1">
                        <span className="block text-sm font-medium text-white">{user?.username}</span>
                        <span className="block text-xs text-gray-500">{user?.email}</span>
                      </div>
                      <UserIcon size={18} className="text-gray-500" />
                    </Link>
                    <Link
                      to="/profile?tab=orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Package size={16} />
                      </div>
                      <span className="text-sm font-medium">My Orders</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                        <LogOut size={16} />
                      </div>
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3 text-center rounded-xl text-white font-medium border border-white/10 hover:bg-white/5 transition-colors text-sm"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3 text-center bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-colors text-sm shadow-lg shadow-white/5"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
