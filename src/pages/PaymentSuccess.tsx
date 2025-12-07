import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // Optional: Clear cart logic here if not handled by backend
        // But usually backend clears on webhook or verification
        // For now, we assume simple success flow.
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-gray-700"
            >
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                        className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle size={48} className="text-green-500" />
                    </motion.div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Payment Successful!</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Thank you for your purchase. Your order has been placed successfully and a confirmation email is on its way.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/store/orders')} // Assuming orders page exists or will exist
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingBag size={20} />
                        View My Orders
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
