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

  // Exact theme from your login inputs
  const inputTheme =
    "w-[400px] h-[50px] bg-white/50 dark:bg-[#f0f4f9] border border-white dark:border-transparent rounded-xl text-center m-[5px] text-gray-900 placeholder-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300";

  const passwordTheme =
    "w-[400px] h-[50px] bg-white/50 dark:bg-[#f0f4f9] border border-white dark:border-transparent rounded-xl text-center m-[5px] text-gray-900 placeholder-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 tracking-widest";

  return (
    // ADDED pt-20 (80px padding top) to push content below the navbar
    <div className="w-full h-screen bg-[url(/login-bg.jpg)] bg-cover bg-center flex">
      <div className="w-[90%] h-full hidden lg:block"></div>

      {/* Added py-10 so the form doesn't hit the very top/bottom on small screens */}
      <div className="w-full lg:w-[50%] h-160 flex justify-center items-center px-4 py-5">
        <div className="w-[450px] h-145 py-5 backdrop-blur-xl bg-white/20 dark:bg-[#242a38]/95 shadow-2xl rounded-2xl flex flex-col justify-center items-center transition-colors duration-500 border border-white/40 dark:border-gray-700/50">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 transition-colors">
            Create Account
          </h2>
          <p className="text-gray-800 dark:text-gray-400 mb-6 text-sm font-medium transition-colors">
            Please enter your details to register
          </p>

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
            placeholder="........"
          />
          <input
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={passwordTheme}
            type="password"
            placeholder="........"
          />

          {/* BUTTON: Removed dark mode overrides so it stays solid blue always */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-[400px] h-[50px] bg-blue-600 text-white font-bold rounded-xl cursor-pointer mt-[15px] shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-gray-900 dark:text-gray-400 text-sm font-medium mt-[20px] transition-colors">
            Already have an account? &nbsp;
            <span className="text-blue-800 dark:text-[#3b82f6] cursor-pointer hover:underline font-bold">
              <Link to={"/login"}>Login Now</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
