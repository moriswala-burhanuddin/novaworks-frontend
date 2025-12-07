import { useState } from "react";
import { authAPI } from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authAPI.requestPasswordReset(email);
            setSubmitted(true);
            toast.success("Reset link sent!");
        } catch (err: any) {
            toast.error("Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex justify-center items-center px-4 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-purple-600/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-[600px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
                        <p className="text-slate-400">Enter your email and we'll send you a recovery link</p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all font-medium"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Reset Link
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                            <h3 className="font-bold text-lg mb-2">Check your email</h3>
                            <p className="text-sm opacity-80">We have sent a password reset link to <br /> <strong className="text-white">{email}</strong></p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-sm underline mt-4 hover:text-white"
                            >
                                Try different email
                            </button>
                        </div>
                    )}

                    <div className="text-center mt-8 pt-8 border-t border-white/5">
                        <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
