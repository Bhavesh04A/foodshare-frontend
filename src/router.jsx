import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardRestaurant from './pages/DashboardRestaurant';
import DashboardNGO from './pages/DashboardNGO';
import DashboardVolunteer from './pages/DashboardVolunteer';
import AddDonation from './pages/AddDonation';
import AiAssistant from './pages/AiAssistant';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ActiveDonations from './pages/ActiveDonations';
import CompletedDonations from './pages/CompletedDonations';

import RestaurantHome from './pages/RestaurantHome';
import NGOHome from './pages/NGOHome';
import VolunteerHome from './pages/VolunteerHome';
import WastePartnerHome from './pages/WastePartnerHome';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'assistant', element: <AiAssistant /> },
      { path: 'analytics', element: <Analytics /> },

      {
        element: <ProtectedRoute allowedRoles={['restaurant']} />,
        children: [{ path: 'home/restaurant', element: <RestaurantHome /> }],
      },
      {
        element: <ProtectedRoute allowedRoles={['ngo']} />,
        children: [{ path: 'home/ngo', element: <NGOHome /> }],
      },
      {
        element: <ProtectedRoute allowedRoles={['volunteer']} />,
        children: [{ path: 'home/volunteer', element: <VolunteerHome /> }],
      },

      {
        element: <ProtectedRoute allowedRoles={['waste_partner']} />,
        children: [{ path: 'home/waste', element: <WastePartnerHome /> }],
      },

      {
        element: <ProtectedRoute allowedRoles={['restaurant','ngo','volunteer']} />,
        children: [
          { path: 'dashboard/restaurant', element: <DashboardRestaurant /> },
          { path: 'dashboard/ngo', element: <DashboardNGO /> },
          { path: 'dashboard/volunteer', element: <DashboardVolunteer /> },
        ],
      },

      {
        element: <ProtectedRoute allowedRoles={['restaurant']} />,
        children: [{ path: 'add-donation', element: <AddDonation /> }],
      },

      {
        element: <ProtectedRoute allowedRoles={['restaurant','ngo','volunteer']} />,
        children: [
          { path: 'donations/active', element: <ActiveDonations /> },
          { path: 'donations/completed', element: <CompletedDonations /> },
        ],
      },

      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
