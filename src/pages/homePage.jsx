import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
} from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
import ProductCard from "../components/product-card";
import Loader from "../components/loader";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // Since you might not have these endpoints, use your existing endpoint
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/`,
      );

      // Take first 8 products for demo
      setFeaturedProducts(response.data.slice(0, 4));
      setTrendingProducts(response.data.slice(4, 8));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaTruck className="text-3xl" />,
      title: "Free Delivery",
      description: "Free shipping on all orders above $50",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Secure Payment",
      description: "100% secure and encrypted payments",
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

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-gradient-to-r from-blue-500 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-gradient-to-r from-purple-500 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <span className="text-white font-medium">🎉 New Season Sale</span>
              <span className="ml-2 text-yellow-300">Up to 60% OFF</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Amazing
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Products Online
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-xl">
              Shop the latest trends in electronics, fashion, home goods, and
              more. Quality products with fast delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
              >
                Shop Now
                <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>

              <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                View Deals
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-gray-400">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4.8</div>
                <div className="flex items-center text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar className="text-gray-400" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
              <div className="absolute top-0 w-80 h-80 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl shadow-2xl transform rotate-12">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2"
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

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
              <FaChevronRight className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products`}
                className={`${category.color} rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl`}
              >
                <div className="text-4xl mb-4">{category.image}</div>
                <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                <p className="text-white/80 text-sm">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <MdTrendingUp className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View All Products
              <FaArrowRight className="ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
              <FaFire className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Trending Now
              </h2>
              <p className="text-gray-600">What everyone is buying right now</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white text-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full translate-y-32 -translate-x-32"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <FaTag className="mr-2" />
                <span className="font-medium">Limited Time Offer</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get <span className="text-yellow-300">25% OFF</span> Your First
                Order
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Sign up today and get exclusive discounts on your first
                purchase. Plus, free shipping on all orders!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Sign Up Free
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter and get exclusive deals, new arrivals,
              and special offers delivered straight to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Subscribe
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              By subscribing, you agree to our Privacy Policy
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
