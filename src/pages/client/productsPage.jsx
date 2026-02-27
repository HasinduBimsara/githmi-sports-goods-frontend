import { useState } from "react";
import { Link } from "react-router-dom";
import { FaFilter, FaSearch, FaStar, FaShoppingCart } from "react-icons/fa";

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  // Mock Products
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Premium Sports Gear ${i + 1}`,
    price: (29.99 + i * 5).toFixed(2),
    category: i % 2 === 0 ? "Cricket" : "Fitness",
    rating: 4.5,
    image: `https://placehold.co/400x400/1A1A1A/FFF?text=Gear+${i + 1}`,
  }));

  return (
    <div className="min-h-screen bg-[#f8f6fb] dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 py-10 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8">
        {/* ========== SIDEBAR FILTERS ========== */}
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
                {["All", "Cricket", "Football", "Fitness", "Tennis"].map(
                  (cat) => (
                    <label
                      key={cat}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      {/* Modern Animated Checkbox */}
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input
                          type="checkbox"
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
                        {cat}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                Price Range
              </h3>
              {/* Modern Slider */}
              <input
                type="range"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-purple-600 transition-all duration-300"
              />
              <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mt-3">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                  $0
                </span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                  $500+
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========== PRODUCT GRID AREA ========== */}
        <div className="flex-1">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white/80 dark:bg-gray-800 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white/50 dark:border-gray-700 mb-8 gap-4">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              All Products{" "}
              <span className="text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg ml-2">
                {products.length} items
              </span>
            </h1>

            {/* Smart Search Bar */}
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

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products
              .filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-blue-500/10 transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden group hover:-translate-y-2 flex flex-col"
                >
                  <Link
                    to={`/overview/${product.id}`}
                    className="block relative h-64 overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Glassmorphism Category Badge */}
                    <div className="absolute top-3 left-3 bg-white/70 dark:bg-black/50 backdrop-blur-md text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm text-gray-900 dark:text-white uppercase tracking-wider">
                      {product.category}
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center space-x-1 mb-2">
                      <FaStar className="text-yellow-400 text-sm drop-shadow-sm" />
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                        {product.rating}
                      </span>
                    </div>

                    <Link to={`/overview/${product.id}`}>
                      <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mt-auto pt-4">
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        ${product.price}
                      </span>

                      {/* SMART ADD TO CART BUTTON */}
                      <button className="w-12 h-12 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 transform hover:-translate-y-1 active:scale-90 transition-all duration-300 z-10 overflow-hidden relative">
                        <FaShoppingCart className="text-lg relative z-10" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
