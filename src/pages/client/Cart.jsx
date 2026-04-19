import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TbTrash } from "react-icons/tb";
import { BsArrowLeft, BsCartX, BsCash, BsCreditCard } from "react-icons/bs";
import toast from "react-hot-toast";
import getCart, {
  addToCart,
  getTotal,
  getTotalForLabelledPrice,
  removeFromCart,
} from "../../utils/cart";

export default function CartPage() {
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(() => {
    if (typeof window === "undefined") {
      return "cod";
    }
    return localStorage.getItem("paymentMethod") || "cod";
  });
  const navigate = useNavigate();
  const ensureLoggedInForCart = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login or register to update your cart");
      navigate("/login");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!cartLoaded) {
      const currentCart = getCart();
      setCart(currentCart);
      setCartLoaded(true);
    }
  }, [cartLoaded]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem("paymentMethod", paymentMethod);
  }, [paymentMethod]);

  const paymentOptions = [
    {
      id: "cod",
      label: "Cash on Delivery",
      description: "Pay when your items arrive.",
      icon: BsCash,
    },
    {
      id: "card",
      label: "Card Payment",
      description: "Pay securely at checkout.",
      icon: BsCreditCard,
    },
  ];

  // Handle Empty Cart State
  if (cartLoaded && cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center bg-[#f8f6fb] dark:bg-gray-900 transition-colors duration-300 px-4">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <BsCartX className="text-5xl text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 text-center">
          Your cart is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our
          premium sports gear now!
        </p>
        <Link
          to="/products"
          className="bg-gradient-to-r from-[#4f46e5] to-[#a855f7] hover:from-[#4338ca] hover:to-[#9333ea] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center"
        >
          <BsArrowLeft className="mr-2" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f8f6fb] dark:bg-gray-900 font-sans overflow-hidden transition-colors duration-300 py-10">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-300 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              You have {cart.length} item{cart.length !== 1 && "s"} in your cart
            </p>
          </div>
          <Link
            to="/products"
            className="hidden md:flex items-center text-sm font-bold text-[#4f46e5] dark:text-[#a855f7] hover:underline"
          >
            <BsArrowLeft className="mr-2" /> Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ========== LEFT: CART ITEMS ========== */}
          <div className="lg:w-2/3 space-y-4">
            {cart.map((item, index) => (
              <div
              key={item.cartItemId ?? item.productId ?? item.id ?? index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 relative group"
              >
                {/* Item Image */}
                <div className="w-full sm:w-28 h-28 flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <img
                    src={item.image || "https://placehold.co/150x150"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 w-full text-center sm:text-left">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                    {item.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 gap-2 flex items-center justify-center sm:justify-start">
                    {(item.size || item.color) ? (
                       <span className="flex items-center gap-2">
                         {item.color && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>{item.color}</span>}
                         {item.size && <span className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-bold">{item.size}</span>}
                       </span>
                    ) : item.altNames && item.altNames.length > 0
                      ? item.altNames.join(" | ")
                      : "Standard Edition"}
                  </p>
                  <p className="text-[#4f46e5] dark:text-[#a855f7] font-black text-lg">
                    LKR {item.price.toFixed(2)}
                  </p>
                </div>

                {/* Controls (Quantity & Delete) */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Quantity Pill */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
                    <button
                      className="w-8 h-8 flex justify-center items-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all active:scale-90 font-bold"
                      onClick={() => {
                        if (!ensureLoggedInForCart()) {
                          return;
                        }
                        addToCart(item, -1);
                        setCartLoaded(false);
                      }}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900 dark:text-white text-sm">
                      {item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex justify-center items-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all active:scale-90 font-bold"
                      onClick={() => {
                        if (!ensureLoggedInForCart()) {
                          return;
                        }
                        addToCart(item, 1);
                        setCartLoaded(false);
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="hidden sm:block w-24 text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      LKR {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Trash Button */}
                  <button
                    className="w-10 h-10 flex justify-center items-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors active:scale-90"
                    onClick={() => {
                      if (!ensureLoggedInForCart()) {
                        return;
                      }
                      removeFromCart(item.cartItemId ?? item.productId ?? item.id);
                      setCartLoaded(false);
                    }}
                    title="Remove item"
                  >
                    <TbTrash className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ========== RIGHT: ORDER SUMMARY ========== */}
          <div className="lg:w-1/3">
            <div className="space-y-6 sticky top-24">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {paymentOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = paymentMethod === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 rounded-2xl border p-3 cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#4f46e5] bg-[#4f46e5]/5 dark:bg-[#4f46e5]/10"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={option.id}
                          checked={isSelected}
                          onChange={() => setPaymentMethod(option.id)}
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-[#4f46e5]/10 text-[#4f46e5] dark:text-[#a855f7]"
                              : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <Icon className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-900 dark:text-white">
                            {option.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                        <span
                          className={`w-4 h-4 rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-[#4f46e5] bg-[#4f46e5]"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
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
                    <span>Tax & Shipping</span>
                    <span className="text-xs italic">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#a855f7]">
                    LKR {getTotal().toFixed(2)}
                  </span>
                </div>

                {/* PROJECT COMMON BUTTON: Checkout */}
                <button
                  onClick={() => {
                    if (!ensureLoggedInForCart()) {
                      return;
                    }
                    navigate("/checkout", {
                      state: { items: cart, paymentMethod },
                    });
                  }}
                  className="w-full bg-gradient-to-r from-[#4f46e5] to-[#a855f7] hover:from-[#4338ca] hover:to-[#9333ea] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex justify-center items-center text-lg"
                >
                  Proceed to Checkout
                </button>

                {/* Mobile back link */}
                <Link
                  to="/products"
                  className="mt-4 md:hidden flex justify-center items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <BsArrowLeft className="mr-2" /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
