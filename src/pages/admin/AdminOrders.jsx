import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const STATUSES = [
  {
    key: "Pending",
    icon: "🕐",
    activeTab: "bg-yellow-400 text-white border-yellow-400",
    inactiveTab: "text-yellow-600 border-transparent hover:border-yellow-300 dark:text-yellow-400",
    badge: "bg-yellow-400 text-white",
    rowBadge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    moveBtn: "border-yellow-300 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 dark:text-yellow-400",
  },
  {
    key: "Processing",
    icon: "⚙️",
    activeTab: "bg-blue-500 text-white border-blue-500",
    inactiveTab: "text-blue-600 border-transparent hover:border-blue-300 dark:text-blue-400",
    badge: "bg-blue-500 text-white",
    rowBadge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    moveBtn: "border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400",
  },
  {
    key: "Delivered",
    icon: "✅",
    activeTab: "bg-green-500 text-white border-green-500",
    inactiveTab: "text-green-600 border-transparent hover:border-green-300 dark:text-green-400",
    badge: "bg-green-500 text-white",
    rowBadge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    moveBtn: "border-green-300 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 dark:text-green-400",
  },
  {
    key: "Cancelled",
    icon: "❌",
    activeTab: "bg-red-500 text-white border-red-500",
    inactiveTab: "text-red-600 border-transparent hover:border-red-300 dark:text-red-400",
    badge: "bg-red-500 text-white",
    rowBadge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    moveBtn: "border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400",
  },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${baseUrl}/api/order`, config);
      const data = response.data.orders || response.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch {
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
      toast.success(`Order moved to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to remove order ${orderId}? It will no longer show in the dashboard or user history.`)) return;
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      await axios.delete(`${baseUrl}/api/order/${orderId}`, config);
      toast.success("Order removed successfully");
      fetchOrders();
    } catch (error) {
      console.error("Remove order failed:", error);
      const msg = error.response?.data?.message || error.message || "Failed to remove order";
      toast.error(msg);
    }
  };

  const activeCfg = STATUSES.find((s) => s.key === activeTab);
  const visibleOrders = orders.filter((o) => o.status === activeTab);
  const otherStatuses = STATUSES.filter((s) => s.key !== activeTab);

  return (
    <div className="space-y-0">
      {/* ── Page header ── */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 px-5 py-4 rounded-t-2xl border border-gray-100 dark:border-gray-700 border-b-0">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Orders Management</h2>
        <span className="text-sm text-gray-400">{orders.length} total order{orders.length !== 1 ? "s" : ""}</span>
      </div>

      {/* ── Tab navbar ── */}
      <div className="bg-white dark:bg-gray-800 border-x border-gray-100 dark:border-gray-700 px-4">
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
          {STATUSES.map((cfg) => {
            const count = orders.filter((o) => o.status === cfg.key).length;
            const isActive = activeTab === cfg.key;
            return (
              <button
                key={cfg.key}
                onClick={() => setActiveTab(cfg.key)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 -mb-px
                  ${isActive ? cfg.activeTab : cfg.inactiveTab}
                `}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.key}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${isActive ? "bg-white/30" : cfg.badge}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-b-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-16 text-gray-400">Loading…</div>
        ) : visibleOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
            <span className="text-4xl">{activeCfg.icon}</span>
            <p className="text-sm">No {activeTab.toLowerCase()} orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Move To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {visibleOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="p-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {order.orderId}
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="font-medium">{order.name}</div>
                      <div className="text-xs text-gray-400">{order.email}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.date || order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                      LKR {order.total}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${activeCfg.rowBadge}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {otherStatuses.map((s) => (
                          <button
                            key={s.key}
                            onClick={() => handleStatusChange(order.orderId, s.key)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${s.moveBtn}`}
                          >
                            {s.icon} {s.key}
                          </button>
                        ))}
                        <button
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
                          title="Remove Order"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
