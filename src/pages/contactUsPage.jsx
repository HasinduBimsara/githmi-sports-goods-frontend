import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
  FaBox,
  FaHome,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

export default function PaymentShippingPage() {
  const steps = [
    {
      icon: <FaShoppingCart />,
      title: "Select Products",
      description: "Browse and choose your favorite items",
    },
    {
      icon: <FaShoppingCart />,
      title: "Add to Cart",
      description: "Add selected items to your shopping cart",
    },
    {
      icon: <FaCreditCard />,
      title: "Checkout Order",
      description: "Proceed to checkout and review order",
    },
    {
      icon: <FaEnvelope />,
      title: "Enter Details",
      description: "Provide delivery and contact information",
    },
    {
      icon: <FaTruck />,
      title: "Product Delivery",
      description: "We ship your order island-wide",
    },
    {
      icon: <FaBox />,
      title: "Pay On Delivery",
      description: "Pay when your order arrives",
    },
  ];

  const brands = ["KAY GEE", "Li-NING", "STANFORDS", "TEXSTIRETCH", "YOKEX"];

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Cart", path: "/cart" },
    { name: "Blog", path: "/blog" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policies", path: "/privacy" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="w-full h-[70px] bg-white shadow-md flex items-center px-5">
        <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            mySports<span className="text-red-500">.</span>
          </Link>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-red-500">
              Home
            </Link>
            <Link to="/shop" className="text-gray-600 hover:text-red-500">
              Shop
            </Link>
            <Link to="/payment-shipping" className="text-red-500 font-semibold">
              Payment & Shipping
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-red-500">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1200px] mx-auto p-5">
        {/* Hero Section */}
        <div className="w-full bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-8 mb-8 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Payment And Shipping
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg mb-6 opacity-90">
              We collect payments on delivery. We ship orders island-wide, and
              guarantee delivery within 5 working days.
            </p>

            {/* Steps Process */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center text-center">
                    <div className="text-2xl mb-2">{step.icon}</div>
                    <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                    <p className="text-xs opacity-80">{step.description}</p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-[-15px] transform -translate-y-1/2">
                      <BsArrowRight className="text-white text-xl" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="w-full bg-white rounded-xl shadow-md p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">mySports</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            mysports.it - Buy affordable best quality sports items online from
            Sri Lanka.
          </p>
        </div>

        {/* Footer Content */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Navigation */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Navigations
            </h3>
            <ul className="space-y-2">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-red-500 flex items-center transition-colors"
                  >
                    <BsArrowRight className="mr-2 text-xs" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Brands
            </h3>
            <div className="space-y-3">
              {brands.map((brand, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors cursor-pointer"
                >
                  <p className="font-medium text-gray-700">{brand}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaHome className="mt-1 mr-3 text-red-500" />
                <p className="text-gray-600">No 46, Wewelwala Road, Galle</p>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-3 text-red-500" />
                <p className="text-gray-600">mysports.it@gmail.com</p>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-3 text-red-500" />
                <p className="text-gray-600">070 - 472 7562</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cookie Notice */}
        <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-1">
                Cookie Notice
              </h3>
              <p className="text-yellow-700">
                Your experience on this site will be improved by allowing
                cookies.
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Allow Cookies
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors">
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-gray-800 text-white py-6">
        <div className="w-full max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">
                mySports<span className="text-red-400">.</span>
              </h2>
              <p className="text-gray-300">
                Buy affordable best quality sports items online
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-gray-300 hover:text-white">
                Terms
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white">
                Privacy
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} mySports.it. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
