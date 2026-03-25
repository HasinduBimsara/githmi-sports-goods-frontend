import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiCheckCircle, FiTrash2, FiMail, FiSend, FiX } from "react-icons/fi";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Reply Modal State
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [activeReplyMsg, setActiveReplyMsg] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const fetchMessages = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.get(`${baseUrl}/api/messages`, config);
      const data = response.data.messages || [];
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load messages");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleStatus = async (msgId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Unread" ? "Read" : "Unread";
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(
        `${baseUrl}/api/messages/${msgId}/status`,
        { status: newStatus },
        config
      );
      
      toast.success(`Message marked as ${newStatus}`);
      fetchMessages();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (msgId) => {
    if (!window.confirm("Are you sure you want to permanently delete this message?")) return;
    
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`${baseUrl}/api/messages/${msgId}`, config);
      toast.success("Message deleted successfully");
      fetchMessages();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const openReplyModal = (msg) => {
    setActiveReplyMsg(msg);
    setReplyText("");
    setReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      return toast.error("Please enter a reply message.");
    }

    setSendingReply(true);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post(
        `${baseUrl}/api/messages/${activeReplyMsg._id}/reply`,
        { replyMessage: replyText },
        config
      );
      
      toast.success("Reply sent successfully via email!");
      setReplyModalOpen(false);
      setActiveReplyMsg(null);
      fetchMessages(); // Refresh to show it as read
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send email reply.");
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FiMail className="text-indigo-600" /> Inbox Messages
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl">
          Total Messages: {messages.length}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                <th className="p-4 font-medium">Customer Details</th>
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium max-w-sm">Message Content</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">Loading inbox...</td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">Inbox is empty. No messages found.</td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg._id} className={`transition-colors ${msg.status === 'Unread' ? 'bg-indigo-50/50 dark:bg-indigo-900/10 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-700/20'}`}>
                    <td className="p-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-200">{msg.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{msg.email}</p>
                      {msg.phone && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{msg.phone}</p>}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-800 dark:text-gray-300">
                      {msg.subject}
                    </td>
                    <td className="p-4 max-w-sm">
                      <p className="text-sm text-gray-700 dark:text-gray-400 whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${msg.status === 'Unread' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openReplyModal(msg)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Reply via Email"
                      >
                        <FiSend className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(msg._id, msg.status)}
                        className={`p-2 rounded-lg transition-colors ${msg.status === 'Unread' ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        title={msg.status === 'Unread' ? "Mark as Read" : "Mark as Unread"}
                      >
                        {msg.status === 'Unread' ? <FiCheckCircle className="w-5 h-5"/> : <FiMail className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Message"
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

      {/* Reply Modal overlay */}
      {replyModalOpen && activeReplyMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <FiSend className="text-indigo-600" /> Reply to {activeReplyMsg.name}
              </h3>
              <button
                onClick={() => setReplyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 tracking-wide uppercase font-semibold mb-1">To: {activeReplyMsg.email}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Re: {activeReplyMsg.subject}</p>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 pl-3 border-l-2 border-indigo-300 dark:border-indigo-800 italic">
                  {activeReplyMsg.message}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Response
                </label>
                <textarea
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-4 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y min-h-[150px]"
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={sendingReply}
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                  onClick={() => setReplyModalOpen(false)}
                  disabled={sendingReply}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center min-w-[120px]"
                  onClick={handleSendReply}
                  disabled={sendingReply}
                >
                  {sendingReply ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                     <div className="flex items-center">Send Reply <FiSend className="ml-2 w-4 h-4"/></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
