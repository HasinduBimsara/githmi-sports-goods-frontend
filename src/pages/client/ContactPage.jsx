import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPaperPlane,
  FaClock,
  FaHeadset,
  FaCheckCircle,
  FaCopy,
  FaStar,
  FaArrowRight,
  FaGlobe,
  FaShieldAlt,
  FaRocket,
  FaUser,
  FaComment,
  FaQuestionCircle,
  FaBuilding,
  FaHeart,
  FaBell,
  FaGift,
  FaTruck,
  FaCreditCard,
  FaUndo,
  FaShieldAlt as FaShield,
  FaCertificate,
  FaAward,
} from "react-icons/fa";
import {
  MdOutlineSupportAgent,
  MdVerified,
  MdEmail,
  MdPhone,
  MdChat,
} from "react-icons/md";
import { BsChatDots, BsShieldCheck, BsCheck2Circle } from "react-icons/bs";
import { HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import { IoMdCall, IoMdTime } from "react-icons/io";

// ==================== COMPONENTS ====================

// Section Header Component
const SectionHeader = ({
  icon,
  title,
  subtitle,
  gradient = "from-blue-600 to-purple-600",
}) => (
  <div className="flex items-center mb-8">
    <div
      className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}
    >
      <div className="text-2xl text-white">{icon}</div>
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ icon, value, label }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description, gradient }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
    <div
      className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

// Contact Card Component
const ContactCard = ({
  icon,
  title,
  info,
  description,
  gradient,
  action,
  onCopy,
}) => (
  <div className="group relative bg-white rounded-2xl shadow-xl p-6 hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl border border-gray-100">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
    ></div>

    <div
      className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
    >
      {icon}
    </div>

    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-lg font-semibold text-gray-800 mb-2 break-all">{info}</p>
    <p className="text-gray-500 text-sm mb-4">{description}</p>

    {action ? (
      <a
        href={action}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 group/link"
      >
        Contact Now
        <FaArrowRight className="ml-2 text-xs group-hover/link:translate-x-1 transition-transform" />
      </a>
    ) : (
      <button
        onClick={onCopy}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 group/button"
      >
        <FaCopy className="mr-2 group-hover/button:scale-110 transition-transform" />
        {description === "Copied!" ? "Copied!" : "Copy Hours"}
      </button>
    )}
  </div>
);

// Social Media Card Component
const SocialCard = ({ icon, label, color, followers, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className={`${color} group relative overflow-hidden rounded-xl p-4 text-white transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl`}
  >
    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
    <div className="flex items-center space-x-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-xs opacity-90">{followers} followers</div>
      </div>
    </div>
  </a>
);

// FAQ Item Component
const FAQItem = ({ question, answer, category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <FaQuestionCircle className="text-blue-500 flex-shrink-0" />
          <span className="font-medium text-gray-900 text-left">
            {question}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
            {category}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-48" : "max-h-0"}`}
      >
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 text-sm">{answer}</p>
        </div>
      </div>
    </div>
  );
};

// Form Input Component
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
  <div className="group">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setActiveField(name)}
        onBlur={() => setActiveField(null)}
        required={required}
        className={`w-full ${icon ? "pl-10" : "px-4"} pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-0 outline-none transition-all duration-300 ${
          activeField === name
            ? "border-blue-500 bg-white shadow-lg"
            : "border-gray-200 hover:border-gray-300"
        }`}
        placeholder={placeholder}
      />
    </div>
  </div>
);

// TextArea Component
const FormTextArea = ({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  activeField,
  setActiveField,
}) => (
  <div className="group">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      onFocus={() => setActiveField(name)}
      onBlur={() => setActiveField(null)}
      required={required}
      rows="5"
      className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-0 outline-none transition-all duration-300 resize-none ${
        activeField === name
          ? "border-blue-500 bg-white shadow-lg"
          : "border-gray-200 hover:border-gray-300"
      }`}
      placeholder={placeholder}
    ></textarea>
  </div>
);

// Location Info Component
const LocationInfo = ({ icon, text, href }) => (
  <a
    href={href}
    className="flex items-center group p-2 hover:bg-white/5 rounded-lg transition-all duration-300"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div className="text-blue-400 mr-3 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
      {text}
    </span>
  </a>
);

// Success Message Component
const SuccessMessage = ({ onClose }) => (
  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slideDown">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <FaCheckCircle className="text-green-500 text-xl mr-3" />
        <div>
          <p className="text-green-800 font-medium">
            ✓ Message sent successfully!
          </p>
          <p className="text-green-600 text-sm">
            We'll get back to you within 24 hours.
          </p>
        </div>
      </div>
      <button onClick={onClose} className="text-green-600 hover:text-green-800">
        ✕
      </button>
    </div>
  </div>
);

// Chat Message Component
const ChatMessage = ({ message, type }) => (
  <div
    className={`mb-4 flex ${type === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-[80%] p-3 rounded-2xl ${
        type === "user"
          ? "bg-blue-600 text-white rounded-br-none"
          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
      }`}
    >
      {message}
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================

export default function ContactPage() {
  // ==================== STATE MANAGEMENT ====================
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
    copied: false,
    chatOpen: false,
  });

  const [chatState, setChatState] = useState({
    messages: [{ type: "bot", text: "👋 Hi! How can I help you today?" }],
    input: "",
  });

  // Refs
  const chatRef = useRef(null);
  const formRef = useRef(null);

  // ==================== DATA ====================
  const stats = [
    { icon: "😊", value: "10K+", label: "Happy Customers" },
    { icon: "🎫", value: "25K+", label: "Support Tickets" },
    { icon: "⚡", value: "98%", label: "Response Rate" },
    { icon: "⏱️", value: "< 5min", label: "Avg. Response" },
  ];

  const features = [
    {
      icon: <FaRocket />,
      title: "Lightning Fast",
      description: "Average response time under 5 minutes",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Private",
      description: "End-to-end encrypted conversations",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <MdVerified />,
      title: "Expert Team",
      description: "Certified support professionals",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: "Phone Support",
      info: "+94 91 2255125",
      description: "24/7 Hotline Support",
      gradient: "from-blue-500 to-blue-600",
      action: "tel:+94912255125",
    },
    {
      icon: <FaWhatsapp />,
      title: "WhatsApp",
      info: "+94 70 1010 225",
      description: "Instant Messaging",
      gradient: "from-green-500 to-green-600",
      action: "https://wa.me/94701010225",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      info: "support@company.com",
      description: "24h Response Time",
      gradient: "from-red-500 to-red-600",
      action: "mailto:support@company.com",
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      info: "24/7 Support",
      description: "Always Available",
      gradient: "from-purple-500 to-purple-600",
      action: null,
    },
  ];

  const socialLinks = [
    {
      icon: <FaFacebook />,
      label: "Facebook",
      color: "bg-[#1877F2]",
      followers: "12.5K",
      link: "#",
    },
    {
      icon: <FaInstagram />,
      label: "Instagram",
      color: "bg-[#E4405F]",
      followers: "8.2K",
      link: "#",
    },
    {
      icon: <FaTwitter />,
      label: "Twitter",
      color: "bg-[#1DA1F2]",
      followers: "5.7K",
      link: "#",
    },
    {
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      color: "bg-[#25D366]",
      followers: "3.1K",
      link: "#",
    },
  ];

  const faqs = [
    {
      question: "What are your shipping options?",
      answer:
        "We offer standard (3-5 days) and express (1-2 days) shipping island-wide. International shipping takes 7-14 days.",
      category: "Shipping",
    },
    {
      question: "How do I return an item?",
      answer:
        "Items can be returned within 30 days of purchase. Visit our returns center or contact support for assistance.",
      category: "Returns",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept Visa, Mastercard, Amex, PayPal, and Cash on Delivery for orders under Rs. 50,000.",
      category: "Payment",
    },
    {
      question: "Do you offer warranty?",
      answer:
        "Yes, all products come with manufacturer warranty. Extended warranty available for purchase.",
      category: "Warranty",
    },
  ];

  const quickLinks = [
    { icon: <FaTruck />, label: "Shipping Info", link: "/shipping" },
    { icon: <FaUndo />, label: "Returns", link: "/returns" },
    { icon: <FaCreditCard />, label: "Payment", link: "/payment" },
    { icon: <FaShield />, label: "Warranty", link: "/warranty" },
  ];

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatState.messages]);

  // ==================== HANDLERS ====================
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUiState((prev) => ({ ...prev, isSubmitting: true }));

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setUiState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
      }));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      setTimeout(() => {
        setUiState((prev) => ({ ...prev, isSubmitted: false }));
      }, 5000);
    }, 1500);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setUiState((prev) => ({ ...prev, copied: true }));
    setTimeout(() => setUiState((prev) => ({ ...prev, copied: false })), 2000);
  };

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatState.input.trim()) return;

    setChatState((prev) => ({
      messages: [...prev.messages, { type: "user", text: prev.input }],
      input: "",
    }));

    setTimeout(() => {
      const responses = [
        "Thanks for your message! Our team will respond shortly.",
        "I understand. Let me connect you with an agent.",
        "Great question! Check our FAQ for quick answers.",
        "I'm here to help! Could you provide more details?",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, { type: "bot", text: randomResponse }],
      }));
    }, 1000);
  };

  // ==================== RENDER ====================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* ========== HERO SECTION ========== */}
        <section className="text-center mb-20">
          <div className="inline-block animate-bounce-slow mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              🎉 24/7 Customer Support Available
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Get in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative">
              Touch
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 100 5"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 L100,5"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're here to help 24/7. Choose your preferred contact method and
            get instant support from our expert team.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </section>

        {/* ========== FEATURES SECTION ========== */}
        <section className="mb-20">
          <SectionHeader
            icon={<FaRocket />}
            title="Why Choose Our Support"
            subtitle="Experience the best customer service"
            gradient="from-orange-500 to-red-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        {/* ========== CONTACT CARDS SECTION ========== */}
        <section className="mb-20">
          <SectionHeader
            icon={<MdPhone />}
            title="Contact Methods"
            subtitle="Choose your preferred way to reach us"
            gradient="from-green-500 to-teal-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <ContactCard
                key={index}
                {...item}
                onCopy={() => handleCopy("24/7 Support - Always Available")}
              />
            ))}
          </div>
        </section>

        {/* ========== MAIN CONTENT GRID ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* LEFT COLUMN - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 relative overflow-hidden">
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-bl-full opacity-5"></div>

              <div className="relative">
                <SectionHeader
                  icon={<MdOutlineSupportAgent />}
                  title="Send us a Message"
                  subtitle="We typically reply within 5 minutes"
                />

                {uiState.isSubmitted && (
                  <SuccessMessage
                    onClose={() =>
                      setUiState((prev) => ({ ...prev, isSubmitted: false }))
                    }
                  />
                )}

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Your Name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      icon={<FaUser className="text-sm" />}
                      activeField={uiState.activeField}
                      setActiveField={(field) =>
                        setUiState((prev) => ({ ...prev, activeField: field }))
                      }
                    />

                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                      icon={<HiOutlineMail className="text-sm" />}
                      activeField={uiState.activeField}
                      setActiveField={(field) =>
                        setUiState((prev) => ({ ...prev, activeField: field }))
                      }
                    />
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+94 77 123 4567"
                      icon={<IoMdCall className="text-sm" />}
                      activeField={uiState.activeField}
                      setActiveField={(field) =>
                        setUiState((prev) => ({ ...prev, activeField: field }))
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
                      icon={<FaComment className="text-sm" />}
                      activeField={uiState.activeField}
                      setActiveField={(field) =>
                        setUiState((prev) => ({ ...prev, activeField: field }))
                      }
                    />
                  </div>

                  {/* Message Field */}
                  <FormTextArea
                    label="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Please describe your inquiry in detail..."
                    activeField={uiState.activeField}
                    setActiveField={(field) =>
                      setUiState((prev) => ({ ...prev, activeField: field }))
                    }
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={uiState.isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {uiState.isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <FaPaperPlane className="ml-3 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Form Footer */}
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By submitting, you agree to our{" "}
                    <Link
                      to="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - FAQ, Social, Location */}
          <div className="space-y-8">
            {/* FAQ Section */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8">
              <SectionHeader
                icon={<FaQuestionCircle />}
                title="Frequently Asked"
                subtitle="Quick answers to common questions"
                gradient="from-green-500 to-emerald-500"
              />

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <FAQItem key={index} {...faq} />
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Quick Links
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.link}
                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all"
                    >
                      <span className="text-blue-500">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8">
              <SectionHeader
                icon={<FaGlobe />}
                title="Connect With Us"
                subtitle="Follow us on social media"
                gradient="from-pink-500 to-rose-500"
              />

              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, index) => (
                  <SocialCard key={index} {...social} />
                ))}
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <BsCheck2Circle className="text-green-500 text-xl mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Verified</span>
                  </div>
                  <div className="text-center">
                    <FaCertificate className="text-blue-500 text-xl mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Secure</span>
                  </div>
                  <div className="text-center">
                    <FaAward className="text-yellow-500 text-xl mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Awarded</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-6 lg:p-8 text-white">
              <SectionHeader
                icon={<FaBuilding />}
                title="Visit Our Store"
                subtitle="We'd love to meet you"
                gradient="from-blue-400 to-blue-600"
              />

              <div className="space-y-3 mb-6">
                <LocationInfo
                  icon={<HiOutlineLocationMarker />}
                  text="147 Kotiawa Road, Nugegoda, Sri Lanka"
                  href="https://maps.google.com/?q=147+Kotiawa+Road+Nugegoda"
                />

                <LocationInfo
                  icon={<IoMdCall />}
                  text="+94 11 755 1111"
                  href="tel:+94911234567"
                />

                <LocationInfo
                  icon={<HiOutlineMail />}
                  text="support@company.com"
                  href="mailto:support@company.com"
                />

                <LocationInfo
                  icon={<IoMdTime />}
                  text="Mon - Sun: 24/7"
                  href="#"
                />
              </div>

              {/* Interactive Map */}
              <div className="relative h-48 bg-gray-700 rounded-xl overflow-hidden group cursor-pointer">
                <iframe
                  title="Store Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467682337!2d79.8877!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMzcuNiJOIDc5wqA1MycxNS4yIkU!5e0!3m2!1sen!2slk!4v1234567890"
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: "grayscale(0.5) contrast(1.2)" }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <span className="text-gray-900 font-medium text-sm">
                      Open in Google Maps →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== CTA SECTION ========== */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 lg:p-12 text-white text-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-white/10 transform -skew-y-12 group-hover:skew-y-12 transition-transform duration-700"></div>

            <div className="relative max-w-4xl mx-auto">
              {/* Icons */}
              <div className="flex justify-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FaWhatsapp className="text-3xl" />
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MdChat className="text-3xl" />
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FaPhone className="text-3xl" />
                </div>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Need Immediate Assistance?
              </h2>

              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Our support team is available 24/7. Average response time is
                under 2 minutes!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() =>
                    setUiState((prev) => ({ ...prev, chatOpen: true }))
                  }
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl text-lg shadow-2xl transform hover:-translate-y-1 hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
                >
                  <MdChat className="mr-2 group-hover:rotate-12 transition-transform" />
                  Start Live Chat
                  <FaArrowRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="tel:+94911234567"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-xl text-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
                >
                  <IoMdCall className="mr-2 group-hover:rotate-12 transition-transform" />
                  Call Us Now
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm">
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                  <BsShieldCheck className="mr-2" />
                  24/7 Availability
                </div>
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                  <FaStar className="mr-2" />
                  4.9/5 Rating
                </div>
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                  <FaCheckCircle className="mr-2" />
                  Verified Support
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== NEWSLETTER SECTION ========== */}
        <section className="bg-white rounded-3xl shadow-xl p-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBell className="text-2xl text-white" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Stay Updated with Our Newsletter
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get the latest updates on products, exclusive offers, and upcoming
              events delivered straight to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1 relative">
                <HiOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
              >
                Subscribe
                <FaHeart className="ml-2 text-sm group-hover:scale-110 transition-transform" />
              </button>
            </form>

            <div className="flex items-center justify-center space-x-2 mt-6">
              <FaGift className="text-yellow-500" />
              <p className="text-xs text-gray-500">
                Subscribe and get 10% off your first purchase!
              </p>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>
      </div>

      {/* ========== LIVE CHAT WIDGET ========== */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Window */}
        {uiState.chatOpen && (
          <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <BsChatDots className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Live Chat Support</h3>
                    <div className="flex items-center text-xs opacity-90">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
                      Online • Reply instantly
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setUiState((prev) => ({ ...prev, chatOpen: false }))
                  }
                  className="hover:bg-white/20 rounded-lg p-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatRef} className="h-80 overflow-y-auto p-4 bg-gray-50">
              {chatState.messages.map((msg, index) => (
                <ChatMessage key={index} {...msg} />
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSend} className="p-4 bg-white border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatState.input}
                  onChange={(e) =>
                    setChatState((prev) => ({ ...prev, input: e.target.value }))
                  }
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!chatState.input.trim()}
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Chat Button */}
        <button
          onClick={() =>
            setUiState((prev) => ({ ...prev, chatOpen: !prev.chatOpen }))
          }
          className="group relative w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
        >
          <BsChatDots className="text-2xl" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>

          {/* Tooltip */}
          <span className="absolute right-16 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us
          </span>
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

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
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
