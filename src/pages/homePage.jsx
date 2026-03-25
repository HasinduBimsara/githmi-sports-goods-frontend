import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBolt,
  FaBoxOpen,
  FaFire,
  FaHeadset,
  FaShieldAlt,
  FaShoppingBag,
  FaTag,
  FaTruck,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import ShinyText from "../components/ShinyText";
import "./ProductSlider.css";
import { addToCart } from "../utils/cart";
import { fetchProducts } from "../utils/products";

export default function HomePage() {
  const navigate = useNavigate();
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [catalogTags, setCatalogTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ensureLoggedInForCart = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login or register to add items to cart");
      navigate("/login");
      return false;
    }

    return true;
  };

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        const products = await fetchProducts();

        if (!active) {
          return;
        }

        const deals = products.filter((product) => product.isBestDeal);
        const latest = products.filter((product) => product.isLatest);
        const inStock = products.filter((product) => product.isReadyToShip);

        setDiscountedProducts(deals.slice(0, 18));
        setLatestProducts(latest.slice(0, 18));
        setAvailableProducts(inStock.slice(0, 18));
        setCatalogTags(
          Array.from(
            new Set(products.map((product) => product.category).filter(Boolean)),
          ).slice(0, 8),
        );
        setError(
          products.length === 0
            ? "Products will appear here after they are added from the admin side."
            : "",
        );
      } catch (loadError) {
        console.error("Error fetching products:", loadError);

        if (active) {
          setDiscountedProducts([]);
          setLatestProducts([]);
          setAvailableProducts([]);
          setCatalogTags([]);
          setError("We could not load the admin catalog right now.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    window.scrollTo(0, 0);
    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const features = [
    {
      icon: (
        <FaTruck className="text-3xl transition-transform duration-500 group-hover:translate-x-3" />
      ),
      title: "Fast Delivery",
      description: "Admin-published products delivered directly to your door.",
      shinyColor: "#3b82f6",
      shinyShine: "#ffffff",
    },
    {
      icon: (
        <FaShieldAlt className="text-3xl transition-transform duration-500 group-hover:scale-125" />
      ),
      title: "Verified Catalog",
      description: "Products and pricing come from the managed admin catalog.",
      shinyColor: "#22c55e",
      shinyShine: "#ffffff",
    },
    {
      icon: (
        <FaHeadset className="text-3xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
      ),
      title: "Customer Support",
      description: "Get help with your orders and product selection anytime.",
      shinyColor: "#a855f7",
      shinyShine: "#ffffff",
    },
    {
      icon: (
        <FaShoppingBag className="text-3xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:bounce" />
      ),
      title: "Trusted Checkout",
      description: "Secure checkout flow for every published item.",
      shinyColor: "#f97316",
      shinyShine: "#ffffff",
    },
  ];

  const ProductSlider = ({ products, badgeColor, emptyMessage }) => {
    if (!products || products.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="slider-body">
        <div className="slider-wrapper">
          <div className="slider-track">
            {products.map((product, index) => (
              <div className="slide" key={product.productId || index}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-2xl transition-shadow border border-gray-100 dark:border-gray-700 group">
                  <Link
                    to={`/overview/${product.productId}`}
                    className="h-64 overflow-hidden relative block"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-400 dark:text-gray-300 z-20">
                      <FaFire className={badgeColor} />
                    </div>
                  </Link>

                  <div className="p-4 flex flex-col flex-grow relative z-10 bg-white dark:bg-gray-800">
                    <p className={`text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
                      {product.category || "General"}
                    </p>
                    <Link to={`/overview/${product.productId}`}>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="mt-auto flex justify-between items-end gap-3">
                      <div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white block">
                          LKR {product.price.toFixed(2)}
                        </span>
                        {product.labeledPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            LKR {product.labeledPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (product.stock <= 0) {
                            toast.error("This product is currently out of stock");
                            return;
                          }

                          if (!ensureLoggedInForCart()) {
                            return;
                          }

                          addToCart(product, 1);
                          toast.success(`${product.name} added to cart`);
                        }}
                        className="bg-gray-900 dark:bg-gray-700 text-white p-2 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-sm active:scale-90 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                        aria-label={`Add ${product.name} to cart`}
                        disabled={product.stock <= 0}
                      >
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
      {catalogTags.length > 0 && (
        <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-center overflow-x-auto py-3 hide-scrollbar">
              <div className="flex items-center space-x-3 sm:space-x-5 whitespace-nowrap">
                <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  Categories:
                </span>
                {catalogTags.map((tag, index) => (
                  <React.Fragment key={tag}>
                    <Link
                      to={`/products?category=${encodeURIComponent(tag)}`}
                      className="hover:-translate-y-0.5 inline-block transition-all duration-300"
                    >
                      <ShinyText
                        text={tag}
                        speed={4}
                        delay={index * 0.2}
                        color="#4b5563"
                        shineColor="#4f46e5"
                        spread={50}
                        direction="right"
                        yoyo
                        pauseOnHover
                        disabled={false}
                      />
                    </Link>
                    {index < catalogTags.length - 1 && (
                      <span className="text-gray-300 dark:text-gray-700">|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && !loading && latestProducts.length === 0 && (
        <section className="pt-10 px-4">
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 text-center shadow-sm">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
              Admin catalog is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        </section>
      )}

      <section className="pt-8 pb-8 bg-gradient-to-b from-red-50 to-white dark:from-red-900/10 dark:to-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6 group cursor-default">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-red-200 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
              <FaBolt className="text-2xl text-red-600 dark:text-red-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                <ShinyText
                  text="Best Deals"
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
              <p className="text-red-500 font-medium mt-1">
                Discounted products published from the admin catalog.
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <ProductSlider
              products={discountedProducts}
              badgeColor="text-red-500"
              emptyMessage="Discounted products will appear here after they are added by admin."
            />
          )}
        </div>
      </section>

      <section className="pt-8 pb-8 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6 group cursor-default">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-200 transition-transform duration-500 group-hover:scale-125 group-hover:-translate-y-2">
              <FaBoxOpen className="text-2xl text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                <ShinyText
                  text="Latest Products"
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
                Newly available items from the managed product list.
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <ProductSlider
              products={latestProducts}
              badgeColor="text-blue-500"
              emptyMessage="Latest products will appear here after they are added by admin."
            />
          )}
        </div>
      </section>

      <section className="pt-8 pb-16 bg-gradient-to-t from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-900 overflow-hidden border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6 group cursor-default">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-200 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-[20deg]">
              <FaShieldAlt className="text-2xl text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                <ShinyText
                  text="Ready To Ship"
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
                In-stock products currently available for checkout.
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <ProductSlider
              products={availableProducts}
              badgeColor="text-yellow-500"
              emptyMessage="In-stock products will appear here after they are added by admin."
            />
          )}
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col lg:flex-row transition-colors duration-300">
            <div className="lg:w-1/2 p-12 relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 dark:bg-gray-700/50 rounded-full mb-8 w-max border border-white/20 dark:border-gray-600">
                <FaTag className="mr-2 text-yellow-400 animate-pulse" />
                <span className="font-semibold text-sm text-white">
                  Managed Catalog
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white uppercase italic">
                Browse Products <br /> Added By <span className="text-yellow-400">Admin</span>
              </h2>
              <p className="text-gray-300 dark:text-gray-400 text-lg mb-8 max-w-md leading-relaxed">
                The storefront now displays products directly from the admin-managed
                catalog instead of hardcoded frontend data.
              </p>

              <Link
                to="/products"
                className="group px-10 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-lg rounded-xl hover:-translate-y-1 active:scale-95 transition-all inline-flex items-center w-max shadow-lg overflow-hidden"
              >
                <ShinyText
                  text="Explore Catalog"
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
                    <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white shadow-md active:scale-90">
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
          __html:
            ".hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }",
        }}
      />
    </div>
  );
}
