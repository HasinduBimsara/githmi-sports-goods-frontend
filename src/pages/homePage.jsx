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
  FaBolt,
  FaTrophy,
  FaBoxOpen,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
import Loader from "../components/loader";
import ShinyText from "../components/ShinyText";
import "./ProductSlider.css";

export default function HomePage() {
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
      const generateMockData = (prefix, category, basePrice) =>
        Array.from({ length: 18 }, (_, i) => ({
          id: `${prefix}-${i}`,
          name: `${category} Gear ${i + 1}`,
          price: (basePrice + i * 2.5).toFixed(2),
          image: `https://placehold.co/300x400/1A1A1A/FFF?text=${prefix}+${i + 1}`,
          category: category,
        }));

      setFlashDeals(generateMockData("flash", "Flash Deal", 15.99));
      setNewArrivals(generateMockData("new", "New Arrival", 49.99));
      setFeaturedProducts(generateMockData("feat", "Featured", 39.99));
      setTrendingProducts(generateMockData("trend", "Trending", 25.99));
      setTopRated(generateMockData("top", "Top Rated", 59.99));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const features = [
    {
      icon: (
        <FaTruck className="text-3xl transition-transform duration-500 group-hover:translate-x-3" />
      ),
      title: "Free Delivery",
      description: "Free shipping on orders over $50",
      shinyColor: "#3b82f6",
      shinyShine: "#ffffff",
    },
    {
      icon: (
        <FaShieldAlt className="text-3xl transition-transform duration-500 group-hover:scale-125" />
      ),
      title: "Secure Payment",
      description: "100% secure encrypted payments",
      shinyColor: "#22c55e",
      shinyShine: "#ffffff",
    },
    {
      icon: (
        <FaHeadset className="text-3xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
      ),
      title: "24/7 Support",
      description: "Round-the-clock customer support",
      shinyColor: "#a855f7",
      shinyShine: "#ffffff",
    },
    {
      icon: (
        <FaShoppingBag className="text-3xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:bounce" />
      ),
      title: "Easy Returns",
      description: "30-day return policy",
      shinyColor: "#f97316",
      shinyShine: "#ffffff",
    },
  ];

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
                      src={product.image || "https://placehold.co/300x400"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-400 dark:text-gray-300 hover:text-red-500 transition-all duration-300 z-20 hover:scale-125 hover:rotate-12">
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
                      <button className="bg-gray-900 dark:bg-gray-700 text-white p-2 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-sm active:scale-90 hover:-translate-y-1">
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
      {/* 1. TOP CATEGORY STRIP WITH SHINY EFFECT */}
      <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center overflow-x-auto py-3 hide-scrollbar">
            <div className="flex items-center space-x-3 sm:space-x-5 whitespace-nowrap">
              <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Top Sports:
              </span>
              {sportsCategories.map((cat, index) => (
                <React.Fragment key={index}>
                  <Link
                    to="/products"
                    className="hover:-translate-y-0.5 inline-block transition-all duration-300"
                  >
                    <ShinyText
                      text={cat}
                      speed={4}
                      delay={index * 0.2}
                      color="#4b5563"
                      shineColor="#4f46e5"
                      spread={50}
                      direction="right"
                      yoyo={true}
                      pauseOnHover={true}
                      disabled={false}
                    />
                  </Link>
                  {index < sportsCategories.length - 1 && (
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. FLASH DEALS */}
      <section className="pt-8 pb-8 bg-gradient-to-b from-red-50 to-white dark:from-red-900/10 dark:to-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6 group cursor-default">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-red-200 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
              <FaBolt className="text-2xl text-red-600 dark:text-red-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                <ShinyText
                  text="Flash Deals"
                  speed={3}
                  delay={0.3}
                  color="#b11616"
                  shineColor="#ffbb00"
                  spread={120}
                  direction="right"
                  yoyo
                  pauseOnHover
                  disabled={false}
                />
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

      {/* 3. NEW ARRIVALS */}
      <section className="pt-8 pb-8 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6 group cursor-default">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-200 transition-transform duration-500 group-hover:scale-125 group-hover:-translate-y-2">
              <FaBoxOpen className="text-2xl text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                <ShinyText
                  text="New Arrivals"
                  speed={3}
                  delay={0.3}
                  color="#00206b"
                  shineColor="#00ffd5"
                  spread={120}
                  direction="right"
                  yoyo
                  pauseOnHover
                  disabled={false}
                />
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

      {/* 4. TOP RATED */}
      <section className="pt-8 pb-16 bg-gradient-to-t from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-900 overflow-hidden border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6 group cursor-default">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-200 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-[20deg]">
              <FaTrophy className="text-2xl text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                <ShinyText
                  text="Top Rated"
                  speed={3}
                  delay={0.3}
                  color="#d4af37"
                  shineColor="#ffffff"
                  spread={120}
                  direction="right"
                  yoyo
                  pauseOnHover
                  disabled={false}
                />
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

      {/* 5. CTA BANNER + FEATURES */}
      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col lg:flex-row transition-colors duration-300">
            <div className="lg:w-1/2 p-12 relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 dark:bg-gray-700/50 rounded-full mb-8 w-max border border-white/20 dark:border-gray-600">
                <FaTag className="mr-2 text-yellow-400 animate-pulse" />
                <span className="font-semibold text-sm text-white">
                  Limited Time Offer
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white uppercase italic">
                Get <span className="text-yellow-400">25% OFF</span> <br /> Your
                First Order
              </h2>
              <p className="text-gray-300 dark:text-gray-400 text-lg mb-8 max-w-md leading-relaxed">
                Sign up today to unlock exclusive discounts, early access to
                sales, and premium support.
              </p>

              <Link
                to="/register"
                className="group px-10 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-lg rounded-xl hover:-translate-y-1 active:scale-95 transition-all inline-flex items-center w-max shadow-lg overflow-hidden"
              >
                <ShinyText
                  text="Sign Up Free"
                  speed={3}
                  delay={0.3}
                  color="#4f46e5"
                  shineColor="#a855f7"
                  spread={120}
                  direction="right"
                  yoyo
                  pauseOnHover
                  disabled={false}
                />
                <FaArrowRight className="ml-3 transition-transform duration-300 group-hover:translate-x-3 text-[#4f46e5] dark:text-[#a855f7]" />
              </Link>
            </div>

            <div className="lg:w-1/2 bg-gray-800 dark:bg-gray-900/50 p-8 lg:p-12 relative z-10 border-l border-gray-700 dark:border-gray-800 transition-colors duration-300">
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
                      className={`bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white shadow-md active:scale-90`}
                    >
                      {feature.icon}
                    </div>
                    <h4 className="text-lg font-bold mb-1">
                      <ShinyText
                        text={feature.title}
                        speed={3}
                        delay={0.3}
                        color={feature.shinyColor}
                        shineColor={feature.shinyShine}
                        spread={80}
                        direction="right"
                        disabled={false}
                      />
                    </h4>
                    <p className="text-gray-400 text-sm leading-snug">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`,
        }}
      />
    </div>
  );
}
