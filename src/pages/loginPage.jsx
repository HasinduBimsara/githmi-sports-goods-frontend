import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { GrGoogle } from "react-icons/gr";
import {
  AuthButton,
  AuthDivider,
  AuthInput,
  AuthLayout,
} from "../components/authLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirect || "/";

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
          navigate(redirectTo);
        })
        .catch((error) => {
          console.log("Google login failed", error?.response?.data || error);
          toast.error(error?.response?.data?.message || "Login failed");
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  function handleLogin() {
    setLoading(true);
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
        email,
        password,
      })
      .then((response) => {
        console.log("Login successful", response.data);
        toast.success("Login successful");
        localStorage.setItem("token", response.data.token);
        navigate(redirectTo);
      })
      .catch((error) => {
        console.log("Login failed", error.response?.data);
        toast.error(error.response?.data?.message || "Login failed");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Please enter your details to sign in"
      footer={
        <>
          <p>
            Don't have an account yet?{" "}
            <span className="font-bold text-[#4f46e5] transition-colors hover:underline dark:text-[#a855f7]">
              <Link to="/register">Register Now</Link>
            </span>
          </p>
          <p className="mt-3">
            Forget your password?{" "}
            <span className="font-bold text-[#4f46e5] transition-colors hover:underline dark:text-[#a855f7]">
              <Link to="/forget">Reset Password</Link>
            </span>
          </p>
        </>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleLogin();
        }}
        className="w-full flex flex-col gap-4"
      >
        <AuthInput
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email Address"
        />

        <AuthInput
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="........"
        />

        <AuthButton type="submit" disabled={loading} className="mt-2">
          {loading ? <span className="animate-pulse">Loading...</span> : "Login"}
        </AuthButton>

        <AuthDivider />

        <AuthButton onClick={loginWithGoogle} disabled={loading}>
          <GrGoogle className="mr-[10px] text-lg" />
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            "Continue with Google"
          )}
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
