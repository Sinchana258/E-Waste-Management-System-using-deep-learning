// src/pages/SignInPage.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../utils/axiosInstance";
import { useAuth } from "../hooks/useAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromPath = location?.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Backend returns: { access_token, token_type, user }
      const { access_token, user } = res.data;

      // Save token + user via auth hook
      login({ access_token, user });

      toast.success("Welcome back!");
      // Small delay to show toast
      setTimeout(() => {
        navigate(fromPath, { replace: true });
      }, 500);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Invalid email or password.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E2F0C9] flex items-center justify-center px-4">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT — Sign In Form */}
        <div className="px-10 py-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>
          <p className="text-gray-600 mt-2 mb-8">Sign in to continue your E-Cycle journey.</p>

          <form className="space-y-5" onSubmit={submit}>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="w-full bg-[#F5F7EB] mt-1 px-4 py-2 rounded-lg outline-none"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                className="w-full bg-[#F5F7EB] mt-1 px-4 py-2 rounded-lg outline-none"
                placeholder="••••••••"
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#BBC863] text-white py-2 rounded-lg font-semibold hover:bg-[#a8b456] transition disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* RIGHT — Light Green Welcome Panel */}
        <div className="relative bg-gradient-to-br from-[#BBC863] to-[#8DA23F] text-white flex flex-col items-center justify-center p-10">
          <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
          <p className="text-white/90 mb-6 text-center">
            We're happy to see you again. Continue managing your e-waste responsibly.
          </p>

          <p className="text-xs tracking-wide uppercase mb-3">New here?</p>

          <Link
            to="/sign-up"
            className="bg-white text-[#8DA23F] font-semibold px-6 py-2 rounded-full shadow hover:bg-[#F0F3E0] transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
