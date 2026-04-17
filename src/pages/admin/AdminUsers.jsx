import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      
      const response = await axios.get(`${baseUrl}/api/user`, config);
      const data = response.data.list || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      
      await axios.delete(`${baseUrl}/api/user/${id}`, config);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Users Management</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.firstName} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                            {user.firstName[0]?.toUpperCase()}
                          </div>
                        )}
                        <span>{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      {user.email}
                      {user.isGoogleUser && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">Google</span>}
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{user.phone || "-"}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <FiTrash2 />
                        </button>
                      )}
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

export default AdminUsers;
