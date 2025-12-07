import { useState } from "react";
import { authAPI } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authAPI.login(email, password);
      // Use the global login function to update context
      login(res.data.access, res.data.user);
      navigate("/profile");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to continue to your dashboard</p>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center">{error}</div>}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div className="space-y-1">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline font-medium">Forgot Password?</Link>
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30 disabled:opacity-70"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="text-center pt-2">
          <p className="text-gray-600">
            Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
          </p>
        </div>

      </form>
    </div>
  );
}
