import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHeart,
  FaShieldAlt,
  FaShoppingCart,
  FaStar,
  FaTruck,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import getCart, { addToCart } from "../../utils/cart";
import { fetchProductById } from "../../utils/products";

export default function ProductOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
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

    async function loadProduct() {
      try {
        setLoading(true);
        const loadedProduct = await fetchProductById(id);

        if (!active) {
          return;
        }

        if (!loadedProduct) {
          setProduct(null);
          setError("This product is not available.");
          return;
        }

        setProduct(loadedProduct);
        setActiveImage(loadedProduct.images[0]);
        setError("");
      } catch (loadError) {
        console.error("Error fetching product:", loadError);

        if (active) {
          setProduct(null);
          setError("Product details will appear here after they are published from the admin side.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    window.scrollTo(0, 0);
    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center px-4">
        <div className="max-w-xl text-center bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-black mb-3">Product unavailable</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <Link
            to="/products"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const maxQuantity = Math.max(1, product.stock || 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-8 flex flex-wrap gap-2">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate">
            {product.name}
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 p-6 md:p-8 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center border-r border-gray-100 dark:border-gray-700">
            <div className="w-full h-80 sm:h-[400px] rounded-2xl overflow-hidden mb-4 shadow-sm bg-white dark:bg-gray-800">
              <img
                src={activeImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto w-full py-2">
              {product.images.map((image, index) => (
                <button
                  key={image || index}
                  onClick={() => setActiveImage(image)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === image
                      ? "border-blue-600 shadow-md scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 p-6 md:p-10 flex flex-col">
            <div className="mb-2 flex items-center space-x-4">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  product.stock > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>

              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <FaStar className="text-yellow-400" />
                <span className="font-bold text-gray-900 dark:text-white">
                  Admin Catalog
                </span>
                <span>#{product.productId}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
              {product.name}
            </h1>
            <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">
              LKR {product.price.toFixed(2)}
            </p>
            {product.labeledPrice > product.price && (
              <p className="text-lg text-gray-400 line-through mb-6">
                LKR {product.labeledPrice.toFixed(2)}
              </p>
            )}

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <h3 className="font-bold mb-3">Product Details</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                  Product ID: {product.productId}
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                  Variants:{" "}
                  {(product.altNames?.length ?? 0) > 0
                    ? product.altNames.join(", ")
                    : "Standard"}
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                  Availability:{" "}
                  {product.stock > 0 ? `${product.stock} ready to ship` : "Currently unavailable"}
                </li>
              </ul>
            </div>

            <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl h-14 bg-gray-50 dark:bg-gray-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 text-xl hover:text-blue-600 transition-colors"
                >
                  -
                </button>
                <span className="font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(maxQuantity, quantity + 1))
                  }
                  className="px-4 text-xl hover:text-blue-600 transition-colors disabled:opacity-40"
                  disabled={product.stock > 0 && quantity >= maxQuantity}
                >
                  +
                </button>
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

                  addToCart(product, quantity);
                  navigate("/checkout", {
                    state: { items: getCart() }
                  });
                }}
                disabled={product.stock <= 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold h-14 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                Buy Now
              </button>

              <button 
                onClick={() => {
                  if (product.stock <= 0) {
                    toast.error("This product is currently out of stock");
                    return;
                  }

                  if (!ensureLoggedInForCart()) {
                    return;
                  }

                  addToCart(product, quantity);
                  toast.success(`${product.name} added to cart`);
                }}
                disabled={product.stock <= 0}
                className="w-14 h-14 border-2 border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600 disabled:opacity-50 transition-all"
                title="Add to Cart"
              >
                <FaShoppingCart className="text-xl" />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-500" /> Verified catalog item
              </div>
              <div className="flex items-center gap-2">
                <FaTruck className="text-blue-500" /> Shipping calculated at checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
