import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/loader";
import {
  FaStar,
  FaUserCircle,
  FaPaperPlane,
  FaArrowRight,
  FaQuoteLeft,
} from "react-icons/fa";
import toast from "react-hot-toast";

import "../ProductSlider.css";

// ==========================================
// 1. HELPER COMPONENTS
// ==========================================
const renderStars = (rating) => {
  const safeRating = Number(rating) || 5;
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`text-xs md:text-sm transition-colors duration-300 ${
            i < safeRating
              ? "text-yellow-400 drop-shadow-sm"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

const HappyCustomerSlider = ({ customers }) => {
  if (!customers || !Array.isArray(customers) || customers.length === 0)
    return null;

  return (
    // Reduced height slightly since text is removed
    <div className="slider-body bg-transparent min-h-[250px] py-2">
      <div className="slider-wrapper">
        <div className="slider-track">
          {customers.map((customer, index) => (
            <div className="slide" key={customer?.id || index}>
              {/* Card now only contains the full-cover image */}
              <div className="inner-card bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden h-full border border-gray-100 dark:border-gray-700 transition-all duration-300">
                <img
                  src={customer?.image || "https://placehold.co/300x300"}
                  alt={customer?.name || "Customer"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN PAGE COMPONENT
// ==========================================
export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [happyCustomers, setHappyCustomers] = useState([]);
  const [activeField, setActiveField] = useState(null);

  const [newReview, setNewReview] = useState({
    productId: "",
    rating: 5,
    title: "",
    comment: "",
    name: "",
    email: "",
  });

  const defaultReviews = [
    {
      _id: "1",
      name: "Nasimul Huda",
      role: "CEO, Nasim Spinning Mills",
      rating: 5,
      date: "2024-08-15",
      comment:
        "Githmi Sports has completely revolutionized how we approach our gear. The quality of the cricket bats is incredibly accurate to professional standards, and the fast delivery ensures we get the best deals.",
      avatar: "https://i.pravatar.cc/150?u=nasim",
    },
    {
      _id: "2",
      name: "Nazmul Haque",
      role: "Director, Eastern Sports",
      rating: 5,
      date: "2024-08-15",
      comment:
        "Githmi Sports is more than just a store; it's a complete ecosystem for the sports industry. We source all our academy equipment here.",
      avatar: "https://i.pravatar.cc/150?u=nazmul",
    },
    {
      _id: "3",
      name: "Fahmida Islam",
      role: "Managing Director, Global Athletics",
      rating: 5,
      date: "2024-08-15",
      comment:
        "The customer service feature is exceptional. It allows us to connect with experts who understand our exact needs.",
      avatar: "https://i.pravatar.cc/150?u=fahmida",
    },
    {
      _id: "4",
      name: "Raihan Karim",
      role: "Founder, Karim Tennis Solutions",
      rating: 5,
      date: "2024-08-15",
      comment:
        "The bundle deals feature is a standout. It simplifies the entire process of getting a team ready for a tournament.",
      avatar: "https://i.pravatar.cc/150?u=raihan",
    },
  ];

  const fetchReviews = useCallback(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`)
      .then((response) => {
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setReviews(response.data);
        } else {
          setReviews(defaultReviews);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setReviews(defaultReviews);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchReviews();

    const generateCustomers = () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: `customer-${i}`,
        name: `Customer ${i + 1}`,
        product: `Pro Sports Gear ${i + 1}`,
        image: `https://i.pravatar.cc/300?img=${(i % 50) + 1}`,
        rating: 5,
      }));
    setHappyCustomers(generateCustomers());
  }, [fetchReviews]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setSubmitting(true);
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`, newReview)
      .then(() => {
        toast.success("Review submitted successfully!");
        setNewReview({
          productId: "",
          rating: 5,
          title: "",
          comment: "",
          name: "",
          email: "",
        });
        fetchReviews();
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Submission error:", error);
        toast.error("Failed to submit review");
        setSubmitting(false);
      });
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
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-300 dark:bg-blue-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob transition-colors duration-700"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-300 dark:bg-purple-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 transition-colors duration-700"></div>
      </div>

      <div className="relative mx-auto flex-col max-w-[1200px]">
        {/* ========== COMPACT TOP HEADER BANNER ========== */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md flex flex-col md:flex-row justify-between items-center rounded-2xl p-4 md:p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 gap-4">
          <div className="flex items-center text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight drop-shadow-sm mr-4">
              550+
            </h1>
            <div className="flex flex-col">
              <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Five-Star Reviews
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Trusted by athletes globally.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex -space-x-3">
              {[1, 2, 3, 4].map((img) => (
                <img
                  key={img}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm object-cover"
                  src={`https://i.pravatar.cc/150?img=${img}`}
                  alt="User"
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold text-[10px] z-10">
                +10k
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  document
                    .getElementById("write-review")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="bg-white dark:bg-gray-800 border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 font-bold py-2 px-5 rounded-xl shadow-sm transition-all duration-300 text-sm"
              >
                Write Review
              </button>
            </div>
          </div>
        </div>

        {/* ========== SWAPPER SLIDER (IMAGE ONLY) ========== */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-2 border border-white/50 dark:border-gray-700 shadow-sm overflow-hidden mb-8 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Happy Customers
            </h2>
            <Link
              to="/products"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Shop their gear &rarr;
            </Link>
          </div>
          <HappyCustomerSlider customers={happyCustomers} />
        </div>

        {/* ========== MASONRY REVIEW GRID ========== */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 mb-8">
          {Array.isArray(reviews) &&
            reviews.map((review, index) => (
              <div
                key={review?._id || index}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 break-inside-avoid hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    {renderStars(review?.rating)}
                  </div>
                  <FaQuoteLeft className="text-xl text-blue-100 dark:text-gray-700 group-hover:text-blue-200 dark:group-hover:text-gray-600 transition-colors duration-300" />
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 italic transition-colors duration-300">
                  "{review?.comment || "Great product!"}"
                </p>

                <div className="flex items-center pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  {review?.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review?.name || "User"}
                      className="w-10 h-10 rounded-full mr-3 border border-white dark:border-gray-800 shadow-sm object-cover transition-colors duration-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full mr-3 bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 flex items-center justify-center shadow-sm">
                      <FaUserCircle className="text-xl" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white transition-colors duration-300">
                      {review?.name || "Verified Customer"}
                    </h4>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium transition-colors duration-300">
                      {review?.role || "Verified Buyer"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* ========== WRITE REVIEW FORM ========== */}
        <div
          id="write-review"
          className="max-w-3xl mx-auto w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-md p-6 md:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
              Share Your Experience
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Your feedback helps us improve and serve you better.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  onFocus={() => setActiveField("name")}
                  onBlur={() => setActiveField(null)}
                  required
                  className={`w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white py-3 px-4 rounded-xl outline-none transition-all duration-300 border-2 ${
                    activeField === "name"
                      ? "border-blue-500 shadow-sm"
                      : "border-transparent dark:border-gray-700"
                  }`}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newReview.email}
                  onChange={(e) =>
                    setNewReview({ ...newReview, email: e.target.value })
                  }
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  required
                  className={`w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white py-3 px-4 rounded-xl outline-none transition-all duration-300 border-2 ${
                    activeField === "email"
                      ? "border-blue-500 shadow-sm"
                      : "border-transparent dark:border-gray-700"
                  }`}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                Rating
              </label>
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 w-max px-4 py-2 rounded-xl border border-transparent dark:border-gray-700 transition-colors duration-300">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-2xl transition-transform hover:scale-125 ${
                      star <= newReview.rating
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
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview({ ...newReview, title: e.target.value })
                }
                onFocus={() => setActiveField("title")}
                onBlur={() => setActiveField(null)}
                required
                className={`w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white py-3 px-4 rounded-xl outline-none transition-all duration-300 border-2 ${
                  activeField === "title"
                    ? "border-blue-500 shadow-sm"
                    : "border-transparent dark:border-gray-700"
                }`}
                placeholder="Brief summary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                Detailed Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                onFocus={() => setActiveField("comment")}
                onBlur={() => setActiveField(null)}
                required
                rows="4"
                className={`w-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white p-4 rounded-xl outline-none transition-all duration-300 border-2 resize-none ${
                  activeField === "comment"
                    ? "border-blue-500 shadow-sm"
                    : "border-transparent dark:border-gray-700"
                }`}
                placeholder="What did you love about your purchase?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-300 flex justify-center items-center disabled:opacity-70 mt-2"
            >
              {submitting ? (
                <span className="animate-pulse">Submitting...</span>
              ) : (
                <>
                  Submit Review <FaPaperPlane className="ml-2 text-sm" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
