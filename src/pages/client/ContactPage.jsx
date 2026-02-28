import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPaperPlane,
  FaCheckCircle,
  FaArrowRight,
  FaUser,
  FaComment,
  FaQuestionCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  MdOutlineSupportAgent,
  MdEmail,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";
import { BsChatDots } from "react-icons/bs";

// ==================== REUSABLE COMPONENTS ====================

const FormInput = ({
  label,
  name,
  type,
  value,
  onChange,
  required,
  placeholder,
  icon,
  iconColorClass,
  activeField,
  setActiveField,
}) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <div
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${
          activeField === name
            ? "bg-[#4f46e5] text-white shadow-md"
            : iconColorClass
        }`}
      >
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setActiveField(name)}
        onBlur={() => setActiveField(null)}
        required={required}
        className={`w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white py-3.5 pl-14 pr-4 rounded-xl outline-none transition-all duration-300 border-2 ${
          activeField === name
            ? "border-[#4f46e5] bg-white dark:bg-gray-800 shadow-md"
            : "border-transparent hover:border-gray-200 dark:hover:border-gray-700 dark:border-gray-800"
        }`}
        placeholder={placeholder}
      />
    </div>
  </div>
);

const ChatMessage = ({ message, type }) => (
  <div
    className={`mb-4 flex ${type === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-[80%] p-3 rounded-2xl text-sm ${
        type === "user"
          ? "bg-gradient-to-r from-[#4f46e5] to-[#a855f7] text-white rounded-br-none"
          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600 transition-colors"
      }`}
    >
      {message}
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [uiState, setUiState] = useState({
    isSubmitting: false,
    isSubmitted: false,
    activeField: null,
    chatOpen: false,
  });

  const [chatState, setChatState] = useState({
    messages: [{ type: "bot", text: "👋 Hi! How can I help you today?" }],
    input: "",
  });

  const chatRef = useRef(null);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setUiState((prev) => ({ ...prev, isSubmitting: true }));
    setTimeout(() => {
      setUiState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
      }));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(
        () => setUiState((prev) => ({ ...prev, isSubmitted: false })),
        5000,
      );
    }, 1500);
  };

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatState.input.trim()) return;
    setChatState((prev) => ({
      messages: [...prev.messages, { type: "user", text: prev.input }],
      input: "",
    }));
    setTimeout(() => {
      setChatState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            type: "bot",
            text: "Thanks for your message! An agent will be with you shortly.",
          },
        ],
      }));
    }, 1000);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatState.messages]);

  return (
    <div className="relative min-h-screen bg-[#f8f6fb] dark:bg-gray-900 py-10 px-4 sm:px-6 flex justify-center items-start font-sans overflow-hidden transition-colors duration-300">
      {/* Animated Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-300 dark:bg-blue-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob transition-colors duration-300"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300 dark:bg-purple-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 transition-colors duration-300"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] flex flex-col gap-8">
        {/* ========== TOP HEADER CARD ========== */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 lg:p-10 flex flex-col lg:flex-row justify-between items-start gap-8 border border-white/50 dark:border-gray-700 transition-colors duration-300">
          <div className="lg:w-5/12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight transition-colors">
              Get In{" "}
              <span className="text-[#4f46e5] dark:text-purple-800">Touch</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed transition-colors">
              We'd love to hear from you! Whether you have questions, need
              support, or want to learn more about our services, our team is
              here to help 24/7.
            </p>
          </div>

          <div className="lg:w-7/12 flex flex-col sm:flex-row gap-8 lg:gap-16 pt-2">
            <div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-blue-200 dark:border-blue-800 transition-colors">
                <MdLocationOn className="text-3xl" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 transition-colors">
                Our Address
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                No. 305, Galle Road, Ambalangoda
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                Galle, Sri Lanka
              </p>
            </div>
            <div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-purple-200 dark:border-purple-800 transition-colors">
                <MdPhone className="text-3xl" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 transition-colors">
                Our Contact Info
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                <span className="text-[#4f46e5] dark:text-yellow-200">
                  +94 778041167
                </span>
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                githmisports@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* ========== MAP SECTION ========== */}
        <div className="relative w-full h-[350px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl border border-white/50 dark:border-gray-700 transition-colors duration-300">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.187913225468!2d80.05147557576697!3d6.238946393749361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae1819d52fae46f%3A0x4bf0a602cbb009ac!2sGithmi%20Sports%20Goods!5e0!3m2!1sen!2slk!4v1772206875264!5m2!1sen!2slk"
            width="600"
            height="450"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrades"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "contrast(1.2)" }} // Added slight contrast filter for modern look
            allowFullScreen=""
            loading="lazy"
            title="Location Map"
            className="absolute inset-0 dark:opacity-80" // Dims map slightly in dark mode
          ></iframe>
          <a
            href="https://www.google.com/maps/dir//Githmi+Sports+Goods+Ambalangoda/@6.2389464,80.0540505,16z/data=!4m5!4m4!1m0!1m2!1m1!1s0x3ae1819d52fae46f:0x4bf0a602cbb009ac"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-55 left-3 bg-gradient-to-r from-[#4f46e5] to-[#a855f7] hover:from-[#4338ca] hover:to-[#9333ea] text-white text-sm font-bold py-3 px-6 rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center whitespace-nowrap"
          >
            Get Directions <FaArrowRight className="ml-2 text-xs" />
          </a>
        </div>

        {/* ========== FORM & FAQ SECTION ========== */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: 2x2 Grid Form */}
          <div className="lg:w-8/12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              Send us a Message
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 transition-colors">
              We typically reply within 5 minutes during business hours.
            </p>

            {uiState.isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl flex items-center text-green-700 dark:text-green-400 transition-colors">
                <FaCheckCircle className="mr-3 text-xl" /> Message sent
                successfully! We will get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your name..."
                  icon={<FaUser />}
                  iconColorClass="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                  activeField={uiState.activeField}
                  setActiveField={(f) =>
                    setUiState((prev) => ({ ...prev, activeField: f }))
                  }
                />
                <FormInput
                  label="Subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="How can we help?"
                  icon={<FaComment />}
                  iconColorClass="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                  activeField={uiState.activeField}
                  setActiveField={(f) =>
                    setUiState((prev) => ({ ...prev, activeField: f }))
                  }
                />
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email..."
                  icon={<MdEmail />}
                  iconColorClass="bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400"
                  activeField={uiState.activeField}
                  setActiveField={(f) =>
                    setUiState((prev) => ({ ...prev, activeField: f }))
                  }
                />
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone..."
                  icon={<MdPhone />}
                  iconColorClass="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                  activeField={uiState.activeField}
                  setActiveField={(f) =>
                    setUiState((prev) => ({ ...prev, activeField: f }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() =>
                    setUiState((prev) => ({ ...prev, activeField: "message" }))
                  }
                  onBlur={() =>
                    setUiState((prev) => ({ ...prev, activeField: null }))
                  }
                  required
                  rows="4"
                  placeholder="Describe your inquiry..."
                  className={`w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white p-4 rounded-xl outline-none transition-all duration-300 border-2 resize-none ${
                    uiState.activeField === "message"
                      ? "border-[#4f46e5] bg-white dark:bg-gray-800 shadow-md"
                      : "border-transparent hover:border-gray-200 dark:hover:border-gray-700 dark:border-gray-800"
                  }`}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={uiState.isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#4f46e5] to-[#a855f7] hover:from-[#4338ca] hover:to-[#9333ea] text-white font-bold rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center disabled:opacity-70 text-sm whitespace-nowrap"
              >
                {uiState.isSubmitting ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:w-4/12 flex flex-col gap-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 dark:border-gray-700 flex-1 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 text-orange-500 dark:text-orange-400 rounded-xl flex items-center justify-center mr-3 transition-colors">
                  <FaQuestionCircle className="text-xl" />
                </div>
                Quick FAQ
              </h3>
              <div className="space-y-4">
                <div className="border-b border-gray-100 dark:border-gray-700 pb-3 hover:pl-2 transition-all duration-300">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 transition-colors">
                    What are your shipping options?
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                    We offer standard (3-5 days) and express (1-2 days) shipping
                    island-wide.
                  </p>
                </div>
                <div className="border-b border-gray-100 dark:border-gray-700 pb-3 hover:pl-2 transition-all duration-300">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 transition-colors">
                    How do I return an item?
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                    Items can be returned within 30 days of purchase in original
                    condition.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-5 transition-colors">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://web.facebook.com/p/Githmi-Sports-Goods-61559424647331/?_rdc=1&_rdr#"
                  className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900 transition-all duration-300"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/githmisportsshop/"
                  className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xl hover:bg-pink-600 dark:hover:bg-pink-500 hover:text-white dark:hover:text-white hover:-translate-y-2 hover:shadow-lg hover:shadow-pink-200 dark:hover:shadow-pink-900 transition-all duration-300"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://wa.me/94778041167"
                  className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center text-xl hover:bg-green-500 dark:hover:bg-green-500 hover:text-white dark:hover:text-white hover:-translate-y-2 hover:shadow-lg hover:shadow-green-200 dark:hover:shadow-green-900 transition-all duration-300"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== LIVE CHAT WIDGET ========== */}
      <div className="fixed bottom-6 right-6 z-50">
        {uiState.chatOpen && (
          <div className="absolute bottom-20 right-0 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-slideUp transition-colors duration-300">
            <div className="bg-gradient-to-r from-[#4f46e5] to-[#a855f7] p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <BsChatDots />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Live Support</h3>
                  <p className="text-xs opacity-80">
                    Online • Replies instantly
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setUiState((prev) => ({ ...prev, chatOpen: false }))
                }
                className="text-white/80 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div
              ref={chatRef}
              className="h-64 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
            >
              {chatState.messages.map((msg, index) => (
                <ChatMessage key={index} {...msg} />
              ))}
            </div>
            <form
              onSubmit={handleChatSend}
              className="p-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex gap-2 transition-colors duration-300"
            >
              <input
                type="text"
                value={chatState.input}
                onChange={(e) =>
                  setChatState((prev) => ({ ...prev, input: e.target.value }))
                }
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 text-sm border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-full outline-none focus:border-[#4f46e5] dark:focus:border-[#4f46e5] focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
              <button
                type="submit"
                disabled={!chatState.input.trim()}
                className="w-9 h-9 bg-[#4f46e5] text-white rounded-full flex justify-center items-center hover:bg-[#4338ca] disabled:opacity-50 transition-colors shadow-md"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </form>
          </div>
        )}
        <button
          onClick={() =>
            setUiState((prev) => ({ ...prev, chatOpen: !prev.chatOpen }))
          }
          className="w-14 h-14 bg-gradient-to-r from-[#4f46e5] to-[#a855f7] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 hover:shadow-indigo-500/50 transition-all duration-300"
        >
          <BsChatDots className="text-2xl" />
        </button>
      </div>

      {/* ========== STYLES ========== */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `,
        }}
      />
    </div>
  );
}
