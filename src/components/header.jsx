import { useState, useEffect } from "react";
import {
  BsCart4,
  BsSunFill,
  BsMoonFill,
  BsChevronDown,
  BsPersonCircle,
  BsBoxSeam,
} from "react-icons/bs";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { MdOutlineContactSupport, MdReviews } from "react-icons/md";
import { HiHome, HiShoppingBag } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import UserData from "./userData";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Apply theme to entire document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/", label: "Home", icon: <HiHome /> },
    { path: "/products", label: "Products", icon: <HiShoppingBag /> },
    { path: "/contact", label: "Contact", icon: <MdOutlineContactSupport /> },
    { path: "/reviews", label: "Reviews", icon: <MdReviews /> },
  ];

  const cartCount = 3; // This should come from your cart state

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg dark:shadow-gray-900/50 py-3"
            : "bg-white dark:bg-gray-900 py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:rotate-12">
                  <BsBoxSeam className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LuxeCart
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Premium Store
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ml-1"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative p-2.5 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300 group"
                aria-label="Toggle theme"
              >
                <div className="relative w-5 h-5 overflow-hidden">
                  <BsSunFill
                    className={`w-5 h-5 text-yellow-500 transition-all duration-500 absolute ${
                      darkMode ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                    }`}
                  />
                  <BsMoonFill
                    className={`w-5 h-5 text-purple-400 transition-all duration-500 absolute ${
                      darkMode ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                    }`}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <BsCart4 className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                {cartCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {cartCount}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
                  </>
                )}
              </Link>

              {/* User Profile */}
              <div className="hidden md:block">
                <UserData />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300"
                aria-label="Open menu"
              >
                <RxHamburgerMenu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300">
            <div className="h-full flex flex-col">
              {/* Menu Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <BsBoxSeam className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      Menu
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Navigation
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <RxCross2 className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive(item.path)
                            ? "bg-gradient-to-r from-blue-500 to-purple-500"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <span
                          className={`text-lg ${
                            isActive(item.path)
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span
                          className={`font-medium ${
                            isActive(item.path)
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      {isActive(item.path) && (
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      )}
                    </Link>
                  ))}

                  {/* Cart in Mobile Menu */}
                  <Link
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <BsCart4 className="text-lg text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Shopping Cart
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {cartCount} items
                        </p>
                      </div>
                    </div>
                    {cartCount > 0 && (
                      <span className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Theme Toggle in Mobile */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        {darkMode ? (
                          <BsMoonFill className="text-lg text-purple-400" />
                        ) : (
                          <BsSunFill className="text-lg text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {darkMode ? "Dark Mode" : "Light Mode"}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Switch theme
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
                        darkMode
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 justify-end"
                          : "bg-gradient-to-r from-yellow-400 to-orange-400 justify-start"
                      }`}
                    >
                      <div className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300"></div>
                    </button>
                  </div>
                </div>

                {/* User Info in Mobile */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <BsPersonCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Welcome!
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sign in for better experience
                      </p>
                    </div>
                    <BsChevronDown className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Menu Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    © 2024 LuxeCart. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add global styles for theme */}
      <style jsx global>{`
        :root {
          --scrollbar-thumb: #cbd5e1;
          --scrollbar-track: #f1f5f9;
        }

        .dark {
          --scrollbar-thumb: #475569;
          --scrollbar-track: #1e293b;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: var(--scrollbar-track);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .dark ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        * {
          transition: background-color 0.3s ease, border-color 0.3s ease,
            color 0.3s ease;
        }
      `}</style>
    </>
  );
}
