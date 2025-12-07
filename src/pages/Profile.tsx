import React, { useEffect, useState } from "react";
import {
  User, Mail, Phone, MapPin, Globe, Edit2, Save, X,
  Camera, Package, Shield, LogOut, Loader2, Lock, ChevronRight
} from "lucide-react";
import { usersAPI, authAPI, storeAPI, getMediaUrl } from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Types
type UserProfile = {
  email: string;
  username: string;
  phone: string;
  city: string;
  country: string;
  bio?: string;
  avatar?: string | null;
  full_name?: string;
};

// Tabs Configuration
const TABS = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "security", label: "Security", icon: Shield },
];

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    city: "",
    country: "",
    bio: "",
    full_name: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && TABS.find(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    usersAPI.getProfile()
      .then((res) => {
        setUser(res.data);
        setFormData({
          username: res.data.username || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          country: res.data.country || "",
          bio: res.data.bio || "",
          full_name: res.data.full_name || "",
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError("Failed to load profile. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let data: any = { ...formData };

      if (avatarFile) {
        const form = new FormData();
        Object.keys(formData).forEach(key => {
          form.append(key, (formData as any)[key]);
        });
        form.append("avatar", avatarFile);
        data = form;
      }

      const res = await usersAPI.updateProfile(data);
      setUser({ ...user!, ...res.data });
      setEditMode(false);
      setAvatarFile(null);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-main-dark">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-main-dark text-center px-4">
      <p className="text-xl text-red-500 font-semibold mb-4">{error}</p>
      <button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition">
        Go to Login
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-main-dark text-gray-100 font-sans relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-secondary animate-shimmer bg-[length:200%_auto]">
              My Account
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Manage your personal info, orders, and security.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-full backdrop-blur-md transition-all hover:border-white/20 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-1/4"
          >
            <div className="bg-card-bg backdrop-blur-xl rounded-2xl border border-card-border overflow-hidden lg:sticky lg:top-24">
              <div className="p-8 flex flex-col items-center border-b border-card-border bg-gradient-to-b from-white/5 to-transparent">
                <div className="relative group mb-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <img
                      src={avatarPreview || user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=0f172a&color=3b82f6`}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  {editMode && (
                    <label className="absolute bottom-0 right-0 bg-primary p-2.5 rounded-full text-white cursor-pointer hover:bg-primary-hover shadow-lg transition-transform hover:scale-110 border border-main-dark">
                      <Camera size={16} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">{user?.username}</h2>
                <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
              </div>

              <nav className="p-4 space-y-1">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
                        ? "text-white shadow-lg shadow-primary/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabBg"
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/5"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <div className="flex items-center gap-3 relative z-10">
                        <Icon size={20} className={isActive ? "text-primary" : ""} />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      {isActive && <ChevronRight size={16} className="text-primary relative z-10" />}
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* MAIN CONTENT AREA */}
          <div className="w-full lg:w-3/4 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card-bg backdrop-blur-xl rounded-2xl border border-card-border p-6 md:p-8 min-h-[500px]"
                >
                  <div className="flex justify-between items-start mb-8 border-b border-card-border pb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Profile Information</h2>
                      <p className="text-gray-400">Update your account details and public profile.</p>
                    </div>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${editMode
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                        : "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-primary/40"
                        }`}
                    >
                      {editMode ? <X size={18} /> : <Edit2 size={18} />}
                      {editMode ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Username</label>
                        {editMode ? (
                          <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-card-border bg-main/50 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                            placeholder="username"
                          />
                        ) : (
                          <div className="flex items-center gap-3 text-lg text-gray-200 p-4 bg-main/30 border border-card-border rounded-lg">
                            <User className="text-primary" size={20} />
                            {user?.username || "Not set"}
                          </div>
                        )}
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Email Address</label>
                        <div className="flex items-center gap-3 text-lg text-gray-200/50 p-4 bg-main/30 border border-card-border rounded-lg cursor-not-allowed">
                          <Mail className="text-primary/50" size={20} />
                          {user?.email}
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Bio</label>
                        {editMode ? (
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Tell us about yourself..."
                            className="w-full px-4 py-3 rounded-lg border border-card-border bg-main/50 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all resize-none placeholder:text-gray-600"
                          />
                        ) : (
                          <div className="text-base text-gray-300 p-4 bg-main/30 border border-card-border rounded-lg min-h-[140px] leading-relaxed">
                            {user?.bio || "No bio added yet."}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Phone Number</label>
                        {editMode ? (
                          <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-card-border bg-main/50 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                            placeholder="+1 (555) 000-0000"
                          />
                        ) : (
                          <div className="flex items-center gap-3 text-lg text-gray-200 p-4 bg-main/30 border border-card-border rounded-lg">
                            <Phone className="text-green-400" size={20} />
                            {user?.phone || "Not set"}
                          </div>
                        )}
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">City</label>
                        {editMode ? (
                          <input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-card-border bg-main/50 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                            placeholder="Tokyo"
                          />
                        ) : (
                          <div className="flex items-center gap-3 text-lg text-gray-200 p-4 bg-main/30 border border-card-border rounded-lg">
                            <MapPin className="text-secondary" size={20} />
                            {user?.city || "Not set"}
                          </div>
                        )}
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Country</label>
                        {editMode ? (
                          <input
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-card-border bg-main/50 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                            placeholder="Japan"
                          />
                        ) : (
                          <div className="flex items-center gap-3 text-lg text-gray-200 p-4 bg-main/30 border border-card-border rounded-lg">
                            <Globe className="text-accent" size={20} />
                            {user?.country || "Not set"}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {editMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-10 flex justify-end"
                    >
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/30 font-bold transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {saving && <Loader2 className="animate-spin" size={20} />}
                        {saving ? "Saving Changes..." : "Save Changes"}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === "orders" && (
                <OrdersTab />
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card-bg backdrop-blur-xl rounded-2xl border border-card-border p-8 min-h-[500px]"
                >
                  <h2 className="text-2xl font-bold text-white mb-8 border-b border-card-border pb-4">Security Settings</h2>
                  <div className="space-y-6 max-w-2xl">
                    <ChangePasswordForm />
                    {/* Placeholder for future security settings */}
                    <div className="p-6 border border-card-border rounded-xl bg-white/5 opacity-50 cursor-not-allowed">
                      <h3 className="text-lg font-bold text-gray-300 mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Coming soon to enhance your account security.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordForm() {
  const [passwords, setPasswords] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await authAPI.changePassword({
        old_password: passwords.old_password,
        new_password: passwords.new_password
      });
      toast.success("Password updated successfully");
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.old_password?.[0] || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-card-border rounded-xl bg-white/5">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Lock size={20} className="text-primary" />
        Change Password
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1 ml-1">Current Password</label>
          <input
            type="password"
            name="old_password"
            value={passwords.old_password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-main/50 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1 ml-1">New Password</label>
          <input
            type="password"
            name="new_password"
            value={passwords.new_password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-main/50 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1 ml-1">Confirm New Password</label>
          <input
            type="password"
            name="confirm_password"
            value={passwords.confirm_password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-main/50 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none"
          />
        </div>
        <button
          disabled={loading}
          className="mt-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-hover disabled:opacity-70 flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-primary/20"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          Update Password
        </button>
      </form>
    </div>
  );
}

function OrdersTab() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await storeAPI.getOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders", error);
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = (order: any) => {
    try {
      const doc = new jsPDF();

      // --- Header Section ---
      // Company Logo/Name
      doc.setFontSize(24);
      doc.setTextColor(59, 130, 246); // Primary Blue
      doc.text("NOVA WORKS", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Professional Digital Solutions", 14, 26);
      doc.text("contact@novaworks.com", 14, 31);

      // Invoice Label & Details
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(20);
      doc.text("INVOICE", 196, 20, { align: "right" });

      doc.setFontSize(10);
      doc.text(`Invoice #: ${order.order_id}`, 196, 30, { align: "right" });
      doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 196, 35, { align: "right" });
      doc.text(`Status: ${order.status}`, 196, 40, { align: "right" });

      // --- Bill To Section ---
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 14, 50);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(order.full_name || "Valued Customer", 14, 56);
      doc.text(order.email, 14, 61);
      if (order.phone) doc.text(order.phone, 14, 66);
      if (order.city && order.country) doc.text(`${order.city}, ${order.country}`, 14, 71);

      // --- Items Table ---
      const tableColumn = ["Item Description", "Type", "Quantity", "Price", "Total"];
      const tableRows: any[] = [];

      order.items.forEach((item: any) => {
        const itemData = [
          item.project_title,
          "Digital Product",
          item.quantity,
          `${order.currency} ${item.price || '0.00'}`,
          `${order.currency} ${((item.price || 0) * item.quantity).toFixed(2)}`
        ];
        tableRows.push(itemData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 4 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
      });

      // --- Total Section ---
      const finalY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Subtotal:", 140, finalY);
      doc.text(`${order.currency} ${order.amount}`, 196, finalY, { align: "right" });

      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text("Total:", 140, finalY + 10);
      doc.text(`${order.currency} ${order.amount}`, 196, finalY + 10, { align: "right" });

      // Footer
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150);
      doc.text("Thank you for your business. This is a computer-generated invoice.", 105, 280, { align: "center" });

      doc.save(`NovaWorks_Invoice_${order.order_id}.pdf`);
      toast.success("Invoice downloaded successfully");

    } catch (err) {
      console.error("Invoice generation failed", err);
      toast.error("Failed to generate invoice");
    }
  };

  if (loading) return (
    <div className="bg-card-bg backdrop-blur-xl rounded-2xl border border-card-border p-8 min-h-[500px] flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (orders.length === 0) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card-bg backdrop-blur-xl rounded-2xl border border-card-border p-8 min-h-[500px] flex flex-col items-center justify-center text-center"
    >
      <div className="bg-white/5 p-6 rounded-full mb-6 border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
        <Package size={64} className="text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No Orders Yet</h3>
      <p className="text-gray-400 max-w-md">You haven't placed any orders yet. Browse our projects and services to get started!</p>
      <button onClick={() => navigate('/')} className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 text-primary border border-primary/20 rounded-xl transition-all hover:border-primary/50">
        Browse Store
      </button>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg backdrop-blur-xl rounded-2xl border border-card-border p-8 min-h-[500px]"
    >
      <h2 className="text-2xl font-bold text-white mb-8 border-b border-card-border pb-4">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-card-border rounded-xl bg-white/5 p-6 transition-all hover:border-primary/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="text-sm text-gray-400">Order ID: <span className="text-white font-mono">{order.order_id}</span></p>
                <p className="text-xs text-slate-500 mt-1">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                  {order.status}
                </span>
                <span className="text-xl font-bold text-white">{order.currency} {order.amount}</span>
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 bg-black/20 p-3 rounded-lg">
                  <img
                    src={getMediaUrl(item.project_image) || '/placeholder.png'}
                    alt={item.project_title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.project_title}</h4>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {/* Individual item price is generic, amount is total */}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => generateInvoice(order)}
                className="text-sm text-primary hover:text-primary-hover underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Package size={16} />
                Download Professional Invoice (PDF)
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
