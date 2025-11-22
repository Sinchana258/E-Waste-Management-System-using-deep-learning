// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../utils/axiosInstance";
import { useAuth } from "../../hooks/useAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      const res = await axios.post("/auth/signup", payload);

      // backend returns { access_token, token_type, user }
      const { access_token, user } = res.data;

      // Hook to set auth state + localStorage
      login({ access_token, user });

      toast.success("Registration successful!");
      setTimeout(() => navigate("/"), 700);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Registration failed";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#E2F0C9] px-4">
      <ToastContainer />
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left panel */}
        <div className="bg-[#BBC863] text-white p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Start New Journey!</h2>
            <p className="opacity-90">
              Create an account to schedule pickups, track bookings, and manage your e-waste.
            </p>
          </div>
          <div className="mt-6 text-sm">
            <p>Already have an account?</p>
            <Link to="/sign-in" className="font-semibold underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Account</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BBC863]"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BBC863]"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BBC863]"
                placeholder="Enter phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BBC863]"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BBC863]"
                required
              />
            </div>

            <label className="flex items-center text-sm gap-2">
              <input type="checkbox" onChange={() => setShowPassword((s) => !s)} />
              Show password
            </label>

            <button
              type="submit"
              className="w-full bg-[#BBC863] text-white font-semibold py-2 rounded-lg mt-2 hover:bg-[#a6b554] transition disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
