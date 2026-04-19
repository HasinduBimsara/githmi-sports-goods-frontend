import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHeart,
  FaShieldAlt,
  FaShoppingCart,
  FaStar,
  FaTruck,
  FaMapMarkerAlt,
  FaUndo,
  FaStore,
  FaCheckCircle
} from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
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
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const ensureLoggedInForCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login or register to securely add items");
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
        if (!active) return;
        if (!loadedProduct) {
          setProduct(null);
          setError("Product is currently unavailable or removed.");
          return;
        }
        setProduct(loadedProduct);
        setActiveImage(loadedProduct.images[0]);
        if (loadedProduct.colors && loadedProduct.colors.length > 0) setSelectedColor(loadedProduct.colors[0]);
        if (loadedProduct.sizes && loadedProduct.sizes.length > 0) setSelectedSize(loadedProduct.sizes[0].size);
        setError("");
      } catch (loadError) {
        console.error("Load error:", loadError);
        if (active) {
          setProduct(null);
          setError("Network failure. Details not published yet.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    window.scrollTo(0, 0);
    loadProduct();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900 px-4">
        <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-3 dark:text-white">Product Not Found</h1>
          <p className="text-gray-500 mb-6 dark:text-gray-400">{error}</p>
          <Link to="/products" className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
            Keep Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Check if product has real sizes (not just "Any")
  const hasRealSizes = product.sizes?.some(s => s.size && s.size.toLowerCase() !== "any");

  const activePriceObj = (() => {
    if (!product.sizes?.length) return null;
    if (hasRealSizes) {
      // Match by size + color
      return product.sizes.find((s) =>
        s.size === selectedSize &&
        (product.colors?.length > 0 ? (s.color === selectedColor || !s.color) : true)
      ) || null;
    } else {
      // No real sizes — match purely by color
      return product.sizes.find((s) => s.color === selectedColor)
        || product.sizes.find((s) => !s.color)
        || product.sizes[0];
    }
  })();

  const displayPrice = activePriceObj ? (Number(activePriceObj.price) || product.price) : product.price;
  // Always parse stock as a number — guards against undefined/NaN from DB
  const rawStock = activePriceObj != null ? activePriceObj.stock : product.stock;
  const variantStock = Number(rawStock) || 0;
  // If all variant stocks are 0 but global stock > 0 (old data without per-variant stock), fall back to global
  const allVariantStocksAreZero = product.sizes?.length > 0 && product.sizes.every(s => !Number(s.stock));
  const displayStock = (variantStock === 0 && allVariantStocksAreZero && product.stock > 0)
    ? Number(product.stock)
    : variantStock;
  const maxQuantity = Math.max(1, displayStock);

  let displayLabeledPrice = product.labeledPrice;
  if (activePriceObj) {
    if (activePriceObj.labeledPrice) {
      displayLabeledPrice = activePriceObj.labeledPrice;
    } else {
      // Scale labeled price proportionally to the base markup (fallback for old items)
      const priceMultiplier = product.price > 0 ? (displayPrice / product.price) : 1;
      displayLabeledPrice = product.labeledPrice * priceMultiplier;
    }
  }

  const discountPercentage = displayLabeledPrice > displayPrice 
    ? Math.round(((displayLabeledPrice - displayPrice) / displayLabeledPrice) * 100) 
    : 0;

  // We need to pass the overridden display price into the cart product object
  const productToDisplay = { ...product, price: displayPrice, labeledPrice: displayLabeledPrice };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white pb-12 pt-4 transition-colors">
      <div className="max-w-[1240px] mx-auto px-2 sm:px-4">
        
        {/* Breadcrumb row */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex gap-2 items-center">
          <Link to="/" className="hover:text-blue-600">Githmi Sports</Link>
          <span className="text-gray-400">{'>'}</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-gray-800 dark:text-gray-200 truncate">{product.name}</span>
        </div>

        {/* CORE PRODUCT GRID (Daraz Style: 3 Columns) */}
        <div className="bg-white dark:bg-gray-800 shadow-sm md:rounded flex flex-col lg:flex-row overflow-hidden border border-gray-200 dark:border-gray-700">
          
          {/* COLUMN 1: Image Gallery (Left) */}
          <div className="lg:w-[33%] p-4 flex flex-col select-none">
            {/* Main Preview */}
            <div className="w-full aspect-square border border-gray-100 dark:border-gray-700 flex items-center justify-center p-2 mb-3 bg-white dark:bg-gray-900 relative">
              <img src={activeImage || product.images[0]} alt={product.name} className="w-full h-full object-contain cursor-zoom-in" />
              {displayStock <= 0 && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="bg-gray-900 text-white font-black text-xl px-4 py-2 uppercase tracking-wider rounded">Sold Out</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  onMouseEnter={() => setActiveImage(img)}
                  className={`w-14 h-14 flex-shrink-0 border p-1 rounded-lg cursor-pointer transition-all ${activeImage === img ? 'border-indigo-600 shadow-[0_0_0_1px_rgba(79,70,229,1)] dark:border-indigo-500 dark:shadow-[0_0_0_1px_rgba(99,102,241,1)]' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: Essential Details & Actions (Center) */}
          <div className="lg:w-[45%] p-4 lg:p-6 lg:border-r border-gray-200 dark:border-gray-700">
            {/* Title Block */}
            <h1 className="text-xl md:text-[22px] leading-tight text-[#212121] dark:text-gray-100 mb-2 truncate whitespace-normal line-clamp-3">
              {product.name}
            </h1>

            {/* Micro Details */}
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex text-yellow-400 text-[13px]">
                <FaStar/><FaStar/><FaStar/><FaStar/><FaStar className="text-gray-300 dark:text-gray-600"/>
              </div>
              <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-medium">12 Ratings</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span>Category: <Link to="/products" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">{product.category || 'General'}</Link></span>
            </div>

            {/* Huge Price Block */}
            <div className="mb-6">
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1 leading-tight pb-1 transition-all duration-300">
                LKR {displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              {discountPercentage > 0 && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="text-gray-500 line-through transition-all duration-300">
                    LKR {displayLabeledPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[#212121] dark:text-gray-200 font-bold">-{discountPercentage}%</span>
                </div>
              )}
            </div>

            {/* Colors Section — with per-color stock awareness */}
            {(product.colors?.length > 0) && (
              <div className="mb-6">
                <span className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Color Family</span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, pos) => {
                    // Find this color's specific stock from the sizes matrix
                    const colorVariant = product.sizes?.find(s => s.color === color);
                    const hasVariantData = product.sizes?.some(s => s.color); // check if any variant has color set
                    const colorStock = hasVariantData && colorVariant ? Number(colorVariant.stock) || 0 : null;
                    const isSoldOut = colorStock !== null && colorStock === 0;

                    return (
                      <div
                        key={pos}
                        onClick={() => !isSoldOut && setSelectedColor(color)}
                        className={`relative border px-4 py-1.5 text-sm rounded-lg transition-all font-bold select-none
                          ${isSoldOut
                            ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 opacity-50 cursor-not-allowed line-through'
                            : selectedColor === color
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-gray-800 dark:text-gray-200 cursor-pointer'
                              : 'border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-indigo-600 dark:hover:border-indigo-400 hover:shadow-sm cursor-pointer'
                          }`}
                      >
                        {color}
                        {isSoldOut && (
                          <span className="absolute -top-2 -right-1 text-[9px] bg-red-500 text-white px-1 rounded font-black uppercase tracking-wide">Out</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes Section — only show if real sizes exist (not just "Any") */}
            {(() => {
              const realSizes = product.sizes?.filter(s => s.size && s.size.toLowerCase() !== "any") || [];
              if (realSizes.length === 0) return null;
              return (
                <div className="mb-6">
                  <span className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Size Options</span>
                  <div className="flex flex-wrap gap-2">
                    {realSizes.map((s, pos) => (
                       <div 
                         key={pos} 
                         onClick={() => setSelectedSize(s.size)}
                         className={`border ${selectedSize === s.size ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-300 dark:border-gray-600'} px-4 py-1.5 text-sm rounded-lg hover:border-indigo-600 dark:hover:border-indigo-400 hover:shadow-sm cursor-pointer transition-all font-bold text-gray-800 dark:text-gray-200 select-none`}
                       >
                         {s.size}
                       </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Legacy Fallback if neither are mapped but altNames exist */}
            {(!product.colors?.length && !product.sizes?.length && product.altNames?.length > 0) && (
              <div className="mb-6">
                <span className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Variants</span>
                <div className="flex flex-wrap gap-2">
                  {product.altNames.map((altItem, pos) => (
                     <div key={pos} className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm rounded-lg hover:border-indigo-600 dark:hover:border-indigo-400 hover:shadow-sm cursor-pointer transition-all font-medium text-gray-700 dark:text-gray-200">
                       {altItem}
                     </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-16">Quantity</span>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-bold transition-colors"
                >
                  -
                </button>
                <div className="w-12 h-8 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-y border-gray-100 dark:border-gray-700">
                  {displayStock <= 0 ? 0 : quantity}
                </div>
                <button 
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={displayStock <= 0 || quantity >= displayStock}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-bold transition-colors disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <span className="text-xs font-medium border px-2 py-0.5 rounded shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                 {displayStock > 0 ? (
                   <span className="text-gray-700 dark:text-gray-300"><span className="text-indigo-600 dark:text-indigo-400 font-black">{displayStock}</span> items left</span>
                 ) : (
                   <span className="text-red-500 font-bold">Out of stock for this variant</span>
                 )}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (displayStock <= 0) return toast.error("Variant currently out of stock");
                  if (!ensureLoggedInForCart()) return;
                  if (product.sizes?.length > 0 && !selectedSize) return toast.error("Please select a size");
                  if (product.colors?.length > 0 && !selectedColor) return toast.error("Please select a color");
                  addToCart(productToDisplay, Math.min(quantity, displayStock), selectedSize, selectedColor);
                  navigate("/checkout", { state: { items: getCart() } });
                }}
                disabled={displayStock <= 0}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold h-12 rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                Buy Now
              </button>
              <button
                onClick={() => {
                  if (displayStock <= 0) return toast.error("Variant currently out of stock");
                  if (!ensureLoggedInForCart()) return;
                  if (product.sizes?.length > 0 && !selectedSize) return toast.error("Please select a size");
                  if (product.colors?.length > 0 && !selectedColor) return toast.error("Please select a color");
                  addToCart(productToDisplay, Math.min(quantity, displayStock), selectedSize, selectedColor);
                  toast.success(`${product.name} added to cart`);
                }}
                disabled={displayStock <= 0}
                className="flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white font-bold h-12 rounded-xl shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.23)] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          </div>

          {/* COLUMN 3: Delivery Options & Policies (Right Sidebar) */}
          <div className="lg:w-[22%] bg-gray-50/50 dark:bg-gray-900/30 p-4 border-t lg:border-t-0 border-gray-200 dark:border-gray-700 text-sm">
            
            {/* Delivery Section */}
            <div className="mb-4">
               <div className="flex justify-between items-end mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">Delivery</span>
                  <FaMapMarkerAlt className="text-gray-400 text-lg" />
               </div>
               <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-gray-100 dark:border-gray-700 mb-2">
                  <div className="flex items-start gap-3">
                     <FaTruck className="text-gray-600 dark:text-gray-300 mt-1" />
                     <div>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">Standard Delivery</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">3 - 5 Working Days</p>
                     </div>
                     <span className="font-bold text-gray-800 dark:text-gray-200 ml-auto">Rs. 350</span>
                  </div>
               </div>
               
               {/* Delivery Badges */}
               <div className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300 text-xs">Cash on Delivery Available</span>
               </div>
            </div>

            {/* Service & Return Policy Section */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
               <span className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-2 block">Service</span>
               
               <div className="flex items-start gap-3 mb-3">
                  <FaUndo className="text-blue-500 mt-1" />
                  <div>
                     <p className="text-gray-800 dark:text-gray-200 font-medium text-[13px]">14 Days Free Return</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400">Change of mind is not applicable</p>
                  </div>
               </div>
               
               <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-blue-500 mt-1" />
                  <div>
                     <p className="text-gray-800 dark:text-gray-200 font-medium text-[13px]">Warranty Valid</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400">Manufacture Defect Warranty</p>
                  </div>
               </div>
            </div>

            {/* Sold By Section */}
            <div>
               <span className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-3 block">Sold By</span>
               <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 rounded-xl flex items-center justify-center">
                    <FaStore className="text-indigo-600 dark:text-indigo-400 text-xl" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-indigo-700 dark:text-indigo-300 font-bold text-[15px]">Githmi Official Admin</span>
                     <div className="flex items-center mt-1">
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Verified Catalog</span>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SHELF: Product Details & description sweeping block */}
        <div className="mt-4 bg-white dark:bg-gray-800 shadow-sm md:rounded border border-gray-200 dark:border-gray-700">
           <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Product details of {product.name}</h2>
           </div>
           <div className="p-4 md:p-8">
              <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8 whitespace-pre-line">
                 {product.description}
              </div>
              
              {/* Fake specs mimicking standard e-commerce tables */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-sm">
                 <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700 text-sm">
                    <div className="p-3 bg-gray-50/50 dark:bg-gray-900/20">
                       <p className="text-gray-500 dark:text-gray-500 text-xs mb-1">Brand</p>
                       <p className="text-gray-800 dark:text-gray-200 font-medium">Githmi Authorized</p>
                    </div>
                    <div className="p-3 bg-gray-50/50 dark:bg-gray-900/20">
                       <p className="text-gray-500 dark:text-gray-500 text-xs mb-1">SKU</p>
                       <p className="text-gray-800 dark:text-gray-200 font-medium">#{product.productId}</p>
                    </div>
                    <div className="p-3 bg-gray-50/50 dark:bg-gray-900/20">
                       <p className="text-gray-500 dark:text-gray-500 text-xs mb-1">Category</p>
                       <p className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">{product.category}</p>
                    </div>
                    <div className="p-3 bg-gray-50/50 dark:bg-gray-900/20">
                       <p className="text-gray-500 dark:text-gray-500 text-xs mb-1">Delivery Requirement</p>
                       <p className="text-gray-800 dark:text-gray-200 font-medium">National / Standard</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
