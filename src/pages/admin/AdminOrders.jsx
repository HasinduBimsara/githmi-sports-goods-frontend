import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      
      const response = await axios.get(`${baseUrl}/api/order`, config);
      const data = response.data.orders || response.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.put(`${baseUrl}/api/order/${orderId}`, { status: newStatus }, config);
      toast.success(`Order ${orderId} marked as ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    Processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    Delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Orders Management</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="p-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">{order.orderId}</td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      <div>{order.name}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(order.date || order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">${order.total}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
