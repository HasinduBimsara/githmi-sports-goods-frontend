import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
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
import ProductsPage from "./pages/client/productsPage";
import ProductOverview from "./pages/client/productOverview";
import CartPage from "./pages/client/cart";
import CheckoutPage from "./pages/client/checkout";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRoute from "./components/admin/AdminRoute";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminMessages from "./pages/admin/AdminMessages";
import SplashPage from "./pages/SplashPage";

function ConditionalHeader() {
  const location = useLocation();
  if (location.pathname === "/") return null;
  return <Header />;
}

function App() {
  return (
    <GoogleOAuthProvider clientId="797436517957-cvsurn88audvjb951j65grp8hia64pac.apps.googleusercontent.com">
      {/* GLOBAL THEME WRAPPER - This controls the background and text color globally */}
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <BrowserRouter>
          <Toaster position="top-right" />
          <ConditionalHeader />

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forget" element={<ForgetPassword />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="messages" element={<AdminMessages />} />
              </Route>
            </Route>

            <Route path="/products" element={<ProductsPage />} />
            <Route path="/overview/:id" element={<ProductOverview />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            <Route path="/contact" element={<ContactPage />} />
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/r" element={<ResponsiveTesting />} />

            <Route path="/" element={<SplashPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
