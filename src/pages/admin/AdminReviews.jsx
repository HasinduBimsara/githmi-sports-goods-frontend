import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiCheckCircle, FiXCircle, FiTrash2 } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.get(`${baseUrl}/api/reviews`, config);
      const data = response.data.reviews || response.data || [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load reviews");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (reviewId, currentStatus) => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(
        `${baseUrl}/api/reviews/${reviewId}/approve`,
        { isApproved: !currentStatus },
        config
      );
      
      toast.success(`Review ${!currentStatus ? "approved" : "hidden"} successfully`);
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update review status");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
    
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`${baseUrl}/api/reviews/${reviewId}`, config);
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete review");
    }
  };

  const handleImageUpload = async (e, reviewId) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append("images", file);
      formData.append("folderName", "HappyCustomers");
      
      const uploadRes = await axios.post(`${baseUrl}/api/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      
      const imageUrl = uploadRes.data.urls[0];

      await axios.put(`${baseUrl}/api/reviews/${reviewId}`, { image: imageUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Happy customer image updated!");
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`text-xs ${index < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Customer Reviews</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl">
          Total Reviews: {reviews.length}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium">Review Content</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No reviews found.</td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {review.avatar ? (
                            <img src={review.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">{review.name?.charAt(0) || "U"}</div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{review.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{review.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {review.productId}
                    </td>
                    <td className="p-4">
                      {renderStars(review.rating)}
                    </td>
                    <td className="p-4 max-w-sm">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-1">{review.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{review.comment}</p>
                    </td>
                    <td className="p-4 text-sm flex flex-col gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium w-max ${review.isApproved ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                        {review.isApproved ? "Approved" : "Hidden"}
                      </span>
                      {review.image && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium w-max bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Has Image
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <label 
                        className="cursor-pointer p-2 inline-block rounded-lg transition-colors text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" 
                        title="Upload Happy Customer Image"
                      >
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, review._id)} 
                        />
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      </label>
                      <button
                        onClick={() => handleToggleApproval(review._id, review.isApproved)}
                        className={`p-2 rounded-lg transition-colors ${review.isApproved ? "text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20" : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"}`}
                        title={review.isApproved ? "Hide Review" : "Approve Review"}
                      >
                        {review.isApproved ? <FiXCircle className="w-5 h-5"/> : <FiCheckCircle className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Review"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
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

export default AdminReviews;
