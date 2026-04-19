import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { FiSave, FiLoader } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth(); // Need login hook to update local user state manually maybe? Or we update localstorage and refresh.
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        profilePicture: user.profilePicture || user.avatar || user.image || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const uploadAvatar = async (file) => {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are accepted");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const dataPayload = new FormData();
      dataPayload.append("folderName", "ProfilePictures");
      dataPayload.append("images", file);

      const { data } = await axios.post(`${baseUrl}/api/upload`, dataPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.urls && data.urls.length > 0) {
        setFormData((prev) => ({ ...prev, profilePicture: data.urls[0] }));
        toast.success("Image uploaded. Remember to save changes!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const { data } = await axios.put(`${baseUrl}/api/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Profile updated successfully!");
      
      // Update local storage so the nav bar visually refreshes without manual reload entirely?
      // Since context runs on mount, a quick hack is updating localstorage user if AuthContext depends on it,
      // or we can just window.location.reload() for a hard refresh of the unified state.
      if (data.user) {
         localStorage.setItem("user", JSON.stringify(data.user));
         window.location.reload(); 
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
     return <div className="min-h-[50vh] flex items-center justify-center text-lg text-gray-500">Loading Profile...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          
          {/* Header Graphic */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
             <div className="absolute -bottom-16 w-full flex justify-center">
                <div 
                   onClick={() => !uploading && fileInputRef.current?.click()}
                   className="relative group cursor-pointer"
                >
                   <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                      {formData.profilePicture ? (
                         <img src={formData.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                         <FaUserCircle className="text-gray-400 text-6xl" />
                      )}
                      
                      {uploading && (
                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <FiLoader className="text-white text-3xl animate-spin" />
                         </div>
                      )}

                      {!uploading && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                           <FaCamera className="text-white text-2xl mb-1" />
                           <span className="text-white text-[10px] font-bold tracking-widest uppercase">Change</span>
                        </div>
                      )}
                   </div>
                   
                   {/* Hidden File Input */}
                   <input
                     type="file"
                     ref={fileInputRef}
                     onChange={(e) => uploadAvatar(e.target.files[0])}
                     accept="image/jpeg, image/png, image/webp"
                     className="hidden"
                   />
                </div>
             </div>
          </div>

          {/* Spacer for Avatar overlap */}
          <div className="pt-20 px-8 pb-8">
             <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{user.email}</p>
                {user.role === "admin" && (
                   <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
                     Administrator Account
                   </span>
                )}
             </div>

             <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        placeholder="John"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        placeholder="Doe"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                   <input
                     type="tel"
                     name="phone"
                     value={formData.phone}
                     onChange={handleInputChange}
                     className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                     placeholder="+1 234 567 890"
                   />
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                   <button
                     type="submit"
                     disabled={loading || uploading}
                     className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                   >
                     {loading ? <FiLoader className="animate-spin text-xl" /> : <FiSave className="text-xl" />}
                     Save Profile
                   </button>
                </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}
