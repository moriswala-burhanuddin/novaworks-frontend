import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartAPI, Cart as CartType, getMediaUrl } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart();
      // Actually, we need to modify api.ts to send the header globally or per request. 
      // But let's fetch it first.
      setCart(res.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Temporary fix: Add interceptor here or rely on global fix. 
    // I will fix api.ts in next step to handle headers properly.
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      await cartAPI.updateCartItem(itemId, newQuantity);
      fetchCart(); // Refresh
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await cartAPI.removeFromCart(itemId);
      toast.success('Item removed');
      fetchCart();
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <div className="min-h-screen bg-black pt-24 text-white flex justify-center">Loading...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-20 text-white flex flex-col items-center justify-center">
        <ShoppingBag size={64} className="text-gray-700 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/projects" className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition">
          Browse Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart ({cart.count})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm relative group">
                <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                  <img
                    src={getMediaUrl(item.project.thumbnail)}
                    alt={item.project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{item.project.title}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{item.project.category.name}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-black/50 rounded-lg p-1 border border-white/10">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-white/10 rounded transition"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white/10 rounded transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-xl font-bold">
                      {formatPrice(
                        (item.project.price_inr * (1 - item.project.discount_percentage / 100)) * item.quantity,
                        (item.project.price_usd * (1 - item.project.discount_percentage / 100)) * item.quantity
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>
                    {cart && formatPrice(
                      cart.items.reduce((acc, item) => acc + (item.project.price_inr * (1 - item.project.discount_percentage / 100) * item.quantity), 0),
                      cart.items.reduce((acc, item) => acc + (item.project.price_usd * (1 - item.project.discount_percentage / 100) * item.quantity), 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>
                    {cart && formatPrice(
                      cart.items.reduce((acc, item) => acc + (item.project.price_inr * (1 - item.project.discount_percentage / 100) * item.quantity), 0),
                      cart.items.reduce((acc, item) => acc + (item.project.price_usd * (1 - item.project.discount_percentage / 100) * item.quantity), 0)
                    )}
                  </span>
                </div>
              </div>
              <Link to="/checkout" className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
