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
import Header from "./components/header"; // ADD THIS IMPORT

function App() {
  return (
    <GoogleOAuthProvider clientId="149381885055-vgt1mnbtecieslegomscgusp7tiu3kgv.apps.googleusercontent.com">
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes path="/*">
          {/* Admin pages without header */}
          <Route path="/admin/*" element={<AdminPage />} />

          {/* Auth pages WITHOUT header (current) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forget" element={<ForgetPassword />} />

          {/* All other pages WITH header */}
          <Route
            path="/contact"
            element={
              <>
                <Header />
                <ContactPage />
              </>
            }
          />
          <Route
            path="/reviews"
            element={
              <>
                <Header />
                <ReviewPage />
              </>
            }
          />
          <Route
            path="/testing"
            element={
              <>
                <Header />
                <Testing />
              </>
            }
          />
          <Route
            path="/r"
            element={
              <>
                <Header />
                <ResponsiveTesting />
              </>
            }
          />
          <Route
            path="/*"
            element={
              <>
                <Header />
                <HomePage />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
