import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { GrGoogle } from "react-icons/gr";
import ShinyText from "../components/ShinyText"; // Fixed path: Only one set of dots needed from src/pages

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (res) => {
      setLoading(true);
      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/api/user/google", {
          accessToken: res.access_token,
        })
        .then((response) => {
          console.log("Login successful", response.data);
          toast.success("Login successful");
          localStorage.setItem("token", response.data.token);

          const user = response.data.user;
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
          setLoading(false);
        });
    },
  });

  function handleLogin() {
    setLoading(true);
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("Login successful", response.data);
        toast.success("Login successful");
        localStorage.setItem("token", response.data.token);

        const user = response.data.user;
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("Login failed", error.response?.data);
        toast.error(error.response?.data?.message || "Login failed");
        setLoading(false);
      });
  }

  return (
    // FIX: Removed the style={{ backgroundImage... }} and used Tailwind's bg-[url] like your Register Page!
    <div className="w-full min-h-screen bg-[url('/login-bg.jpg')] bg-cover bg-center flex transition-colors duration-300">
      <div className="w-[90%] h-full hidden lg:block"></div>

      <div className="w-full lg:w-[50%] h-149 flex justify-center items-center px-4 py-10">
        <div className="w-[450px] h-auto py-10 backdrop-blur-xl bg-white/20 dark:bg-[#242a38]/95 shadow-2xl rounded-2xl flex flex-col justify-center items-center transition-colors duration-500 border border-white/40 dark:border-gray-700/50">
          <h2 className="text-3xl font-black mb-2 transition-colors">
            {/* ✨ SHINY TEXT EFFECT ✨ */}
            <ShinyText
              text="Welcome Back"
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

          <p className="text-gray-800 dark:text-gray-400 mb-6 text-sm font-medium transition-colors">
            Please enter your details to sign in
          </p>

          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-[400px] h-[50px] bg-white/50 dark:bg-[#f0f4f9] border border-white dark:border-transparent rounded-xl text-center m-[5px] text-gray-900 placeholder-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all duration-300"
            type="email"
            placeholder="Email Address"
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-[400px] h-[50px] bg-white/50 dark:bg-[#f0f4f9] border border-white dark:border-transparent rounded-xl text-center m-[5px] text-gray-900 placeholder-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all duration-300 tracking-widest"
            type="password"
            placeholder="........"
          />

          {/* 🔥 LOGIN BUTTON 🔥 */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-[400px] h-[50px] bg-gradient-to-r from-[#4f46e5] to-[#a855f7] hover:from-[#4338ca] hover:to-[#9333ea] text-white font-bold rounded-xl cursor-pointer mt-[15px] shadow-lg transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              "Login"
            )}
          </button>

          <div className="flex items-center w-[400px] my-5">
            <div className="flex-1 border-t border-gray-400 dark:border-gray-600 transition-colors"></div>
            <span className="px-4 text-xs text-gray-800 dark:text-gray-400 font-bold uppercase transition-colors">
              Or
            </span>
            <div className="flex-1 border-t border-gray-400 dark:border-gray-600 transition-colors"></div>
          </div>

          {/* 🔥 GOOGLE BUTTON 🔥 */}
          <button
            className="w-[400px] h-[50px] bg-gradient-to-r from-[#4f46e5] to-[#a855f7] hover:from-[#4338ca] hover:to-[#9333ea] text-white font-bold rounded-xl cursor-pointer flex justify-center items-center shadow-lg transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-70"
            onClick={loginWithGoogle}
            disabled={loading}
          >
            <GrGoogle className="mr-[10px] text-lg" />
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              "Continue with Google"
            )}
          </button>

          <p className="text-gray-900 dark:text-gray-400 text-sm font-medium mt-[20px] transition-colors">
            Don't have an account yet? &nbsp;
            <span className="text-[#4f46e5] dark:text-[#a855f7] cursor-pointer hover:underline font-bold transition-colors">
              <Link to={"/register"}>Register Now</Link>
            </span>
          </p>

          <p className="text-gray-900 dark:text-gray-400 text-sm font-medium m-[10px] transition-colors">
            Forget your password? &nbsp;
            <span className="text-[#4f46e5] dark:text-[#a855f7] cursor-pointer hover:underline font-bold transition-colors">
              <Link to={"/forget"}>Reset Password</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
