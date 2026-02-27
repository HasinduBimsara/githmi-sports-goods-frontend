import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";

export default function ProductOverview() {
  useParams(); // Gets ID from URL
  const [quantity, setQuantity] = useState(1);

  // Mock specific product data
  const product = {
    name: "Professional English Willow Cricket Bat",
    price: "129.99",
    rating: 4.8,
    reviews: 124,
    description:
      "Handcrafted from Grade A English Willow. Designed for maximum power and perfect balance. Ideal for professional players looking for an edge on the field.",
    features: [
      "Premium Grade A Willow",
      "Lightweight Pickup",
      "Pre-knocked",
      "Includes Bat Cover",
    ],
    images: [
      "https://placehold.co/600x600/1A1A1A/FFF?text=Main+Image",
      "https://placehold.co/600x600/333333/FFF?text=Side+Angle",
      "https://placehold.co/600x600/555555/FFF?text=Handle+Detail",
    ],
  };

  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-8 flex space-x-2">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>{" "}
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">
            Sports
          </Link>{" "}
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate">
            {product.name}
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row">
          {/* LEFT: Image Gallery */}
          <div className="md:w-1/2 p-6 md:p-8 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center border-r border-gray-100 dark:border-gray-700">
            <div className="w-full h-80 sm:h-[400px] rounded-2xl overflow-hidden mb-4 shadow-sm bg-white dark:bg-gray-800">
              <img
                src={activeImage}
                alt="Product"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto w-full py-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? "border-blue-600 shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="md:w-1/2 p-6 md:p-10 flex flex-col">
            <div className="mb-2 flex items-center space-x-4">
              <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                In Stock
              </span>
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <FaStar className="text-yellow-400" />
                <span className="font-bold text-gray-900 dark:text-white">
                  {product.rating}
                </span>
                <span>({product.reviews} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
              {product.name}
            </h1>
            <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-6">
              ${product.price}
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <h3 className="font-bold mb-3">Key Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-gray-600 dark:text-gray-300 text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>{" "}
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl h-14 bg-gray-50 dark:bg-gray-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 text-xl hover:text-blue-600 transition-colors"
                >
                  -
                </button>
                <span className="font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 text-xl hover:text-blue-600 transition-colors"
                >
                  +
                </button>
              </div>

              <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold h-14 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                <FaShoppingCart /> Add to Cart
              </button>

              <button className="w-14 h-14 border-2 border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-all">
                <FaHeart className="text-xl" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-500" /> 1 Year Warranty
              </div>
              <div className="flex items-center gap-2">
                <FaTruck className="text-blue-500" /> Free Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
