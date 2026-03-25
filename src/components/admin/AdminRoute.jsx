import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in as an admin to access this page.");
        setIsAdmin(false);
        return;
      }

      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${baseUrl}/api/user/current`, config);
        
        if (response.data && response.data.user && response.data.user.role === "admin") {
          setIsAdmin(true);
        } else {
          toast.error("Access denied. Admin privileges required.");
          setIsAdmin(false);
        }
      } catch (error) {
        toast.error("Session expired or unauthorized. Please login again.");
        localStorage.removeItem("token");
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  // Show a loading spinner while checking auth status
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
      </div>
    );
  }

  // If validated as admin, render the nested routes (AdminLayout), else redirect to login
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
