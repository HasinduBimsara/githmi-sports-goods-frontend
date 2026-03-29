import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromBackend = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      localStorage.setItem("token", idToken);
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/current`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to load user from backend:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        loadUserFromBackend(firebaseUser);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
