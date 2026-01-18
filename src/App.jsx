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
      const role = user.role;
      let homePath;

      switch (role) {
        case 'restaurant':
          homePath = '/home/restaurant';
          break;
        case 'ngo':
          homePath = '/home/ngo';
          break;
        case 'volunteer':
          homePath = '/home/volunteer';
          break;
        case 'waste_partner':               // ✅ NEW
          homePath = '/dashboard/waste-partner';
          break;
        default:
          homePath = '/';
      }

      if (homePath !== '/') {
        navigate(homePath, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, location.pathname]);

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