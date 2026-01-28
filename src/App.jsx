import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminPage from "./pages/adminPage";
import LoginPage from "./pages/loginPage";
import Testing from "./pages/testing";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/client/register";
import HomePage from "./pages/homePage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ResponsiveTesting from "./pages/test";
import ForgetPassword from "./pages/client/forgetPassword";
import ContactPage from "./pages/client/ContactPage";
import ReviewPage from "./pages/client/ReviewPage";
import Header from "./components/header";
import ProductsPage from "./pages/client/productsPage"; // ADD THIS
import ProductOverview from "./pages/client/productOverview"; // ADD THIS
import CartPage from "./pages/client/cart"; // ADD THIS
import CheckoutPage from "./pages/client/checkout"; // ADD THIS

function App() {
  return (
    <GoogleOAuthProvider clientId="149381885055-vgt1mnbtecieslegomscgusp7tiu3kgv.apps.googleusercontent.com">
      <BrowserRouter>
        <Toaster position="top-right" />
        {/* Header outside Routes so it shows on ALL pages except admin */}
        <Header />

        <Routes path="/*">
          {/* Admin pages - no header needed as AdminPage has its own */}
          <Route path="/admin/*" element={<AdminPage />} />

          {/* Auth pages - header will show but you can hide it in CSS if needed */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forget" element={<ForgetPassword />} />

          {/* Product-related pages */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/overview/:id" element={<ProductOverview />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Other pages */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/reviews" element={<ReviewPage />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/r" element={<ResponsiveTesting />} />

          {/* Home page - should be last */}
          <Route path="/*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
