import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiChevronRight, FiMapPin } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const STATUS_CONFIG = {
  Pending: { icon: <FiClock />, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", label: "Awaiting Confirmation" },
  Processing: { icon: <FiPackage />, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", label: "Preparing Order" },
  Delivered: { icon: <FiCheckCircle />, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30", label: "Successfully Delivered" },
  Cancelled: { icon: <FiXCircle />, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30", label: "Order Cancelled" },
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        
        if (userData.role === "admin") {
          navigate("/admin");
          return;
        }

        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${baseUrl}/api/order/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Fetch orders failed:", err);
        toast.error("Could not load your order history");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center justify-center sm:justify-start gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
               <FiPackage className="text-2xl" />
            </div>
            Order History
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">Track your recent purchases and delivery updates</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
               <FiTruck className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders placed yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">It looks like you haven't made any purchases. Explore our collection to find the best gear!</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
               Start Shopping <FiChevronRight />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Order Top Bar */}
                <div className="p-5 sm:p-6 bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</span>
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">#{order.orderId}</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Placed On</span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{new Date(order.date || order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${STATUS_CONFIG[order.status]?.bg || 'bg-gray-100'}`}>
                    <span className={`${STATUS_CONFIG[order.status]?.color || 'text-gray-600'} text-sm`}>
                      {STATUS_CONFIG[order.status]?.icon || <FiPackage />}
                    </span>
                    <span className={`text-xs font-black uppercase tracking-wide ${STATUS_CONFIG[order.status]?.color || 'text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Main Order Content */}
                <div className="flex flex-col lg:flex-row">
                  <div className="flex-1 p-6">
                    <div className="grid gap-4">
                       {order.billItems.map((item, idx) => (
                         <div key={idx} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                               <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.productName}</h4>
                               <div className="flex flex-wrap gap-2 mt-1">
                                  {item.color && (
                                     <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400 font-bold uppercase">{item.color}</span>
                                  )}
                                  {item.size && (
                                     <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400 font-bold">Size: {item.size}</span>
                                  )}
                               </div>
                               <p className="text-xs text-gray-400 mt-1 uppercase font-black">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-bold text-gray-900 dark:text-white">LKR {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Summary Sidebar (within Order) */}
                  <div className="lg:w-[300px] p-6 lg:border-l border-gray-100 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-950/20 flex flex-col justify-between">
                    <div>
                       <div className="mb-4">
                          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shipping Information</h5>
                          <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                             <FiMapPin className="mt-0.5 text-indigo-500 flex-shrink-0" />
                             <span>{order.address}</span>
                          </div>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 mt-4">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">LKR {order.total?.toLocaleString()}</span>
                       </div>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter text-right">Payment: Cash on Delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
