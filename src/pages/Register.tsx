import { useState } from "react";
import { authAPI } from "../services/api";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authAPI.register(form);
      toast.success("Account created! Please check your email to verify your account.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.email?.[0] || err.response?.data?.detail || "Registration failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          name="full_name"
          placeholder="Full Name"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
          {loading ? "Creating..." : "Register"}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link></p>
        </div>
      </form>
    </div>
  );
}
