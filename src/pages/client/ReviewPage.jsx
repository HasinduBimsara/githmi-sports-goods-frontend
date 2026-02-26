import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
// FIXED: Goes up two levels to reach src/components/loader
import Loader from "../../components/loader";
import {
  FaStar,
  FaUserCircle,
  FaPaperPlane,
  FaArrowRight,
} from "react-icons/fa";
import toast from "react-hot-toast";

// Ensure this path points to where your ProductSlider.css is saved!
import "../ProductSlider.css";

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [happyCustomers, setHappyCustomers] = useState([]);

  const [newReview, setNewReview] = useState({
    productId: "",
    rating: 5,
    title: "",
    comment: "",
    name: "",
    email: "",
  });

  // Mock data to match the beautiful layout from the image design
  const defaultReviews = [
    {
      _id: "1",
      name: "Nasimul Huda",
      role: "CEO, Nasim Spinning Mills",
      rating: 5,
      date: "2024-08-15",
      comment:
        "Githmi Sports has completely revolutionized how we approach our gear. The quality of the cricket bats is incredibly accurate to professional standards, and the fast delivery ensures we get the best deals before the season starts. This platform is the future of sports trading. Highly recommended!",
      avatar: "https://i.pravatar.cc/150?u=nasim",
    },
    {
      _id: "2",
      name: "Nazmul Haque",
      role: "Director, Eastern Sports Industries",
      rating: 5,
      date: "2024-08-15",
      comment:
        "Githmi Sports is more than just a store; it's a complete ecosystem for the sports industry. We source all our academy equipment here.",
      avatar: "https://i.pravatar.cc/150?u=nazmul",
    },
    {
      _id: "3",
      name: "Fahmida Islam",
      role: "Managing Director, Global Athletics Ltd.",
      rating: 5,
      date: "2024-08-15",
      comment:
        "The customer service feature on Githmi Sports is exceptional. It allows us to connect with experts who understand our exact needs.",
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
    {
      _id: "5",
      name: "Rafiul Islam",
      role: "CEO of Apex Fitness",
      rating: 5,
      date: "2024-08-15",
      comment:
        "Githmi Sports has revolutionized how we equip our gym. Unbeatable prices and top-tier durability on all machines.",
      avatar: "https://i.pravatar.cc/150?u=rafiul",
    },
  ];

  const fetchReviews = useCallback(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`)
      .then((response) => {
        // If API is empty, use the beautiful mock data to match the design
        setReviews(response.data.length > 0 ? response.data : defaultReviews);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        // Fallback to mock data on error so the page still looks good
        setReviews(defaultReviews);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchReviews();

    // Generate mock data for the 3D Slider at the bottom
    const generateCustomers = () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: `customer-${i}`,
        name: `Happy Customer ${i + 1}`,
        product: `Pro Sports Gear ${i + 1}`,
        image: `https://i.pravatar.cc/300?img=${(i % 50) + 1}`, // Random avatars
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

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-200"}`}
          />
        ))}
      </div>
    );
  };

  // The 3D Slider Component (Reused from HomePage)
  const HappyCustomerSlider = ({ customers }) => {
    if (!customers || customers.length === 0) return null;

    return (
      <div className="slider-body bg-transparent min-h-[200px]">
        <div className="slider-wrapper pt-1 pb-1">
          <div className="slider-track">
            {customers.map((customer, index) => (
              <div
                className="slide"
                key={customer.id || index}
                style={{ width: "300px", height: "450px" }}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col items-center border border-gray-100 transition-all duration-300">
                  <div className="w-full h-full full overflow-hidden mb-4 border-4 border-orange-100">
                    <img
                      src={customer.image}
                      alt={customer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-blue-900 text-lg text-center line-clamp-1">
                    {customer.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 text-center line-clamp-1">
                    Purchased: {customer.product}
                  </p>
                  <div className="mt-auto mb-3">
                    {renderStars(customer.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-orange-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6fb] to-[#fff6f0] p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Section (Matching Image Design) */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-transparent mb-16 px-4">
          {/* Left Stats */}
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-6xl md:text-7xl font-bold text-[#e87030] mb-2 tracking-tight">
              550+
            </h1>
            <p className="text-xl md:text-2xl font-bold text-[#1e285a]">
              Reviews from Industry Leaders
            </p>
          </div>

          {/* Right Action Area */}
          <div className="flex flex-col items-center md:items-start">
            {/* Overlapping Avatars */}
            <div className="flex -space-x-3 mb-4">
              <img
                className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 object-cover"
                src="https://i.pravatar.cc/150?img=1"
                alt="User"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white bg-red-100 object-cover"
                src="https://i.pravatar.cc/150?img=2"
                alt="User"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white bg-yellow-100 object-cover"
                src="https://i.pravatar.cc/150?img=3"
                alt="User"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white bg-green-100 object-cover"
                src="https://i.pravatar.cc/150?img=4"
                alt="User"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white bg-purple-100 object-cover"
                src="https://i.pravatar.cc/150?img=5"
                alt="User"
              />
            </div>

            <p className="text-gray-800 font-medium mb-6 text-center md:text-left">
              10,000+ users already using
              <br />
              our services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#e87030] hover:bg-[#d46020] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                Get a free trial <FaArrowRight className="ml-2 text-sm" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("write-review")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="bg-transparent border-2 border-[#e87030] text-[#e87030] hover:bg-[#fff6f0] font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                Write a review <FaArrowRight className="ml-2 text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Masonry Review Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-20">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 break-inside-avoid hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  {renderStars(review.rating)}
                  <span className="text-gray-500 text-xs font-medium ml-1">
                    ({review.rating}/5)
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {review.date || new Date().toISOString().split("T")[0]}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                "{review.comment}"
              </p>

              <div className="flex items-center mt-auto">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full mr-3 border border-gray-200 object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-4xl text-gray-300 mr-3" />
                )}
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {review.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {review.role || "Verified Buyer"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3D Happy Customer Swapping Slider */}
        <div className="mt-10 mb-20 bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/60 shadow-lg overflow-hidden">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold text-[#1e285a]">
              Meet Our Happy Customers
            </h2>
            <p className="text-gray-500 mt-2">
              Thousands of athletes trust Githmi Sports globally.
            </p>
          </div>
          {/* Renders the rotating slider */}
          <HappyCustomerSlider customers={happyCustomers} />
        </div>

        {/* Minimalist Write Review Form */}
        <div
          id="write-review"
          className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-10 border border-gray-100"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1e285a] mb-2">
              Share Your Experience
            </h2>
            <p className="text-gray-500">
              Your feedback helps us improve our sporting goods.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e87030] outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newReview.email}
                  onChange={(e) =>
                    setNewReview({ ...newReview, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e87030] outline-none transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-2 bg-gray-50 w-max px-4 py-2 rounded-xl border border-gray-200">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-2xl transition-transform hover:scale-110 ${
                      star <= newReview.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview({ ...newReview, title: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e87030] outline-none transition"
                placeholder="Brief summary of your experience"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Detailed Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
                rows="5"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e87030] outline-none transition resize-none"
                placeholder="What did you love about your purchase?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#1e285a] hover:bg-[#141b3d] text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex justify-center items-center disabled:opacity-70"
            >
              {submitting ? (
                <span className="animate-pulse">Submitting...</span>
              ) : (
                <>
                  Submit Review <FaPaperPlane className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
