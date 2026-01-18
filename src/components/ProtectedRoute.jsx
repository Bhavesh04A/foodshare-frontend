import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, token } = useAuthStore();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    // Token missing → redirect
    if (!token) {
      toast.error("You need to log in to access this page.");
      setAllowed(false);
      return;
    }

    // User not yet loaded → wait
    if (!user) {
      return;
    }

    // Role mismatch → redirect
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      toast.error("No permission to access this page.");
      setAllowed(false);
      return;
    }

    setAllowed(true);
  }, [user, token]);

  if (allowed === null) return null; // wait until checks finish

  return allowed ? <Outlet /> : <Navigate to="/login" replace />;
}