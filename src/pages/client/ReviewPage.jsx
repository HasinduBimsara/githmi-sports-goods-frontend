import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaArrowRight,
  FaPaperPlane,
  FaQuoteLeft,
  FaStar,
  FaUserCircle,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import ShinyText from "../../components/ShinyText";
import { fetchProducts } from "../../utils/products";
import { useAuth } from "../../context/AuthContext";
import "../ProductSlider.css";

const initialReviewForm = {
  productId: "",
  rating: 5,
  title: "",
  comment: "",
};

const renderStars = (rating) => {
  const safeRating = Number(rating) || 5;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className={`text-xs md:text-sm transition-colors duration-300 ${
            index < safeRating
              ? "text-yellow-400 drop-shadow-sm"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};


function getReviewList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.reviews)) {
    return data.reviews;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

function formatReviewDate(value) {
  if (!value) {
    return "Published review";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Published review";
  }

  return date.toLocaleDateString();
}

async function fetchReviews() {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`);
  return getReviewList(response.data);
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState(null);
  const [reviewForm, setReviewForm] = useState(initialReviewForm);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isLoggedIn = Boolean(localStorage.getItem("token"));


  useEffect(() => {
    let active = true;

    async function loadPageData() {
      try {
        setLoading(true);

        const [reviewsResult, productsResult] = await Promise.allSettled([
          fetchReviews(),
          fetchProducts(),
        ]);

        if (!active) {
          return;
        }

        if (reviewsResult.status === "fulfilled") {
          setReviews(reviewsResult.value);
          setError(
            reviewsResult.value.length === 0
              ? "Approved reviews will appear here once users submit them."
              : "",
          );
        } else {
          console.error("Error fetching reviews:", reviewsResult.reason);
          setReviews([]);
          setError("We could not load reviews right now.");
        }

        if (productsResult.status === "fulfilled") {
          setCatalogProducts(productsResult.value);
          setReviewForm((prev) => ({
            ...prev,
            productId: prev.productId || productsResult.value[0]?.productId || "",
          }));
        } else {
          console.error(
            "Error fetching products for reviews:",
            productsResult.reason,
          );
          setCatalogProducts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      active = false;
    };
  }, []);

  // Only display standard textual user reviews, ignoring any image-only entries if any remain
  const displayedReviews = reviews.filter((r) => r.productId !== "HAPPY_CUSTOMER" && !r.isHappyCustomerImageOnly);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }

    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast.error("Please fill in the required review fields");
      return;
    }

    if (catalogProducts.length > 0 && !reviewForm.productId) {
      toast.error("Please select a product");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
        {
          productId: reviewForm.productId,
          rating: reviewForm.rating,
          title: reviewForm.title.trim(),
          comment: reviewForm.comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Review submitted successfully!");

      const updatedReviews = await fetchReviews();
      setReviews(updatedReviews);
      setError(
        updatedReviews.length === 0
          ? "Be the first to leave a review!"
          : "",
      );
      setReviewForm({
        ...initialReviewForm,
        productId: catalogProducts[0]?.productId || "",
      });
      setActiveField(null);
    } catch (submitError) {
      console.error("Error submitting review:", submitError);
      if (
        submitError?.response?.status === 401 ||
        submitError?.response?.status === 403
      ) {
        navigate("/login");
      }
      toast.error(
        submitError?.response?.data?.message || "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 font-sans overflow-hidden transition-colors duration-300">
      <div className="relative mx-auto flex flex-col max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-0 pb-12">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md flex flex-col md:flex-row justify-between items-center rounded-2xl p-4 md:p-6 mb-4 mt-2 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 gap-4">
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight drop-shadow-sm">
              {reviews.length}+
            </h1>
            <div className="flex flex-col">
              <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Customer Reviews
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Read user feedback and add your own experience.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              document
                .getElementById("write-review")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-full sm:w-auto bg-white dark:bg-gray-800 border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all duration-300 text-sm flex items-center justify-center"
          >
            Add Review <FaArrowRight className="ml-2 text-xs" />
          </button>
        </div>


        {displayedReviews.length === 0 ? (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-700 text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              No reviews yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {error || "Approved reviews will appear here once users submit them."}
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6 mb-10">
            {displayedReviews.map((review, index) => (
              <div
                key={review?._id || index}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 break-inside-avoid hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  {renderStars(review?.rating)}
                  <FaQuoteLeft className="text-xl text-blue-100 dark:text-gray-700 group-hover:text-blue-200 dark:group-hover:text-gray-600 transition-colors duration-300" />
                </div>
                {review?.title && (
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {review.title}
                  </h3>
                )}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 italic transition-colors duration-300">
                  "{review?.comment || "Review details will appear here."}"
                </p>
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center min-w-0">
                    {review?.avatar || review?.image ? (
                      <img
                        src={review.avatar || review.image}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                        alt={review?.name || "Customer"}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full mr-3 bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FaUserCircle className="text-xl" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                        {review?.name || "Verified Customer"}
                      </h4>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate">
                        {review?.role || "Customer review"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {formatReviewDate(review?.createdAt || review?.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          id="write-review"
          className="max-w-3xl mx-auto w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-md p-5 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Add Your Review
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Use your logged-in account to submit a review. New reviews appear
              after admin approval.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Product
              </label>
              <select
                name="productId"
                value={reviewForm.productId}
                onChange={handleInputChange}
                className="w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white py-3 px-4 rounded-xl outline-none transition-all border-2 border-transparent dark:border-gray-700 focus:border-blue-500"
                disabled={catalogProducts.length === 0}
              >
                {catalogProducts.length === 0 ? (
                  <option value="">No products available</option>
                ) : (
                  catalogProducts.map((product) => (
                    <option key={product.productId} value={product.productId}>
                      {product.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-blue-700">
              {isLoggedIn ? (
                "Your review will be linked to your account details."
              ) : (
                <>
                  Please{" "}
                  <Link to="/login" className="font-bold underline">
                    log in
                  </Link>{" "}
                  before submitting a review.
                </>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Review Title *
              </label>
              <input
                type="text"
                name="title"
                value={reviewForm.title}
                onChange={handleInputChange}
                onFocus={() => setActiveField("title")}
                onBlur={() => setActiveField(null)}
                required
                className={`w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white py-3 px-4 rounded-xl outline-none transition-all border-2 ${
                  activeField === "title"
                    ? "border-blue-500 shadow-sm"
                    : "border-transparent dark:border-gray-700"
                }`}
                placeholder="Summarize your experience"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Rating
              </label>
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 w-full sm:w-max px-4 py-3 sm:py-2 rounded-xl border border-transparent dark:border-gray-700">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setReviewForm((prev) => ({ ...prev, rating: star }))
                    }
                    className={`text-2xl transition-transform hover:scale-125 ${
                      star <= reviewForm.rating
                        ? "text-yellow-400 drop-shadow-md"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Detailed Review *
              </label>
              <textarea
                name="comment"
                value={reviewForm.comment}
                onChange={handleInputChange}
                onFocus={() => setActiveField("comment")}
                onBlur={() => setActiveField(null)}
                required
                rows="4"
                className={`w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white p-4 rounded-xl outline-none transition-all border-2 resize-none ${
                  activeField === "comment"
                    ? "border-blue-500 shadow-sm"
                    : "border-transparent dark:border-gray-700"
                }`}
                placeholder="What did you like about the product?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting || catalogProducts.length === 0 || !isLoggedIn}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 sm:py-4 rounded-xl shadow-md transform hover:-translate-y-1 active:scale-95 transition-all flex justify-center items-center disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <span className="animate-pulse">Submitting...</span>
              ) : (
                <>
                  {isLoggedIn ? "Submit Review" : "Login to Review"}
                  <FaPaperPlane className="ml-2 text-sm" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
