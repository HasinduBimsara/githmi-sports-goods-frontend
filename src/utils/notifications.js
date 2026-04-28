const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const fetchNotifications = async () => {
  const res = await fetch(`${API_URL}/notifications`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
};

export const markNotificationAsRead = async (id) => {
  const res = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to mark notification as read");
  return res.json();
};

export const markAllNotificationsAsRead = async () => {
  const res = await fetch(`${API_URL}/notifications/read-all`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to mark all notifications as read");
  return res.json();
};

export const deleteNotification = async (id) => {
  const res = await fetch(`${API_URL}/notifications/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete notification");
  return res.json();
};

export const deleteAllNotifications = async () => {
  const res = await fetch(`${API_URL}/notifications`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete all notifications");
  return res.json();
};

