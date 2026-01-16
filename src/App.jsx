import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuthStore } from './store/authStore';

export default function App() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      user &&
      (location.pathname === '/login' ||
        location.pathname === '/register' ||
        location.pathname === '/')
    ) {
      let homePath = '/';

      switch (user.role) {
        case 'restaurant':
          homePath = '/home/restaurant';
          break;
        case 'ngo':
          homePath = '/home/ngo';
          break;
        case 'volunteer':
          homePath = '/home/volunteer';
          break;
        case 'waste_partner':
          homePath = '/home/waste';
          break;
        default:
          homePath = '/';
      }

      if (homePath !== '/') {
        navigate(homePath, { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
