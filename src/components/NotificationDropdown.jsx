import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiCheckCircle, FiPackage, FiMessageCircle, FiInfo } from "react-icons/fi";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../utils/notifications";
import { useAuth } from "../context/AuthContext";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  const loadNotifications = async () => {
    try {
      if (!user) return;
      const data = await fetchNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "order_update":
        return <FiCheckCircle className="text-green-500" />;
      case "new_order":
        return <FiPackage className="text-blue-500" />;
      case "message":
        return <FiMessageCircle className="text-purple-500" />;
      default:
        return <FiInfo className="text-gray-500" />;
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300 group"
      >
        <FiBell className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors duration-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden transform origin-top-right transition-all duration-200">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBell className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    !notification.isRead ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <Link
                          to={notification.link || "#"}
                          onClick={() => {
                            handleMarkAsRead(notification._id);
                            setIsOpen(false);
                          }}
                          className="font-bold text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate pr-2"
                        >
                          {notification.title}
                        </Link>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-2 block">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 text-center">
            <button
               onClick={() => setIsOpen(false)}
               className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
