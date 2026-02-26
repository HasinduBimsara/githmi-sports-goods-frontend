import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaStar,
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
       * // Then filter or slice the response data into your different states
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

  const categories = [
    {
      name: "Electronics",
      count: 45,
      color: "bg-gradient-to-r from-blue-500 to-cyan-400",
      image: "🔌",
    },
    {
      name: "Fashion",
      count: 120,
      color: "bg-gradient-to-r from-pink-500 to-rose-400",
      image: "👕",
    },
    {
      name: "Home & Living",
      count: 78,
      color: "bg-gradient-to-r from-green-500 to-emerald-400",
      image: "🏠",
    },
    {
      name: "Sports",
      count: 56,
      color: "bg-gradient-to-r from-orange-500 to-yellow-400",
      image: "⚽",
    },
    {
      name: "Books",
      count: 89,
      color: "bg-gradient-to-r from-purple-500 to-violet-400",
      image: "📚",
    },
    {
      name: "Beauty",
      count: 67,
      color: "bg-gradient-to-r from-red-500 to-pink-400",
      image: "💄",
    },
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
    <div className="w-full">
      {/* 1. Hero Section
      <section className="relative w-full h-[600px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Amazing{" "}
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Products Online
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-xl">
              Shop the latest trends in electronics, fashion, home goods, and
              more.
            </p>
            <div className="flex gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:-translate-y-1 transition-all duration-300"
              >
                Shop Now <FaArrowRight className="ml-3" />
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* 2. Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:-translate-y-2 transition-transform"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Flash Deals (Urgency right after features) */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-red-200">
              <FaBolt className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Flash Deals</h2>
              <p className="text-red-500 font-semibold">Ends in 24 hours!</p>
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

      {/* 4. Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All <FaChevronRight className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to="/products"
                className={`${cat.color} rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform shadow-lg`}
              >
                <div className="text-4xl mb-4">{cat.image}</div>
                <h3 className="font-bold text-lg">{cat.name}</h3>
                <p className="text-white/80 text-sm">{cat.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. New Arrivals */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-200">
              <FaBoxOpen className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
              <p className="text-gray-600">Fresh gear just dropped</p>
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

      {/* 6. Featured Products */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-200">
              <MdTrendingUp className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-600">Handpicked items just for you</p>
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

      {/* 7. Trending Now */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-orange-200">
              <FaFire className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
              <p className="text-gray-600">What everyone is buying right now</p>
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

      {/* 8. Top Rated (Social Proof before the final CTA) */}
      <section className="py-16 bg-gradient-to-t from-yellow-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-200">
              <FaTrophy className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Top Rated</h2>
              <p className="text-gray-600">5-star customer favorites</p>
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

      {/* 9. CTA Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full mb-6">
                <FaTag className="mr-2" />{" "}
                <span className="font-medium">Limited Time Offer</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Get <span className="text-yellow-300">25% OFF</span> Your First
                Order
              </h2>
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-xl hover:-translate-y-1 transition-all inline-block shadow-lg"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
