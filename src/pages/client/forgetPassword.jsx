import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state for buttons
  const navigate = useNavigate();

  function sendEmail(e) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/sendMail", {
        email: email,
      })
      .then((response) => {
        console.log(response.data);
        setEmailSent(true);
        toast.success("OTP sent to your email!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function changePassword(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/changePW", {
        email: email,
        otp: otp,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        toast.success("Password changed successfully");
        navigate("/login"); // Smooth React Router navigation
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error?.response?.data?.message || "Invalid OTP or error occurred",
        );
        setLoading(false);
      });
  }

  // Consistent Theme Classes matching your Login & Register pages
  const inputTheme =
    "w-full h-[50px] bg-white/50 dark:bg-[#f0f4f9] border border-white dark:border-transparent rounded-xl text-center mb-4 text-gray-900 placeholder-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-all duration-300";

  const buttonTheme =
    "w-full h-[50px] bg-gradient-to-r from-[#4f46e5] to-[#a855f7] hover:from-[#4338ca] hover:to-[#9333ea] text-white font-bold rounded-xl cursor-pointer shadow-lg transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 flex items-center justify-center mt-2";

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex transition-colors duration-300"
      // FIXED: Using absolute public path. Ensure login-bg.jpg is inside your 'public' folder!
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="w-[65%] h-180 hidden lg:block"></div>

      <div className="w-full lg:w-[50%] flex-1 flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-[450px] h-auto py-10 px-6 backdrop-blur-xl bg-white/20 dark:bg-[#242a38]/95 shadow-2xl rounded-2xl flex flex-col justify-center items-center transition-colors duration-500 border border-white/40 dark:border-gray-700/50">
          {emailSent ? (
            /* ================= STEP 2: RESET PASSWORD ================= */
            <>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 transition-colors text-center">
                Reset Password
              </h2>
              <p className="text-gray-800 dark:text-gray-400 mb-6 text-sm font-medium transition-colors text-center">
                Enter the OTP sent to{" "}
                <span className="font-bold text-[#4f46e5] dark:text-blue-400">
                  {email}
                </span>
              </p>

              <form
                onSubmit={changePassword}
                className="w-full flex flex-col items-center"
              >
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  required
                  placeholder="Enter OTP"
                  className={inputTheme + " tracking-widest text-lg font-bold"}
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />

                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="New Password"
                  className={inputTheme + " tracking-widest"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />

                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder="Confirm New Password"
                  className={inputTheme + " tracking-widest"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={buttonTheme}
                >
                  {loading ? (
                    <span className="animate-pulse">Updating...</span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* ================= STEP 1: SEND OTP ================= */
            <>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 transition-colors text-center">
                Forgot Password?
              </h2>
              <p className="text-gray-800 dark:text-gray-400 mb-6 text-sm font-medium transition-colors text-center">
                Enter your email address and we'll send you an OTP to securely
                reset your password.
              </p>

              <form
                onSubmit={sendEmail}
                className="w-full flex flex-col items-center"
              >
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  className={inputTheme}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={buttonTheme}
                >
                  {loading ? (
                    <span className="animate-pulse">Sending OTP...</span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            </>
          )}

          {/* BACK TO LOGIN LINK */}
          <p className="text-gray-900 dark:text-gray-400 text-sm font-medium mt-[24px] transition-colors text-center">
            Remember your password? &nbsp;
            <span className="text-[#4f46e5] dark:text-[#a855f7] cursor-pointer hover:underline font-bold transition-colors">
              <Link to={"/login"}>Login Here</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
