import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { login } from '../services/authService';

// Demo credentials for each role
const DEMO_CREDENTIALS = {
  restaurant: {
    email: 'demo_restaurant@foodshare.com',
    password: 'demo123',
    description: 'Test restaurant features like creating donations, tracking impact, and managing food surplus.'
  },
  ngo: {
    email: 'demo_ngo@foodshare.com',
    password: 'demo123', 
    description: 'Explore NGO features like accepting donations, managing volunteers, and viewing distribution analytics.'
  },
  volunteer: {
    email: 'demo_volunteer@foodshare.com',
    password: 'demo123',
    description: 'Try volunteer features like accepting delivery tasks, QR confirmations, and tracking your impact.'
  },
  waste_partner: {
    email: 'demo_waste@foodshare.com',
    password: 'demo123',
    description: 'Test waste partner features like recycling expired food and QR-based pickups.'
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get role from URL parameters
  useEffect(() => {
    const role = searchParams.get('role');
    if (role && DEMO_CREDENTIALS[role]) {
      setSelectedRole(role);
      setEmail(DEMO_CREDENTIALS[role].email);
      setPassword(DEMO_CREDENTIALS[role].password);
    }
  }, [searchParams]);

  const getDashboardPath = (role) => {
    switch (role) {
      case 'restaurant': return '/dashboard/restaurant';
      case 'ngo': return '/dashboard/ngo';
      case 'volunteer': return '/dashboard/volunteer';
      case 'waste_partner': return '/home/waste';
      default: return '/';
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields.');

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Invalid credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
    
    setTimeout(() => {
      document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <AuthLayout title={selectedRole ? `Login as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` : "Login to FoodShare"}>
      
      {/* Role Selection Cards */}
      {!selectedRole && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Choose your role to continue</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(DEMO_CREDENTIALS).map(([role, creds]) => (
              <div
                key={role}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
                  selectedRole === role 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                <div className="text-2xl mb-2">
                  {role === 'restaurant' && '🏪'}
                  {role === 'ngo' && '🤝'}
                  {role === 'volunteer' && '🚗'}
                  {role === 'waste_partner' && '♻️'}
                </div>
                <h4 className="font-semibold capitalize text-gray-800">{role}</h4>
                <p className="text-xs text-gray-600 mt-1">Click to auto-fill demo credentials</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demo Credentials Banner */}
      {selectedRole && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 text-lg">💡</div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 text-sm">Demo Mode: {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</h4>
              <p className="text-blue-600 text-xs mt-1">{DEMO_CREDENTIALS[selectedRole].description}</p>
              <div className="mt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-700 font-medium">Email:</span>
                  <span className="text-blue-600">{DEMO_CREDENTIALS[selectedRole].email}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-blue-700 font-medium">Password:</span>
                  <span className="text-blue-600">{DEMO_CREDENTIALS[selectedRole].password}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            className="input-field" 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            className="input-field" 
            type="password" 
            placeholder="Enter your password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          {selectedRole ? `Login as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` : 'Sign In'}
        </Button>

        {/* Quick Demo Login Buttons */}
        {!selectedRole && (
          <div className="mt-4">
            <p className="text-center text-sm text-gray-600 mb-3">Or try quick demo:</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(DEMO_CREDENTIALS).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleDemoLogin(role)}
                  className="py-2 px-3 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors capitalize"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:underline font-semibold">
          Register here
        </Link>
      </p>

      {/* Change Role Link */}
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