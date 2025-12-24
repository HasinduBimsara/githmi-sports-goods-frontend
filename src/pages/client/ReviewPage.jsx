import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../components/loader";
import {
  FaStar,
  FaUserCircle,
  FaCalendarAlt,
  FaThumbsUp,
  FaEdit,
  FaTrash,
  FaFilter,
} from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import toast from "react-hot-toast";

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all"); // all, 5, 4, 3, 2, 1
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, highest, lowest

  // New review form
  const [newReview, setNewReview] = useState({
    productId: "",
    rating: 5,
    title: "",
    comment: "",
    name: "",
    email: "",
  });

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [filter, sortBy]);

  const fetchReviews = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`, {
        params: { filter, sortBy },
      })
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
        setLoading(false);
      });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setSubmitting(true);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`, newReview)
      .then((res) => {
        toast.success("Review submitted successfully!");
        setNewReview({
          productId: "",
          rating: 5,
          title: "",
          comment: "",
          name: "",
          email: "",
        });
        fetchReviews(); // Refresh reviews
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        toast.error(error.response?.data?.message || "Failed to submit review");
        setSubmitting(false);
      });
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${reviewId}`)
        .then(() => {
          toast.success("Review deleted successfully!");
          fetchReviews(); // Refresh reviews
        })
        .catch((error) => {
          console.error("Error deleting review:", error);
          toast.error("Failed to delete review");
        });
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => distribution[review.rating]++);
    return distribution;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < rating ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="ml-2 font-semibold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const ratingDistribution = getRatingDistribution();
  const averageRating = calculateAverageRating();
  const totalReviews = reviews.length;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <MdRateReview className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Customer Reviews
          </h1>
          <p className="text-gray-600 text-lg">
            Read what our customers say about their shopping experience
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(parseFloat(averageRating))}
            </div>
            <p className="text-gray-600">Average Rating</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {totalReviews}
            </div>
            <div className="flex justify-center mb-2">
              <FaUserCircle className="text-3xl text-blue-500" />
            </div>
            <p className="text-gray-600">Total Reviews</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">97%</div>
            <div className="flex justify-center mb-2">
              <FaThumbsUp className="text-3xl text-green-500" />
            </div>
            <p className="text-gray-600">Recommended</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaFilter className="text-gray-500 mr-2" />
                <span className="font-medium">Filter by:</span>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>

            <button
              onClick={() =>
                document
                  .getElementById("write-review")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Rating Distribution */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Rating Distribution
              </h2>

              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">
                        {stars} Star
                      </span>
                      <div className="flex ml-2">
                        {[...Array(stars)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-sm" />
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-600">
                      {ratingDistribution[stars]}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${
                          (ratingDistribution[stars] / totalReviews) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">
                  Review Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2"></div>
                    Be honest and specific about your experience
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2"></div>
                    Focus on the product and service quality
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2"></div>
                    Avoid personal information
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2"></div>
                    No offensive language
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Reviews List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MdRateReview className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Reviews Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Be the first to share your experience!
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("write-review")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Write First Review
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                          <FaUserCircle className="text-2xl text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {review.name || "Anonymous"}
                          </h3>
                          <div className="flex items-center text-gray-500 text-sm">
                            <FaCalendarAlt className="mr-1" />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="font-bold text-gray-900">
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {review.title}
                    </h4>
                    <p className="text-gray-700 mb-4">{review.comment}</p>

                    {review.productName && (
                      <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm mb-4">
                        Product: {review.productName}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                          <FaThumbsUp className="mr-2" />
                          Helpful ({review.helpfulCount || 0})
                        </button>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            /* Edit functionality */
                          }}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Write Review Form */}
        <div id="write-review" className="mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <FaEdit className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Write Your Review
                </h2>
                <p className="text-gray-600">Share your experience with us</p>
              </div>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) =>
                      setNewReview({ ...newReview, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={newReview.email}
                    onChange={(e) =>
                      setNewReview({ ...newReview, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product (Optional)
                </label>
                <input
                  type="text"
                  value={newReview.productId}
                  onChange={(e) =>
                    setNewReview({ ...newReview, productId: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter product name or ID"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className={`text-3xl transition-transform hover:scale-110 ${
                        star <= newReview.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                  <span className="ml-4 font-semibold text-gray-700">
                    {newReview.rating} Star{newReview.rating !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) =>
                    setNewReview({ ...newReview, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Give your review a title"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  required
                  rows="6"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Share your experience with this product..."
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
