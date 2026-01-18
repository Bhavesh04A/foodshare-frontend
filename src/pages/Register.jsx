import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { register } from '../services/authService';
import { motion } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '',
    email: '',
    password: '',
    role: 'restaurant',
    pinCode: '',
    zone: 'A'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------- DASHBOARD REDIRECT ---------------- */
  const getDashboardPath = (role) => {
    switch (role) {
      case 'restaurant':
        return '/dashboard/restaurant';
      case 'ngo':
        return '/dashboard/ngo';
      case 'volunteer':
        return '/dashboard/volunteer';
      case 'waste_partner':                    // ✅ NEW
        return '/dashboard/waste-partner';
      default:
        return '/';
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !form.name ||
        !form.email ||
        !form.password ||
        !form.role ||
        !form.pinCode
      ) {
        toast.error("Please fill all required fields.");
        setLoading(false);
        return;
      }

      const user = await register(form);
      toast.success('🎉 Registration successful! Welcome to FoodShare.');
      navigate(getDashboardPath(user.role), { replace: true });

    } catch (error) {
      const message =
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
          ? error.response.data.message
          : 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ROLE DESCRIPTIONS ---------------- */
  const roleDescriptions = {
    restaurant: "Share surplus food from your establishment",
    ngo: "Receive and distribute food to communities",
    volunteer: "Help with food collection and delivery",
    waste_partner: "Collect expired food for organic recycling ♻️" // ✅ NEW
  };

  return (
    <AuthLayout title="Join FoodShare Community">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              name="name"
              className="input-field border-2 border-gray-300 focus:border-teal-500 rounded-xl"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              name="email"
              type="email"
              className="input-field border-2 border-gray-300 focus:border-teal-500 rounded-xl"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              name="password"
              type="password"
              className="input-field border-2 border-gray-300 focus:border-teal-500 rounded-xl"
              placeholder="Create a secure password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* PIN + ZONE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN Code *
              </label>
              <input
                name="pinCode"
                className="input-field border-2 border-gray-300 focus:border-teal-500 rounded-xl"
                placeholder="e.g., 400001"
                value={form.pinCode}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone
              </label>
              <select
                name="zone"
                className="input-field border-2 border-gray-300 focus:border-teal-500 rounded-xl"
                value={form.zone}
                onChange={handleChange}
              >
                <option value="A">Zone A</option>
                <option value="B">Zone B</option>
                <option value="C">Zone C</option>
                <option value="D">Zone D</option>
              </select>
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to join as:
            </label>
            <select
              name="role"
              className="input-field border-2 border-gray-300 focus:border-teal-500 rounded-xl"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="restaurant">🍽️ Restaurant / Food Donor</option>
              <option value="ngo">🤝 NGO / Food Receiver</option>
              <option value="volunteer">🚗 Volunteer / Delivery Helper</option>
              <option value="waste_partner">♻️ Waste Processing Partner</option> {/* ✅ NEW */}
            </select>

            <p className="text-sm text-gray-500 mt-1">
              {roleDescriptions[form.role]}
            </p>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            loading={loading}
            className="w-full rounded-xl text-lg py-3"
          >
            🚀 Create My Account
          </Button>
        </form>

        {/* LOGIN LINK */}
        <motion.p
          className="mt-6 text-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-500 hover:text-teal-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}