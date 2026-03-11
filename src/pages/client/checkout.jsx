import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TbTrash } from "react-icons/tb";
import { BsArrowLeft, BsShieldCheck } from "react-icons/bs";
import { FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(location.state?.items || []);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function placeOrder(event) {
    event.preventDefault();

    if (!name || !address || !phone) {
      toast.error("Please fill in all shipping details");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login before placing an order");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      name,
      address,
      phoneNumber: phone,
      items: cart.map((item) => ({
        productId: item.productId ?? item.id ?? item._id,
        quantity: item.quantity,
      })),
    };

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/order`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        localStorage.setItem("cart", JSON.stringify([]));
        toast.success("Order placed successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          navigate("/login");
        }
        toast.error(error?.response?.data?.message || "Order placement failed");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  const handleUpdateQuantity = (index, delta) => {
    setCart((prevCart) => {
      const nextCart = [...prevCart];
      const nextQuantity = nextCart[index].quantity + delta;
      nextCart[index] = {
        ...nextCart[index],
        quantity: Math.max(1, nextQuantity),
      };
      return nextCart;
    });
  };

  const handleRemoveItem = (productId) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => (item.productId ?? item.id ?? item._id) !== productId,
      ),
    );
  };

  function getTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function getTotalForLabelledPrice() {
    return cart.reduce(
      (total, item) =>
        total + (item.labeledPrice || item.price) * item.quantity,
      0,
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center bg-[#f8f6fb] dark:bg-gray-900 transition-colors duration-300 px-4">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 text-center">
          No items to checkout
        </h2>
        <Link
          to="/products"
          className="bg-gradient-to-r from-[#4f46e5] to-[#a855f7] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all flex items-center"
        >
          <BsArrowLeft className="mr-2" /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f8f6fb] dark:bg-gray-900 font-sans overflow-hidden transition-colors duration-300 py-10">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-300 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Checkout
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Complete your order details below
            </p>
          </div>
          <Link
            to="/cart"
            className="hidden md:flex items-center text-sm font-bold text-[#4f46e5] dark:text-[#a855f7] hover:underline"
          >
            <BsArrowLeft className="mr-2" /> Return to Cart
          </Link>
        </div>

        <form onSubmit={placeOrder} className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Shipping Information
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white py-3.5 pl-11 pr-4 rounded-xl outline-none transition-all duration-300 border-2 border-transparent dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 focus:border-[#4f46e5] dark:focus:border-[#4f46e5] focus:bg-white dark:focus:bg-gray-800 shadow-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white py-3.5 pl-11 pr-4 rounded-xl outline-none transition-all duration-300 border-2 border-transparent dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 focus:border-[#4f46e5] dark:focus:border-[#4f46e5] focus:bg-white dark:focus:bg-gray-800 shadow-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white py-3.5 pl-11 pr-4 rounded-xl outline-none transition-all duration-300 border-2 border-transparent dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 focus:border-[#4f46e5] dark:focus:border-[#4f46e5] focus:bg-white dark:focus:bg-gray-800 shadow-sm"
                      placeholder="Enter full delivery address"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Review Items
              </h2>
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={item.productId ?? item.id ?? item._id ?? index}
                    className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 border border-transparent dark:border-gray-700 transition-colors duration-300 group"
                  >
                    <div className="w-full sm:w-20 h-20 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                      <img
                        src={item.image || "https://placehold.co/150x150"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {item.altNames?.join(" | ") || "Standard"}
                      </p>
                      <p className="text-[#4f46e5] dark:text-[#a855f7] font-bold text-sm">
                        LKR {item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <button
                          type="button"
                          className="w-7 h-7 flex justify-center items-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-90 font-bold"
                          onClick={() => handleUpdateQuantity(index, -1)}
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-gray-900 dark:text-white text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="w-7 h-7 flex justify-center items-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-90 font-bold"
                          onClick={() => handleUpdateQuantity(index, 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="w-9 h-9 flex justify-center items-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors active:scale-90"
                        onClick={() =>
                          handleRemoveItem(item.productId ?? item.id ?? item._id)
                        }
                        title="Remove item"
                      >
                        <TbTrash className="text-lg" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    LKR {getTotalForLabelledPrice().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Discount</span>
                  <span className="font-medium text-green-500">
                    - LKR {(getTotalForLabelledPrice() - getTotal()).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white uppercase text-xs tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    Free
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#a855f7]">
                  LKR {getTotal().toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
                <BsShieldCheck className="text-green-500 text-lg" />
                Payments are secure and encrypted
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#4f46e5] to-[#a855f7] hover:from-[#4338ca] hover:to-[#9333ea] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex justify-center items-center text-lg disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Processing Order...</span>
                ) : (
                  "Place Order"
                )}
              </button>

              <Link
                to="/cart"
                className="mt-6 md:hidden flex justify-center items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <BsArrowLeft className="mr-2" /> Return to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>

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
      `,
        }}
      />
    </div>
  );
}
