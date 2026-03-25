import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BsCart4, BsSunFill, BsMoonFill } from "react-icons/bs";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";
import { FiHome, FiBox, FiPhoneCall, FiHeart } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ShinyText from "./ShinyText";
import getCart from "../utils/cart";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  const getCartCount = () =>
    getCart().reduce(
      (total, item) => total + Number(item?.quantity ?? 0),
      0,
    );

  const loadUser = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data.user || null);
      })
      .catch(() => {
        setUser(null);
      });
  };

  useEffect(() => {
    setUserMenuOpen(false);
    loadUser();
    setCartCount(getCartCount());
  }, [location.pathname]);

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };
    window.addEventListener("cart:updated", handleCartUpdate);
    return () => window.removeEventListener("cart:updated", handleCartUpdate);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      loadUser();
    };
    window.addEventListener("auth:changed", handleAuthChange);
    return () => window.removeEventListener("auth:changed", handleAuthChange);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/", label: "Home", icon: <FiHome className="text-lg mb-[2px]" /> },
    {
      path: "/products",
      label: "Products",
      icon: <FiBox className="text-lg mb-[2px]" />,
    },
    {
      path: "/contact",
      label: "Contact",
      icon: <FiPhoneCall className="text-lg mb-[2px]" />,
    },
    {
      path: "/reviews",
      label: "Reviews",
      icon: <FiHeart className="text-lg mb-[2px]" />,
    },
  ];

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
      user.name ||
      user.email ||
      "Account"
    : "Account";
  const avatarUrl =
    user?.profilePicture || user?.avatar || user?.image || null;
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setUser(null);
    setUserMenuOpen(false);
    navigate("/login");
  };

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
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative flex-shrink-0">
                {/* Dynamically switching logo based on dark mode */}
                <img
                  src={darkMode ? "/logo.png" : "/logo.png"}
                  alt="Githmi Sports Goods Logo"
                  className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight">
                  {/* ✨ SHINY TEXT COMPONENT ✨ */}
                  <ShinyText
                    text="Githmi Sports Goods"
                    disabled={false}
                    speed={3}
                    className={darkMode ? "text-[#a855f7]" : "text-[#4f46e5]"}
                  />
                </h1>
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
                className="hidden sm:flex w-16 h-8 bg-gray-900 dark:bg-gray-200 rounded-full p-1 items-center transition-colors duration-300 shadow-inner"
                aria-label="Toggle theme"
              >
                <div
                  className={`w-6 h-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center transform transition-transform duration-300 ${
                    darkMode ? "translate-x-8" : "translate-x-0"
                  }`}
                >
                  {darkMode ? (
                    <BsMoonFill className="text-gray-900 dark:text-white text-xs" />
                  ) : (
                    <BsSunFill className="text-gray-900 dark:text-white text-xs" />
                  )}
                </div>
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <BsCart4 className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth / User (Desktop) */}
              {user ? (
                <div
                  ref={userMenuRef}
                  className="relative hidden md:flex items-center pl-2 border-l border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-xl text-gray-600 dark:text-gray-300" />
                    )}
                    <span className="hidden lg:inline max-w-[140px] truncate">
                      {displayName}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-64 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl p-4">
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <FaUserCircle className="text-xl text-gray-500 dark:text-gray-300" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white truncate">
                            {displayName}
                          </p>
                          {user?.email && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="mt-4 block w-full rounded-xl bg-indigo-50 dark:bg-indigo-900/40 py-2.5 text-center text-sm font-bold text-indigo-700 dark:text-indigo-300 transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
                        >
                          Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="mt-4 w-full rounded-xl bg-gray-900 dark:bg-gray-100 py-2 text-sm font-bold text-white dark:text-gray-900 transition-all hover:-translate-y-0.5 hover:shadow-md"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3 pl-2 border-l border-gray-200 dark:border-gray-700">
                  <Link
                    to="/login"
                    className="bg-transparent border-2 border-[#4f46e5] dark:border-[#a855f7] text-[#4f46e5] dark:text-[#a855f7] hover:bg-[#eff6ff] dark:hover:bg-gray-800 font-bold py-2 px-5 rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-sm whitespace-nowrap"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-[#4f46e5] to-[#a855f7] hover:from-[#4338ca] hover:to-[#9333ea] text-white font-bold py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-sm whitespace-nowrap"
                  >
                    Register
                  </Link>
                </div>
              )}

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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 flex flex-col">
            {/* Menu Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Updated Mobile Menu Logo */}
                <img
                  src={darkMode ? "/logo-white.png" : "/logo.png"}
                  alt="Logo"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">
                    Githmi Sports
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

            {/* Mobile Navigation Links */}
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
                  </Link>
                ))}

                {/* Mobile Cart */}
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 mt-2"
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

              {/* Theme Toggle (Mobile) */}
              <div className="mt-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between border border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
                    {darkMode ? (
                      <BsMoonFill className="text-lg text-purple-400" />
                    ) : (
                      <BsSunFill className="text-lg text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Switch theme
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-14 h-7 bg-gray-900 dark:bg-gray-200 rounded-full p-1 flex items-center transition-colors duration-300 shadow-inner"
                >
                  <div
                    className={`w-5 h-5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center transform transition-transform duration-300 ${
                      darkMode ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Auth / User (Mobile) */}
              {user ? (
                <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                  <div className="flex items-center gap-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <FaUserCircle className="text-xl text-gray-500 dark:text-gray-300" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">
                        {displayName}
                      </p>
                      {user?.email && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="mt-4 block w-full rounded-xl bg-indigo-50 dark:bg-indigo-900/40 py-3 text-center text-sm font-bold text-indigo-700 dark:text-indigo-300 transition-all active:scale-95"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="mt-4 w-full rounded-xl bg-gray-900 dark:bg-gray-100 py-3 text-sm font-bold text-white dark:text-gray-900 transition-all active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-transparent border-2 border-[#4f46e5] dark:border-[#a855f7] text-[#4f46e5] dark:text-[#a855f7] hover:bg-[#eff6ff] dark:hover:bg-gray-800 font-bold py-3 rounded-xl shadow-sm transform active:scale-95 transition-all duration-300 text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-gradient-to-r from-[#4f46e5] to-[#a855f7] text-white font-bold py-3.5 rounded-xl shadow-md transform active:scale-95 transition-all duration-300 text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Menu Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  © 2024 Githmi Sports Goods.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global styles for custom scrollbar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --scrollbar-thumb: #cbd5e1;
          --scrollbar-track: #f1f5f9;
        }
        .dark {
          --scrollbar-thumb: #475569;
          --scrollbar-track: #1e293b;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: var(--scrollbar-track);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `,
        }}
      />
    </>
  );
}
