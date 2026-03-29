import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const baseUrl = import.meta.env.VITE_BACKEND_URL;

        // Fetch all data in parallel
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get(`${baseUrl}/api/user`, config).catch(() => ({ data: { list: [] } })),
          axios.get(`${baseUrl}/api/product`, config).catch(() => ({ data: { products: [] } })),
          axios.get(`${baseUrl}/api/order`, config).catch(() => ({ data: [] }))
        ]);

        // The exact structure depends on the backend controllers, but we guess list or array
        const usersCount = Array.isArray(usersRes.data) ? usersRes.data.length : (usersRes.data.list?.length || 0);
        const productsCount = Array.isArray(productsRes.data) ? productsRes.data.length : (productsRes.data.products?.length || usersRes.data.list?.length || 0);
        const rawOrders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.orders || []);
        // Only count Active orders (Pending, Processing)
        const activeOrders = rawOrders.filter(order => order.status !== "Delivered" && order.status !== "Cancelled");
        const ordersCount = activeOrders.length;

        setStats({
          users: usersCount,
          products: productsCount,
          orders: ordersCount
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center transition-colors">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {loading ? <span className="animate-pulse">--</span> : stats.users}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center transition-colors">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {loading ? <span className="animate-pulse">--</span> : stats.products}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center transition-colors">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Orders</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {loading ? <span className="animate-pulse">--</span> : stats.orders}
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
        <p className="text-gray-500 dark:text-gray-400">Activity stream will appear here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
