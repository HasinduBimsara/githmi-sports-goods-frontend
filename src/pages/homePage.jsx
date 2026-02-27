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
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-2xl transition-shadow border border-gray-100 dark:border-gray-700 group">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={
                        product.image ||
                        product.imageUrls?.[0] ||
                        "https://placehold.co/300x400"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* ADDED MOTION: Hover scale and rotate on the top-right badge */}
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-400 dark:text-gray-300 hover:text-red-500 hover:scale-125 hover:rotate-12 cursor-pointer transition-all duration-300 z-20">
                      <FaFire className={badgeColor} />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow relative z-10 bg-white dark:bg-gray-800">
                    <p
                      className={`text-xs font-bold uppercase tracking-wider mb-1 ${badgeColor}`}
                    >
                      {product.category || "Trending"}
                    </p>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${product.price}
                      </span>
                      {/* ADDED MOTION: Hover scale and pop up on the shopping bag */}
                      <button className="bg-gray-900 dark:bg-gray-700 text-white p-2 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-sm hover:shadow-md">
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
    <div className="w-full font-sans dark:bg-gray-900 transition-colors duration-300">
      {/* 1. LINE-WISE CATEGORY STRIP */}
      <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center overflow-x-auto py-3 hide-scrollbar">
            <div className="flex items-center space-x-3 sm:space-x-5 whitespace-nowrap">
              <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider transition-colors">
                Top Sports:
              </span>
              {sportsCategories.map((cat, index) => (
                <React.Fragment key={index}>
                  <Link
                    to="/products"
                    className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-0.5 inline-block transition-all duration-300"
                  >
                    {cat}
                  </Link>
                  {index < sportsCategories.length - 1 && (
                    <span className="text-gray-300 dark:text-gray-700 text-lg leading-none select-none transition-colors">
                      •
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Flash Deals */}
      <section className="pt-8 pb-8 bg-gradient-to-b from-red-50 to-white dark:from-red-900/10 dark:to-gray-900 overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-4">
          {/* ADDED MOTION: group class wraps the header */}
          <div className="flex items-center mb-6 group cursor-default">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-red-200 dark:shadow-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
              <FaBolt className="text-2xl text-red-600 dark:text-red-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
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
      <section className="pt-8 pb-8 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/10 overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-4">
          {/* ADDED MOTION: group class wraps the header */}
          <div className="flex items-center mb-6 group cursor-default">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-200 dark:shadow-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
              <FaBoxOpen className="text-2xl text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                New Arrivals
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
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
      <section className="pt-8 pb-8 bg-white dark:bg-gray-900 overflow-hidden border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          {/* ADDED MOTION: group class wraps the header */}
          <div className="flex items-center mb-6 group cursor-default">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-200 dark:shadow-none transition-transform duration-500 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1">
              <MdTrendingUp className="text-2xl text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Featured Products
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
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
      <section className="pt-8 pb-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 overflow-hidden border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          {/* ADDED MOTION: group class wraps the header */}
          <div className="flex items-center mb-6 group cursor-default">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-orange-200 dark:shadow-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
              <FaFire className="text-2xl text-orange-500 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Trending Now
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
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
      <section className="pt-8 pb-16 bg-gradient-to-t from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-900 overflow-hidden border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          {/* ADDED MOTION: group class wraps the header */}
          <div className="flex items-center mb-6 group cursor-default">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-200 dark:shadow-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[15deg]">
              <FaTrophy className="text-2xl text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Top Rated
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
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
      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col lg:flex-row transition-colors duration-300">
            {/* Left side text/cta */}
            <div className="lg:w-1/2 p-12 relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 dark:bg-gray-700/50 rounded-full mb-8 w-max border border-white/20 dark:border-gray-600">
                <FaTag className="mr-2 text-yellow-400" />
                <span className="font-semibold text-sm text-white">
                  Limited Time Offer
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white uppercase italic">
                Get <span className="text-yellow-400">25% OFF</span> <br />
                Your First Order
              </h2>
              <p className="text-gray-300 dark:text-gray-400 text-lg mb-8 max-w-md">
                Sign up today to unlock exclusive discounts, early access to
                sales, and premium support.
              </p>
              <Link
                to="/register"
                className="group px-10 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-lg rounded-xl hover:-translate-y-1 transition-all inline-flex items-center w-max shadow-lg"
              >
                Sign Up Free
                {/* ADDED MOTION: Arrow slides right on hover */}
                <FaArrowRight className="ml-3 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>

            {/* Right side features block */}
            <div className="lg:w-1/2 bg-gray-800 dark:bg-gray-900/50 p-8 lg:p-12 relative z-10 border-l border-gray-700 dark:border-gray-800 transition-colors duration-300">
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 dark:border-gray-700 pb-4">
                Why Shop With Us?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-start text-left group cursor-default"
                  >
                    {/* ADDED MOTION: Added group-hover rotation and pop-up */}
                    <div
                      className={`bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-6 transition-all duration-300 shadow-md`}
                    >
                      {feature.icon}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
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

      {/* Safe inline styles to prevent Vite crash */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </div>
  );
}
