import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { login } from '../services/authService';

/* ---------------- DEMO CREDENTIALS ---------------- */
const DEMO_CREDENTIALS = {
  restaurant: {
    email: 'demo_restaurant@foodshare.com',
    password: 'demo123',
    description:
      'Test restaurant features like creating donations, tracking impact, and managing food surplus.'
  },
  ngo: {
    email: 'demo_ngo@foodshare.com',
    password: 'demo123',
    description:
      'Explore NGO features like accepting donations, managing volunteers, and viewing distribution analytics.'
  },
  volunteer: {
    email: 'demo_volunteer@foodshare.com',
    password: 'demo123',
    description:
      'Try volunteer features like accepting delivery tasks, QR confirmations, and tracking your impact.'
  },
  waste_partner: {
    email: 'demo_waste@foodshare.com',
    password: 'demo123',
    description:
      'Collect expired food and convert it into organic fertilizer instead of sending it to landfills.'
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* ---------------- AUTO SELECT ROLE FROM URL ---------------- */
  useEffect(() => {
    const role = searchParams.get('role');
    if (role && DEMO_CREDENTIALS[role]) {
      setSelectedRole(role);
      setEmail(DEMO_CREDENTIALS[role].email);
      setPassword(DEMO_CREDENTIALS[role].password);
    }
  }, [searchParams]);

  /* ---------------- DASHBOARD REDIRECT ---------------- */
  const getDashboardPath = (role) => {
    switch (role) {
      case 'restaurant':
        return '/dashboard/restaurant';
      case 'ngo':
        return '/dashboard/ngo';
      case 'volunteer':
        return '/dashboard/volunteer';
      case 'waste_partner':
        return '/dashboard/waste-partner';
      default:
        return '/';
    }
  };

  /* ---------------- ROLE SELECT ---------------- */
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
  };

  /* ---------------- LOGIN ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields.');
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (error) {
      const message =
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
          ? error.response.data.message
          : 'Login failed. Invalid credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={
        selectedRole
          ? `Login as ${selectedRole.replace('_', ' ').toUpperCase()}`
          : 'Login to FoodShare'
      }
    >
      {/* ================= ROLE SELECTION ================= */}
      {!selectedRole && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
            Choose your role to continue
          </h3>

          <p className="text-sm text-gray-600 text-center mb-6">
            Click a role to auto-fill demo credentials
          </p>

          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            {Object.keys(DEMO_CREDENTIALS).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className="
                  h-32
                  flex flex-col
                  items-center
                  justify-center
                  gap-3
                  border-2
                  rounded-xl
                  bg-white
                  border-gray-200
                  transition-all
                  hover:border-teal-400
                  hover:shadow-md
                  focus:outline-none
                "
              >
                <div className="text-4xl">
                  {role === 'restaurant' && '🏪'}
                  {role === 'ngo' && '🤝'}
                  {role === 'volunteer' && '🚗'}
                  {role === 'waste_partner' && '♻️'}
                </div>

                <span className="font-semibold text-gray-800 capitalize">
                  {role.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* ================= END ROLE SELECTION ================= */}

      {/* DEMO INFO */}
      {selectedRole && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 text-sm mb-1">
            Demo Mode: {selectedRole.replace('_', ' ').toUpperCase()}
          </h4>
          <p className="text-blue-600 text-xs">
            {DEMO_CREDENTIALS[selectedRole].description}
          </p>
        </div>
      )}

      {/* LOGIN FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            className="input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          {selectedRole
            ? `Login as ${selectedRole.replace('_', ' ')}`
            : 'Sign In'}
        </Button>
      </form>

      {/* REGISTER */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-primary hover:underline font-semibold"
        >
          Register here
        </Link>
      </p>

      {/* CHANGE ROLE */}
      {selectedRole && (
        <p className="mt-4 text-center text-sm text-gray-600">
          Want to try a different role?{' '}
          <button
            onClick={() => setSelectedRole(null)}
            className="text-primary hover:underline font-semibold"
          >
            Choose another role
          </button>
        </p>
      )}
    </AuthLayout>
  );
}