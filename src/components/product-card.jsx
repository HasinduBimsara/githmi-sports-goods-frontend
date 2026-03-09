import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  // Safe check in case product data is delayed
  if (!product) return null;

  const productId = product.productId ?? product.id;
  const productImage = product.image ?? product.images?.[0] ?? "https://placehold.co/300x300";
  const labeledPrice = product.labeledPrice ?? product.price;

  return (
    <Link
      to={`/overview/${productId}`}
      className="flex flex-col w-full max-w-[300px] mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700"
    >
      {/* 📸 Image Container (Responsive Height + Zoom Hover Effect) */}
      <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden bg-gray-50 dark:bg-gray-900">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={productImage}
          alt={product.name}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* 📝 Content Container */}
      <div className="flex flex-col justify-between flex-1 p-4 sm:p-5">
        <div>
          {/* Product ID */}
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
            {productId}
          </p>

          {/* Product Name (line-clamp-2 ensures long titles don't break the card on mobile) */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-[#4f46e5] dark:group-hover:text-[#a855f7] transition-colors duration-300">
            {product.name}
          </h3>
        </div>

        {/* Pricing Section */}
        <div className="mt-3 flex items-baseline flex-wrap gap-2">
          <span className="text-lg sm:text-xl font-extrabold text-[#4f46e5] dark:text-[#a855f7]">
            LKR {product.price.toFixed(2)}
          </span>

          {/* Labeled (Discounted) Price */}
          {product.price < labeledPrice && (
            <span className="line-through text-gray-400 dark:text-gray-500 text-xs sm:text-sm font-medium">
              LKR {labeledPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
