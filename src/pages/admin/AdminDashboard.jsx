import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  FiUsers, FiBox, FiShoppingBag, FiDollarSign, FiTrendingUp, FiTrendingDown, FiActivity, FiClock, FiCheckCircle, FiXCircle
} from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  
  const [metrics, setMetrics] = useState({
    revenueGrowth: 0,
    ordersGrowth: 0,
    productsNew: 0,
    usersGrowth: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState("Live Syncing");
  const [dbStatus, setDbStatus] = useState("Connected");

  const fetchStats = useCallback(async (isInitial = false) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get(`${baseUrl}/api/user`, config).catch(() => ({ data: [] })),
        axios.get(`${baseUrl}/api/product`, config).catch(() => ({ data: { products: [], total: 0 } })),
        axios.get(`${baseUrl}/api/order`, config).catch(() => ({ data: { orders: [], total: 0 } }))
      ]);

      const usersList = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data.list || []);
      const productsList = Array.isArray(productsRes.data) ? (productsRes.data.products || []) : (productsRes.data.products || []);
      const ordersList = Array.isArray(ordersRes.data) ? (ordersRes.data.orders || []) : (ordersRes.data.orders || []);
      
      const totalProducts = productsRes.data.total || productsList.length;
      
      const now = new Date();
      
      // -- Time boundaries --
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      
      const startOfThisWeek = new Date(now);
      startOfThisWeek.setDate(now.getDate() - now.getDay());
      startOfThisWeek.setHours(0,0,0,0);
      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

      // --- Revenue calculation & Growth ---
      let currentMonthRev = 0;
      let lastMonthRev = 0;
      let totalRev = 0;

      ordersList.forEach(order => {
         const amount = Number(order.total) || 0;
         totalRev += amount;
         const d = new Date(order.createdAt);
         if (!isNaN(d)) {
            if (d >= startOfThisMonth) currentMonthRev += amount;
            else if (d >= startOfLastMonth && d < startOfThisMonth) lastMonthRev += amount;
         }
      });
      
      let revGrowth = 0;
      if (lastMonthRev > 0) {
        revGrowth = ((currentMonthRev - lastMonthRev) / lastMonthRev) * 100;
      } else if (currentMonthRev > 0) {
        revGrowth = 100;
      }

      // --- Active Orders calculation & Growth ---
      let todayActive = 0;
      let yesterdayActive = 0;
      const activeOrders = ordersList.filter(o => o.status !== "Delivered" && o.status !== "Cancelled");
      
      activeOrders.forEach(order => {
         const d = new Date(order.createdAt);
         if (!isNaN(d)) {
            if (d >= startOfToday) todayActive++;
            else if (d >= startOfYesterday && d < startOfToday) yesterdayActive++;
         }
      });

      let orderGrowth = 0;
      if (yesterdayActive > 0) {
        orderGrowth = ((todayActive - yesterdayActive) / yesterdayActive) * 100;
      } else if (todayActive > 0) {
        orderGrowth = 100;
      }

      // --- Products calculation ---
      let newProductsThisWeek = 0;
      productsList.forEach(p => {
        const d = new Date(p.createdAt);
        if (!isNaN(d) && d >= startOfThisWeek) {
           newProductsThisWeek++;
        }
      });

      // --- Users calculation ---
      let currentMonthUsers = 0;
      let lastMonthUsers = 0;
      usersList.forEach(u => {
        const d = new Date(u.createdAt);
        if (!isNaN(d)) {
            if (d >= startOfThisMonth) currentMonthUsers++;
            else if (d >= startOfLastMonth && d < startOfThisMonth) lastMonthUsers++;
        }
      });
      
      let usersGrowth = 0;
      if (lastMonthUsers > 0) {
        usersGrowth = ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
      } else if (currentMonthUsers > 0) {
        usersGrowth = 100;
      }

      setStats({
        users: usersList.length,
        products: totalProducts,
        orders: activeOrders.length, // Keep only active orders count for the summary, or use a separate total if available
        revenue: totalRev
      });

      setMetrics({
        revenueGrowth: revGrowth.toFixed(1),
        ordersGrowth: orderGrowth.toFixed(1),
        productsNew: newProductsThisWeek,
        usersGrowth: usersGrowth.toFixed(1)
      });

      // --- Recent Orders ---
      const sortedOrders = [...ordersList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentOrders(sortedOrders.slice(0, 5));

      // --- Chart Data ---
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const salesByMonth = {};
      
      // Initialize last 6 months to 0
      for (let i = 5; i >= 0; i--) {
         const mDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
         salesByMonth[`${months[mDate.getMonth()]} ${mDate.getFullYear().toString().slice(2)}`] = 0;
      }
      
      ordersList.forEach(order => {
        const date = new Date(order.createdAt);
        if (!isNaN(date)) {
           const key = `${months[date.getMonth()]} ${date.getFullYear().toString().slice(2)}`;
           if (typeof salesByMonth[key] !== "undefined") {
             salesByMonth[key] += (Number(order.total) || 0);
           }
        }
      });

      const generatedChartData = Object.keys(salesByMonth).map(monthKey => ({
        name: monthKey,
        sales: salesByMonth[monthKey]
      }));

      // if completely flat, and no data exists at all
      if (ordersList.length === 0) {
          setChartData([
            { name: "Jan", sales: 0 },
            { name: "Feb", sales: 0 },
            { name: "Mar", sales: 0 },
            { name: "Apr", sales: 0 },
            { name: "May", sales: 0 },
            { name: "Jun", sales: 0 },
          ]);
      } else {
          setChartData(generatedChartData);
      }

      // Check System Health
      axios.get(`${baseUrl}/health`).then(res => {
         if (res.data?.status === "OK") {
            setSystemStatus("Live Syncing");
            setDbStatus(res.data.database === "Connected" ? "Connected" : "Warning");
         }
      }).catch(() => {
         setSystemStatus("Disconnected");
         setDbStatus("Offline");
      });

    } catch (error) {
      if (isInitial) {
        console.error("Failed to fetch dashboard stats", error);
        toast.error("Failed to connect to real-time metrics");
      }
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(true);
    
    // Real-time polling every 10 seconds
    const interval = setInterval(() => {
       fetchStats(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  const renderStatus = (status) => {
    switch (status) {
      case "Delivered": return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">Delivered</span>;
      case "Processing": return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">Processing</span>;
      case "Cancelled": return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold">Cancelled</span>;
      default: return <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold">{status || 'Pending'}</span>;
    }
  };

  const GrowthIndicator = ({ value, label }) => {
    const isPositive = Number(value) > 0;
    const isNeutral = Number(value) === 0;
    
    return (
      <p className={`text-xs font-bold flex items-center ${isPositive ? 'text-emerald-500' : isNeutral ? 'text-gray-400' : 'text-red-500'}`}>
        {!isNeutral && (isPositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />)}
        {Number(value) > 0 ? '+' : ''}{value}% 
        <span className="text-gray-400 dark:text-gray-500 font-medium ml-1"> {label}</span>
      </p>
    );
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live metrics connected
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full transition-transform duration-500 group-hover:scale-110"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Revenue</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1 mb-2">
                {loading ? <span className="animate-pulse">--</span> : `LKR ${stats.revenue.toLocaleString()}`}
              </h3>
              <GrowthIndicator value={metrics.revenueGrowth} label="from last month" />
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <FiDollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-full transition-transform duration-500 group-hover:scale-110"></div>
           <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Active Orders</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1 mb-2">
                {loading ? <span className="animate-pulse">--</span> : stats.orders}
              </h3>
              <GrowthIndicator value={metrics.ordersGrowth} label="from yesterday" />
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <FiShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-full transition-transform duration-500 group-hover:scale-110"></div>
           <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Products</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1 mb-2">
                {loading ? <span className="animate-pulse">--</span> : stats.products}
              </h3>
              <p className="text-xs font-bold text-emerald-500 flex items-center">
                <FiTrendingUp className="mr-1" />
                {Number(metrics.productsNew) > 0 ? '+' : ''}{metrics.productsNew} 
                <span className="text-gray-400 dark:text-gray-500 font-medium ml-1"> new this week</span>
              </p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
              <FiBox className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full transition-transform duration-500 group-hover:scale-110"></div>
           <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Users</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1 mb-2">
                {loading ? <span className="animate-pulse">--</span> : stats.users}
              </h3>
              <GrowthIndicator value={metrics.usersGrowth} label="from last month" />
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <FiActivity className="text-blue-500" /> Revenue Analytics
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Real-time data over the last 6 months</p>
            </div>
            <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300 rounded-xl px-4 py-2 outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="w-full flex-grow min-h-[300px]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} tickFormatter={(value) => `LKR ${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value) => [`LKR ${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Side Widget - Latest Activity */}
        <div className="bg-[#111827] dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-800 dark:border-gray-700 text-white relative overflow-hidden flex flex-col">
           <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -z-10"></div>
           
           <h2 className="text-lg font-black flex items-center gap-2 mb-6">
             <FiClock className="text-indigo-400" /> Recent Action Required
           </h2>
           
           <div className="space-y-6 flex-grow flex flex-col justify-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-indigo-300">Pending Orders</h4>
                  {stats.orders > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                </div>
                <p className="text-2xl font-black">{stats.orders}</p>
                <p className="text-xs text-gray-400 mt-2 font-medium tracking-wide">Orders waiting for your approval to be processed.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-emerald-300">System Status</h4>
                  {systemStatus === "Live Syncing" ? <FiCheckCircle className="text-emerald-400" /> : <FiXCircle className="text-red-400" />}
                </div>
                <p className={`text-2xl font-black ${systemStatus === "Live Syncing" ? 'text-emerald-400' : 'text-red-400'}`}>{systemStatus}</p>
                <p className="text-xs text-gray-400 mt-2 font-medium tracking-wide">DB: {dbStatus} • {systemStatus === "Live Syncing" ? "Broadcasting optimally" : "Connection lost"}</p>
              </div>
           </div>

           <button className="mt-8 w-full py-3 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:-translate-y-1 active:scale-95 transition-all text-sm">
             View Full Report
           </button>
        </div>

      </div>

      {/* Recent Orders Table Area */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Recent Orders Snapshot</h2>
          <button className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                <th className="p-5 font-bold">Order Details</th>
                <th className="p-5 font-bold">Date</th>
                <th className="p-5 font-bold">Total Amount</th>
                <th className="p-5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">Loading recent transactions...</td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">No recent orders found.</td>
                </tr>
              ) : (
                recentOrders.map((order, i) => (
                  <tr key={order._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {order.name || "Guest Customer"}
                        </span>
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-700/50 w-max px-2 py-0.5 rounded-md">
                          #{order.orderId || order._id || `ORD-${Math.floor(Math.random()*10000)}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </td>
                    <td className="p-5 text-sm font-black text-gray-900 dark:text-gray-100">
                      LKR {Number(order.total || 0).toLocaleString()}
                    </td>
                    <td className="p-5">
                      {renderStatus(order.status)}
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

export default AdminDashboard;
