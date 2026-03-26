import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FaFilter, FaSearch, FaStar, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import { addToCart } from "../../utils/cart";
import { fetchProducts } from "../../utils/products";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [priceLimit, setPriceLimit] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ensureLoggedInForCart = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login or register to add items to cart");
      navigate("/login", { state: { redirect: location.pathname } });
      return false;
    }

    return true;
  };

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        const loadedProducts = await fetchProducts();

        if (!active) {
          return;
        }

        setProducts(loadedProducts);
        setError("");

        const maxPrice = loadedProducts.reduce(
          (max, product) => Math.max(max, product.labeledPrice || product.price),
          0,
        );
        setPriceLimit(maxPrice);
      } catch (loadError) {
        console.error("Error fetching products:", loadError);

        if (active) {
          setProducts([]);
          setError("Products will appear here after they are added.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const categories = [
    "All",
    ...Array.from(
      new Set(
        products
          .map((product) => product.altNames?.[0] || product.category || "Sports")
          .filter(Boolean),
      ),
    ).slice(0, 8),
  ];

  const maxPrice = products.reduce(
    (max, product) => Math.max(max, product.labeledPrice || product.price),
    0,
  );
  const effectivePriceLimit =
    maxPrice > 0 && priceLimit === 0 ? maxPrice : priceLimit;

  const filteredProducts = products.filter((product) => {
    const category = product.altNames?.[0] || product.category || "Sports";
    const searchMatch = product.name.toLowerCase().includes(search.toLowerCase());
    const categoryMatch =
      selectedCategory === "All" || category === selectedCategory;
    const priceMatch =
      effectivePriceLimit === 0 || product.price <= effectivePriceLimit;

    return searchMatch && categoryMatch && priceMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6fb] dark:bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6fb] dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 py-10 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/50 dark:border-gray-700 sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-gray-700 flex items-center justify-center text-blue-600">
                <FaFilter />
              </div>
              Filters
            </h2>

            <div className="mb-8">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                Categories
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-all duration-300 cursor-pointer group-hover:scale-110 active:scale-90"
                      />
                      <svg
                        className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                Price Range
              </h3>
              <input
                type="range"
                min="0"
                max={maxPrice || 0}
                value={effectivePriceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-purple-600 transition-all duration-300"
              />
              <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mt-3">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                  LKR 0
                </span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                  LKR {Math.round(effectivePriceLimit || maxPrice || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white/80 dark:bg-gray-800 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white/50 dark:border-gray-700 mb-8 gap-4">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              All Products{" "}
              <span className="text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg ml-2">
                {filteredProducts.length} items
              </span>
            </h1>

            <div className="relative w-full sm:w-80 group">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300 z-10" />
              <input
                type="text"
                placeholder="Search premium gear..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 outline-none transition-all duration-300 text-sm shadow-sm focus:shadow-lg focus:shadow-blue-500/10 font-medium"
              />
            </div>
          </div>

          {error && products.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No products available
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No matching products
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Try a different search term or filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const category =
                  product.altNames?.[0] || product.category || "Sports";
                const rating = Number(product.rating ?? 4.5);

                return (
                  <div
                    key={product.productId}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-blue-500/10 transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden group hover:-translate-y-2 flex flex-col"
                  >
                    <Link
                      to={`/overview/${product.productId}`}
                      className="block relative h-64 overflow-hidden"
                    >
                      <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="absolute top-3 left-3 bg-white/70 dark:bg-black/50 backdrop-blur-md text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm text-gray-900 dark:text-white uppercase tracking-wider">
                        {category}
                      </div>
                    </Link>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center space-x-1 mb-2">
                        <FaStar className="text-yellow-400 text-sm drop-shadow-sm" />
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                          {rating.toFixed(1)}
                        </span>
                      </div>

                      <Link to={`/overview/${product.productId}`}>
                        <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between mt-auto pt-4">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
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
                          className="w-12 h-12 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 transform hover:-translate-y-1 active:scale-90 transition-all duration-300 z-10 overflow-hidden relative disabled:opacity-50 disabled:hover:translate-y-0"
                          aria-label={`Add ${product.name} to cart`}
                          disabled={product.stock <= 0}
                        >
                          <FaShoppingCart className="text-lg relative z-10" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
