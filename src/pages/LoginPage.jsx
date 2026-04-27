import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GrGoogle } from "react-icons/gr";
import {
  AuthButton,
  AuthDivider,
  AuthInput,
  AuthLayout,
} from "../components/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirect || "/";

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/firebase-sync", {
        idToken,
      });

      toast.success("Login successful");
      localStorage.setItem("token", idToken); // Use Firebase ID token for backend auth
      navigate(redirectTo);
    } catch (error) {
      console.error("Google login failed", error);
      toast.error(error?.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  async function handleLogin() {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      console.log(`[Diagnostic] Firebase Project: ${auth.app.options.projectId}`);
      console.log(`[Auth] Email: "${trimmedEmail}", Password Length: ${trimmedPassword.length}`);
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      const idToken = await userCredential.user.getIdToken();

      console.log(`[Auth] Firebase login successful, syncing with backend...`);
      // Sync with backend (ensure user exists in MongoDB)
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/firebase-sync", {
        idToken,
      });

      toast.success("Login successful");
      localStorage.setItem("token", idToken);
      navigate(redirectTo);
    } catch (error) {
      console.error("[Auth] Login failed error:", error);
      
      // Handle the specific 'invalid-credential' error which is generic in v9+
      let errorMessage = error.message;
      if (error.code === 'auth/invalid-credential') {
         errorMessage = "Invalid email or password. Please double-check your credentials. If you just reset your password, ensure the reset was successful.";
      } else if (error.code) {
         errorMessage = `Firebase Error: ${error.code} - ${error.message}`;
      }
      
      toast.error(errorMessage, { duration: 6000 });
    } finally {
      setLoading(false);
    }
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
