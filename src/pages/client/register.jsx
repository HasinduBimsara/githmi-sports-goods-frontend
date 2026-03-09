import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  AuthButton,
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

  function handleRegister() {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })
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

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Please enter your details to register"
      footer={
        <p>
          Already have an account?{" "}
          <span className="font-bold text-[#4f46e5] transition-colors hover:underline">
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
      </form>
    </AuthLayout>
  );
}
