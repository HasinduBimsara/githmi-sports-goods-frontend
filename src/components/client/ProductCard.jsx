import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFire, FaShoppingCart, FaStar, FaShoppingBag } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProductCard({ product, ensureLoggedInForCart, addToCart, badgeColor = "text-blue-500", variant = "grid" }) {
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (product.colors?.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  // For price display: pick the first variant matching selected color (ignore size on card)
  const activePriceObj = product.sizes?.length > 0
    ? (product.sizes.find((s) => product.colors?.length > 0 ? (s.color === selectedColor || !s.color) : true) || product.sizes[0])
    : null;
  const displayPrice = activePriceObj ? activePriceObj.price : product.price;

  let displayLabeledPrice = product.labeledPrice;
  if (activePriceObj) {
    if (activePriceObj.labeledPrice) {
      displayLabeledPrice = activePriceObj.labeledPrice;
    } else {
      const priceMultiplier = product.price > 0 ? (displayPrice / product.price) : 1;
      displayLabeledPrice = product.labeledPrice * priceMultiplier;
    }
  }

  const displayStock = activePriceObj ? activePriceObj.stock : product.stock;

  const productToDisplay = { ...product, price: displayPrice, labeledPrice: displayLabeledPrice };
  const category = product.altNames?.[0] || product.category || "General";
  const rating = Number(product.rating ?? 4.5);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (displayStock <= 0) return toast.error("This variant is currently out of stock");
    if (!ensureLoggedInForCart()) return;
    if (product.colors?.length > 0 && !selectedColor) return toast.error("Please select a color");

    // Size is picked on the product details page — send empty from card
    addToCart(productToDisplay, 1, "", selectedColor);
    toast.success(`${product.name} added to cart`);
  };

  const isSlider = variant === "slider";

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-sm overflow-hidden flex flex-col group transition-all duration-500 border border-gray-100 dark:border-gray-700
      ${isSlider ? 'h-full rounded-2xl hover:shadow-2xl' : 'rounded-3xl hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-blue-500/10'}
    `}>
      <Link to={`/overview/${product.productId}`} className={`block relative overflow-hidden ${isSlider ? 'h-64' : 'h-64'}`}>
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {!isSlider && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
        
        {isSlider ? (
          <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-400 dark:text-gray-300 z-20">
            <FaFire className={badgeColor} />
          </div>
        ) : (
          <div className="absolute top-3 left-3 bg-white/70 dark:bg-black/50 backdrop-blur-md text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm text-gray-900 dark:text-white uppercase tracking-wider">
            {category}
          </div>
        )}
        {displayStock <= 0 && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-gray-900 text-white font-black text-sm px-3 py-1.5 uppercase tracking-wider rounded">Sold Out</span>
          </div>
        )}
      </Link>

      <div className={`flex flex-col flex-grow ${isSlider ? 'p-4 relative z-10 bg-white dark:bg-gray-800' : 'p-5'}`}>
        {isSlider ? (
           <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${badgeColor}`}>
             {category}
           </p>
        ) : (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center space-x-1">
              <FaStar className="text-yellow-400 text-sm drop-shadow-sm" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">
               {product.soldCount || 0} Sold
            </span>
          </div>
        )}

        <Link to={`/overview/${product.productId}`}>
          <h3 className={`font-bold text-gray-900 dark:text-white transition-colors line-clamp-2 ${isSlider ? 'text-lg mb-2 hover:text-blue-600 dark:hover:text-blue-400' : 'text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
            {product.name}
          </h3>
        </Link>
        
        {isSlider && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Color selectors only — sizes are chosen on the product details page */}
        <div className="mb-3 space-y-2 mt-2">
          {product.colors?.length > 0 && (
             <div className="flex flex-wrap gap-1">
               {product.colors.map((c) => (
                 <span 
                   key={c} 
                   onClick={(e) => { e.preventDefault(); setSelectedColor(c); }}
                   className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer transition-colors border ${selectedColor === c ? 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700'}`}
                 >
                   {c}
                 </span>
               ))}
             </div>
          )}
        </div>

        <div className={`mt-auto flex justify-between items-end ${isSlider ? 'gap-3' : 'pt-2'}`}>
          <div className="flex flex-col">
            <span className={`font-bold text-gray-900 dark:text-white block ${isSlider ? 'text-xl' : 'text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'}`}>
              LKR {displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {displayLabeledPrice > displayPrice && (
              <span className="text-xs text-gray-400 line-through">
                LKR {displayLabeledPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={isSlider 
              ? "bg-gray-900 dark:bg-gray-700 text-white p-2 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-sm active:scale-90 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
              : "w-11 h-11 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/40 transform hover:-translate-y-1 active:scale-90 transition-all duration-300 z-10 relative disabled:opacity-50 disabled:hover:translate-y-0"
            }
            aria-label={`Add ${product.name} to cart`}
          >
            {isSlider ? <FaShoppingBag /> : <FaShoppingCart className="text-lg relative z-10" />}
          </button>
        </div>
      </div>
    </div>
  );
}
