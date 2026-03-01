import ShinyText from "../../components/ShinyText";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleRegister() {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/", payload)
      .then((response) => {
        console.log("Registration successful", response.data);
        toast.success("Registration successful");
        navigate("/login");
      })
      .catch((error) => {
        console.log("Registration failed", error?.response?.data);
        toast.error(error?.response?.data?.message || "Registration failed");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // FIX: Changed w-[400px] to w-full and removed m-[5px] so flexbox handles spacing
  const inputTheme =
    "w-full h-[50px] bg-white/50 dark:bg-[#f0f4f9] border border-white dark:border-transparent rounded-xl text-center text-gray-900 placeholder-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all duration-300";

  const passwordTheme =
    "w-full h-[50px] bg-white/50 dark:bg-[#f0f4f9] border border-white dark:border-transparent rounded-xl text-center text-gray-900 placeholder-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all duration-300 tracking-widest";

  return (
    <div className="w-full min-h-screen bg-[url('/login-bg.jpg')] bg-cover bg-center flex transition-colors duration-300">
      {/* Left side spacer - hidden on mobile, takes 50% on large screens */}
      <div className="w-[50%] h-full hidden lg:block"></div>

      {/* Right side form container - Added pt-[100px] so it clears the navbar */}
      <div className="w-full lg:w-[50%] min-h-screen flex justify-center items-center px-4 pt-[100px] pb-10 sm:px-6 lg:px-8">
        {/* Glassmorphism Card: Fluid width (w-full max-w-md) for mobile responsiveness */}
        <div className="w-full max-w-md p-8 sm:p-10 backdrop-blur-xl bg-white/20 dark:bg-[#242a38]/95 shadow-2xl rounded-3xl flex flex-col justify-center items-center transition-colors duration-500 border border-white/40 dark:border-gray-700/50">
          <h2 className="text-3xl sm:text-4xl font-black mb-2 transition-colors text-center">
            {/* ✨ SHINY TEXT EFFECT ✨ */}
            <ShinyText
              text="Create Account"
              speed={2.5}
              delay={0}
              color="#ae00ff"
              shineColor="#ff7300"
              spread={120}
              direction="right"
              yoyo
              pauseOnHover
              disabled={false}
            />
          </h2>

          <p className="text-gray-800 dark:text-gray-400 mb-8 text-sm sm:text-base font-medium transition-colors text-center">
            Please enter your details to register
          </p>

          {/* Form wrapper to handle gaps nicely */}
          <div className="w-full flex flex-col gap-4">
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputTheme}
              type="text"
              placeholder="First Name"
            />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputTheme}
              type="text"
              placeholder="Last Name"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputTheme}
              type="email"
              placeholder="Email Address"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputTheme}
              type="text"
              placeholder="Phone Number"
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={passwordTheme}
              type="password"
              placeholder="Password"
            />
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={passwordTheme}
              type="password"
              placeholder="Confirm Password"
            />

            {/* 🔥 REGISTER BUTTON 🔥 (Changed to w-full) */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-[50px] bg-gradient-to-r from-[#4f46e5] to-[#a855f7] hover:from-[#4338ca] hover:to-[#9333ea] text-white font-bold rounded-xl cursor-pointer mt-2 shadow-lg transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <span className="animate-pulse">Registering...</span>
              ) : (
                "Register"
              )}
            </button>
          </div>

          <p className="text-gray-900 dark:text-gray-400 text-sm sm:text-base font-medium mt-8 transition-colors text-center">
            Already have an account?{" "}
            <span className="text-[#4f46e5] dark:text-[#a855f7] cursor-pointer hover:underline font-bold transition-colors block sm:inline mt-1 sm:mt-0">
              <Link to={"/login"}>Login Now</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
