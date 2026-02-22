import { useState } from "react";
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
} from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FaPhone className="text-xl" />,
      title: "Phone Support",
      info: "+94 91 2255125 ",
      description: "24/7 Hotline Support",
      color: "bg-blue-500",
      delay: "100",
    },
    {
      icon: <FaWhatsapp className="text-xl" />,
      title: "WhatsApp",
      info: "+94 70 1010 225",
      description: "Instant Message Support",
      color: "bg-green-500",
      delay: "200",
    },
    {
      icon: <FaEnvelope className="text-xl" />,
      title: "Email",
      info: "githmisportgoods@Gmail.com",
      description: "Response within 24 hours",
      color: "bg-red-500",
      delay: "300",
    },
    {
      icon: <FaClock className="text-xl" />,
      title: "Business Hours",
      info: "Mon - Sun: 24/7",
      description: "Always Available",
      color: "bg-purple-500",
      delay: "400",
    },
  ];

  const socialLinks = [
    {
      icon: <FaFacebook />,
      label: "Facebook",
      color: "hover:bg-blue-600",
      link: "#",
    },
    {
      icon: <FaInstagram />,
      label: "Instagram",
      color: "hover:bg-pink-600",
      link: "#",
    },
    {
      icon: <FaTwitter />,
      label: "Twitter",
      color: "hover:bg-sky-500",
      link: "#",
    },
    {
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      color: "hover:bg-green-600",
      link: "#",
    },
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "3-5 business days island-wide",
    },
    {
      question: "Do you accept returns?",
      answer: "Yes, within 30 days of purchase",
    },
    {
      question: "Is COD available?",
      answer: "Yes, cash on delivery available",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="w-full max-w-[1400px] mx-auto px-4 py-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help. Contact us for any inquiries, support, or
            feedback.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay={item.delay}
            >
              <div
                className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {item.info}
              </p>
              <p className="text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Contact Form & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <MdOutlineSupportAgent className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Send us a Message
                </h2>
                <p className="text-gray-500">
                  We'll respond as soon as possible
                </p>
              </div>
            </div>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-700 font-medium">
                  ✓ Thank you! Your message has been sent successfully.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="+94 77 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <FaPaperPlane className="ml-3" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information & Map */}
          <div>
            {/* FAQ Section */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <FaHeadset className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Frequently Asked
                  </h2>
                  <p className="text-gray-500">
                    Quick answers to common questions
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      className={`${social.color} w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 hover:text-white transition-all duration-300 transform hover:-translate-y-1`}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 text-white">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <FaMapMarkerAlt className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Our Headquarters</h2>
                  <p className="text-gray-300">Visit us or drop by anytime</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="flex items-start">
                  <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
                  <span>147 Kotiawa Road, Nugegoda, Sri Lanka</span>
                </p>
                <p className="flex items-center">
                  <FaPhone className="mr-3 flex-shrink-0" />
                  <span>+94 11 755 1111</span>
                </p>
                <p className="flex items-center">
                  <FaEnvelope className="mr-3 flex-shrink-0" />
                  <span>support@kapruka.com</span>
                </p>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-700 rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaMapMarkerAlt className="text-2xl" />
                  </div>
                  <p className="text-gray-300">Interactive Map</p>
                  <p className="text-sm text-gray-400">
                    (Would show location here)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Chat CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaWhatsapp className="text-3xl" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Need Immediate Help?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start a live chat with our support team. We're available 24/7!
            </p>
            <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl text-lg shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              Start Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
