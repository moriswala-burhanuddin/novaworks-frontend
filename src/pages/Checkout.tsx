import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import { Address } from '../types';
import { usersAPI, storeAPI, cartAPI } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  // Removed useScrollAnimation to prevent visibility issues
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { currency, loading: currencyLoading } = useCurrency(); // Use global currency

  // ... (rest of state and logic unchanged)

  const [formData, setFormData] = useState<Address>({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const priceInr = item.project.price_inr * (1 - item.project.discount_percentage / 100);
      const priceUsd = item.project.price_usd * (1 - item.project.discount_percentage / 100);
      const price = currency === 'INR' ? priceInr : priceUsd;
      return acc + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateTotal();
  const tax = 0;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    checkAuthAndLoadData();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const checkAuthAndLoadData = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Please login to checkout");
      navigate('/login?next=/checkout');
      return;
    }

    try {
      setLoading(true);
      const profileRes = await usersAPI.getProfile();
      const profile = profileRes.data;

      setFormData({
        name: profile.full_name || profile.username || '',
        email: profile.email || '',
        phone: profile.phone || '',
        street: profile.city || '',
        city: profile.city || '',
        state: '',
        zipCode: '',
        country: profile.country || '',
      });

      const cartRes = await cartAPI.getCart();
      if (cartRes.data && cartRes.data.items) {
        setCartItems(cartRes.data.items);
      } else {
        toast.error("Your cart is empty");
        navigate('/');
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await usersAPI.updateProfile({
        full_name: formData.name,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
      });

      const orderRes = await storeAPI.createRazorpayOrder();
      const { order_id, amount, key_id, currency: orderCurrency, description, user_name, user_email, user_contact } = orderRes.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: orderCurrency,
        name: "Nova Works",
        description: description,
        image: "/logo.png",
        order_id: order_id,
        handler: async function (response: any) {
          console.log("Payment Successful", response);
          setVerifying(true);
          try {
            // Verify Payment
            const res = await storeAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            // Redirect to Secure Download Page with Order ID
            if (res.data && res.data.order_id) {
              navigate(`/downloads/${res.data.order_id}`);
            } else {
              navigate('/payment-success'); // Fallback
            }
          } catch (error) {
            console.error("Verification Failed", error);
            toast.error("Payment successful but verification failed. Please contact support.");
            navigate('/payment-success');
          } finally {
            setVerifying(false);
          }
        },
        prefill: {
          name: user_name,
          email: user_email,
          contact: user_contact
        },
        theme: {
          color: "#3b82f6"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        toast.error(response.error.description || "Payment Failed");
      });
      rzp1.open();

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to initiate payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading || currencyLoading || verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        {verifying && <p className="text-white text-lg font-medium animate-pulse">Verifying Payment, please do not close this window...</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-24 relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-[600px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-slate-400 hover:text-white font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#0f172a] rounded-3xl shadow-2xl border border-white/10 p-8 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-white mb-6">Billing Details</h2>

              <form id="checkout-form" onSubmit={handlePayment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="p-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="p-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="p-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="p-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="p-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="p-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="p-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />

                {/* Mobile Pay Button (Visible on small screens) */}
                <button
                  type="submit"
                  disabled={processing}
                  className="md:hidden w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-6"
                >
                  {processing ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
                  {processing ? "Processing..." : `Pay ${currency} ${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="transition-all duration-700 delay-100 animate-fade-in-up">
            <div className="bg-[#0f172a] rounded-3xl shadow-2xl border border-white/10 p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{currency} {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-400">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  {currency} {total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => document.getElementById('checkout-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                disabled={processing}
                className="hidden md:flex w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all items-center justify-center gap-2 transform active:scale-95"
              >
                {processing ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
                {processing ? "Processing..." : "Pay Now"}
              </button>

              <p className="text-xs text-center text-slate-500 mt-4">
                Secure payments powered by Razorpay.
                Your information is encrypted and safe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
