import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GrGoogle } from "react-icons/gr";
import {
  AuthButton,
  AuthDivider,
  AuthInput,
  AuthLayout,
} from "../../components/authLayout";

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

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleRegister() {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Sync with backend MongoDB
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/register-firebase", {
        idToken,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      toast.success("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/user/firebase-sync", {
        idToken,
      });

      toast.success("Registration successful");
      navigate("/");
    } catch (error) {
      console.error("Google registration failed", error);
      toast.error(error?.response?.data?.message || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Please enter your details to register"
      footer={
        <p>
          Already have an account?{" "}
          <span className="font-bold text-[#4f46e5] transition-colors hover:underline dark:text-[#a855f7]">
            <Link to="/login">Login Now</Link>
          </span>
        </p>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleRegister();
        }}
        className="w-full flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthInput
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            type="text"
            placeholder="First Name"
          />
          <AuthInput
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            type="text"
            placeholder="Last Name"
          />
        </div>

        <AuthInput
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Email Address"
        />
        <AuthInput
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          type="text"
          placeholder="Phone Number"
        />
        <AuthInput
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
        />
        <AuthInput
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          type="password"
          placeholder="Confirm Password"
        />

        <AuthButton type="submit" disabled={loading} className="mt-2">
          {loading ? (
            <span className="animate-pulse">Registering...</span>
          ) : (
            "Register"
          )}
        </AuthButton>

        <AuthDivider />

        <AuthButton onClick={loginWithGoogle} disabled={loading} type="button">
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
