import { Outlet, Link, useLocation } from "react-router-dom";
import { FiHome, FiBox, FiShoppingCart, FiUsers, FiLogOut } from "react-icons/fi";

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <FiHome className="w-5 h-5" /> },
    { name: "Products", path: "/admin/products", icon: <FiBox className="w-5 h-5" /> },
    { name: "Orders", path: "/admin/orders", icon: <FiShoppingCart className="w-5 h-5" /> },
    { name: "Users", path: "/admin/users", icon: <FiUsers className="w-5 h-5" /> },
  ];

  const isActive = (path) => {
    if (path === "/admin" && location.pathname !== "/admin") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300 shadow-lg">
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Githmi Admin
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900/50">
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10 transition-colors duration-300">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {navItems.find((item) => isActive(item.path))?.name || "Admin Panel"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 scroll-smooth">
          {/* Dashboard pages will be rendered here */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
