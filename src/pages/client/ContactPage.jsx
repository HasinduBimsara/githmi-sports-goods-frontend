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
  activeField,
  setActiveField,
}) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
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
        className={`w-full bg-gray-50 text-sm text-gray-800 py-3.5 pl-11 pr-4 rounded-xl outline-none transition-all duration-300 border-2 ${
          activeField === name
            ? "border-blue-500 bg-white shadow-md"
            : "border-transparent hover:border-gray-200"
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
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
          : "bg-gray-100 text-gray-800 rounded-bl-none"
      }`}
    >
      {message}
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================

export default function ContactPage() {
  // --- STATE ---
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

  // --- HANDLERS ---
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
    <div className="relative min-h-screen bg-gray-50 py-10 px-4 sm:px-6 flex justify-center items-start font-sans overflow-hidden">
      {/* Animated Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1200px] flex flex-col gap-8">
        {/* ========== TOP HEADER CARD ========== */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 lg:p-10 flex flex-col lg:flex-row justify-between items-start gap-8 border border-white/50">
          <div className="lg:w-5/12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Get In{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Touch
              </span>
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              We'd love to hear from you! Whether you have questions, need
              support, or want to learn more about our services, our team is
              here to help 24/7.
            </p>
          </div>

          <div className="lg:w-7/12 flex flex-col sm:flex-row gap-8 lg:gap-16 pt-2">
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <MdLocationOn className="text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Our Address</h3>
              <p className="text-gray-500 text-sm">
                No. 305, Galle Road, Ambalangoda
              </p>
              <p className="text-gray-500 text-sm">Galle, Sri Lanka</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <MdPhone className="text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Our Contact Info</h3>
              <p className="text-gray-500 text-sm">+94 778041167</p>
              <p className="text-gray-500 text-sm">githmisports@gmail.com</p>
            </div>
          </div>
        </div>

        {/* ========== MAP SECTION ========== */}
        <div className="relative w-full h-[350px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl border border-white/50">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.9442404356664!2d80.0514755747507!3d6.238946393749322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae1819d52fae46f%3A0x4bf0a602cbb009ac!2sGithmi%20Sports%20Goods!5e1!3m2!1sen!2slk!4v1772067076163!5m2!1sen!2slk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Location Map"
            className="absolute inset-0"
          ></iframe>
          <a
            href="https://www.google.com/maps/dir//Githmi+Sports+Goods+Ambalangoda/@6.2389464,80.0540505,16z/data=!4m5!4m4!1m0!1m2!1m1!1s0x3ae1819d52fae46f:0x4bf0a602cbb009ac"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 left-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium py-3 px-6 rounded-full flex items-center shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            Get Directions <FaArrowRight className="ml-2" />
          </a>
        </div>

        {/* ========== FORM & FAQ SECTION ========== */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: 2x2 Grid Form */}
          <div className="lg:w-8/12 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/50">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Send us a Message
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              We typically reply within 5 minutes during business hours.
            </p>

            {uiState.isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center text-green-700">
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
                  icon={<MdEmail className="text-lg" />}
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
                  icon={<MdPhone className="text-lg" />}
                  activeField={uiState.activeField}
                  setActiveField={(f) =>
                    setUiState((prev) => ({ ...prev, activeField: f }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
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
                  className={`w-full bg-gray-50 text-sm text-gray-800 p-4 rounded-xl outline-none transition-all duration-300 border-2 resize-none ${
                    uiState.activeField === "message"
                      ? "border-blue-500 bg-white shadow-md"
                      : "border-transparent hover:border-gray-200"
                  }`}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={uiState.isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center disabled:opacity-70"
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

          {/* Right: Compact FAQ & Socials */}
          <div className="lg:w-4/12 flex flex-col gap-8">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/50 flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaQuestionCircle className="text-blue-500 mr-2" /> Quick FAQ
              </h3>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="font-bold text-sm text-gray-800">
                    What are your shipping options?
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    We offer standard (3-5 days) and express (1-2 days) shipping
                    island-wide.
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="font-bold text-sm text-gray-800">
                    How do I return an item?
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Items can be returned within 30 days of purchase in original
                    condition.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://web.facebook.com/p/Githmi-Sports-Goods-61559424647331/?_rdc=1&_rdr#"
                  className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/githmisportsshop/"
                  className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-green-100 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
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
          <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-slideUp">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex justify-between items-center">
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
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div ref={chatRef} className="h-64 overflow-y-auto p-4 bg-gray-50">
              {chatState.messages.map((msg, index) => (
                <ChatMessage key={index} {...msg} />
              ))}
            </div>
            <form
              onSubmit={handleChatSend}
              className="p-3 bg-white border-t flex gap-2"
            >
              <input
                type="text"
                value={chatState.input}
                onChange={(e) =>
                  setChatState((prev) => ({ ...prev, input: e.target.value }))
                }
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm border rounded-full outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!chatState.input.trim()}
                className="w-9 h-9 bg-blue-600 text-white rounded-full flex justify-center items-center disabled:opacity-50"
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
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
        >
          <BsChatDots className="text-2xl" />
        </button>
      </div>

      {/* ========== STYLES ========== */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
