import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaShoppingBag,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaFire,
  FaTag,
  FaChevronRight,
  FaBolt,
  FaTrophy,
  FaBoxOpen,
} from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
import Loader from "../components/loader";
import "./ProductSlider.css";

export default function HomePage() {
  // State for all 5 slider sections
  const [flashDeals, setFlashDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [topRated, setTopRated] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Safe Mock Data Generators for different categories
      const generateMockData = (prefix, category, basePrice) =>
        Array.from({ length: 18 }, (_, i) => ({
          id: `${prefix}-${i}`,
          name: `${category} Gear ${i + 1}`,
          price: (basePrice + i * 2.5).toFixed(2),
          image: `https://placehold.co/300x400/1A1A1A/FFF?text=${prefix}+${i + 1}`,
          category: category,
        }));

      // Populate states with distinct data
      setFlashDeals(generateMockData("flash", "Flash Deal", 15.99));
      setNewArrivals(generateMockData("new", "New Arrival", 49.99));
      setFeaturedProducts(generateMockData("feat", "Featured", 39.99));
      setTrendingProducts(generateMockData("trend", "Trending", 25.99));
      setTopRated(generateMockData("top", "Top Rated", 59.99));

      setLoading(false);

      /* * TO USE YOUR BACKEND LATER, REPLACE MOCK DATA WITH THIS LOGIC:
       * const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/`);
       */
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaTruck className="text-3xl" />,
      title: "Free Delivery",
      description: "Free shipping on orders over $50",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Secure Payment",
      description: "100% secure encrypted payments",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <FaHeadset className="text-3xl" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <FaShoppingBag className="text-3xl" />,
      title: "Easy Returns",
      description: "30-day return policy",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  // Modern, Sports-focused categories for the top line
  const sportsCategories = [
    "Cricket",
    "Football",
    "Fitness & Gym",
    "Tennis",
    "Badminton",
    "Swimming",
    "Basketball",
    "Athletics",
  ];

  // 100% Crash-Proof Slider Component
  const ProductSlider = ({ products, badgeColor = "text-orange-500" }) => {
    if (!products || products.length === 0) return null;

    return (
      <div className="slider-body">
        <div className="slider-wrapper">
          <div className="slider-track">
            {products.map((product, index) => (
              <div className="slide" key={product.id || index}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-2xl transition-shadow border border-gray-100">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={
                        product.image ||
                        product.imageUrls?.[0] ||
                        "https://placehold.co/300x400"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors">
                      <FaFire className={badgeColor} />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <p
                      className={`text-xs font-bold uppercase tracking-wider mb-1 ${badgeColor}`}
                    >
                      {product.category || "Trending"}
                    </p>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <button className="bg-gray-900 text-white p-2 rounded-xl hover:bg-blue-600 transition-colors">
                        <FaShoppingBag />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full font-sans">
      {/* 1. LINE-WISE CATEGORY STRIP (Moved to top, modern bullet design) */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center overflow-x-auto py-3 hide-scrollbar">
            <div className="flex items-center space-x-3 sm:space-x-5 whitespace-nowrap">
              <span className="text-sm font-black text-gray-900 uppercase tracking-wider">
                Top Sports:
              </span>
              {sportsCategories.map((cat, index) => (
                <React.Fragment key={index}>
                  <Link
                    to="/products"
                    className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {cat}
                  </Link>
                  {index < sportsCategories.length - 1 && (
                    <span className="text-gray-300 text-lg leading-none select-none">
                      •
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      {/* <section
        className="relative w-full h-[500px] overflow-hidden"
        style={{
          backgroundImage: 'url("/login-bg.jpg")', // Ensure this exists in your public folder
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl z-10">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight uppercase italic tracking-tight">
              Level Up Your Game
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-xl font-medium">
              Premium sports equipment, apparel, and accessories for champions.
            </p>
            <div className="flex gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                Shop Now <FaArrowRight className="ml-3" />
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* 3. Flash Deals */}
      <section className="pt-2 pb-8 bg-gradient-to-b from-red-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-red-200">
              <FaBolt className="text-2xl text-red-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Flash Deals
              </h2>
              <p className="text-red-500 font-medium mt-1">Ends in 24 hours!</p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <ProductSlider products={flashDeals} badgeColor="text-red-500" />
          )}
        </div>
      </section>

      {/* 4. New Arrivals */}
      <section className="pt-8 pb-8 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-200">
              <FaBoxOpen className="text-2xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                New Arrivals
              </h2>
              <p className="text-gray-500 font-medium mt-1">
                Fresh gear just dropped
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <ProductSlider products={newArrivals} badgeColor="text-blue-500" />
          )}
        </div>
      </section>

      {/* 5. Featured Products */}
      <section className="pt-8 pb-8 bg-white overflow-hidden border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-200">
              <MdTrendingUp className="text-2xl text-purple-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-gray-500 font-medium mt-1">
                Handpicked items just for you
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <ProductSlider
              products={featuredProducts}
              badgeColor="text-purple-500"
            />
          )}
        </div>
      </section>

      {/* 6. Trending Now */}
      <section className="pt-8 pb-8 bg-gradient-to-b from-gray-50 to-white overflow-hidden border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-orange-200">
              <FaFire className="text-2xl text-orange-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Trending Now
              </h2>
              <p className="text-gray-500 font-medium mt-1">
                What everyone is buying right now
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <ProductSlider
              products={trendingProducts}
              badgeColor="text-orange-500"
            />
          )}
        </div>
      </section>

      {/* 7. Top Rated */}
      <section className="pt-8 pb-16 bg-gradient-to-t from-yellow-50 to-white overflow-hidden border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-200">
              <FaTrophy className="text-2xl text-yellow-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Top Rated
              </h2>
              <p className="text-gray-500 font-medium mt-1">
                5-star customer favorites
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <ProductSlider products={topRated} badgeColor="text-yellow-500" />
          )}
        </div>
      </section>

      {/* 8. CTA Banner + Features Integrated */}
      <section className="py-0 bg-white border-t border-gray-100">
        <div className="container mx-auto px-0">
          {/* Main CTA Block */}
          <div className="bg-gray-900 overflow-hidden shadow-2xl relative flex flex-col lg:flex-row">
            {/* Left side text/cta */}
            <div className="lg:w-1/2 p-12 relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full mb-8 w-max border border-white/20">
                <FaTag className="mr-2 text-yellow-400" />
                <span className="font-semibold text-sm text-white">
                  Limited Time Offer
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white uppercase italic">
                Get <span className="text-yellow-400">25% OFF</span> <br />
                Your First Order
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-md">
                Sign up today to unlock exclusive discounts, early access to
                sales, and premium support.
              </p>
              <Link
                to="/register"
                className="px-10 py-4 bg-white text-gray-900 font-bold text-lg rounded-xl hover:-translate-y-1 transition-all inline-flex items-center w-max shadow-lg"
              >
                Sign Up Free <FaArrowRight className="ml-3" />
              </Link>
            </div>

            {/* Right side features block */}
            <div className="lg:w-1/2 bg-gray-800 p-8 lg:p-12 relative z-10 border-3 border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
                Why Shop With Us?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-start text-left group"
                  >
                    <div
                      className={`bg-white text-gray-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}
                    >
                      {feature.icon}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-snug">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>
      </section>

      {/* Hide Scrollbar for category strip */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
