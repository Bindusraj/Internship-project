import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";

export default function App() {
  
  // ✅ Auto-login Guest User so Cart & Checkout work without a Login page
  useEffect(() => {
    const autoLogin = async () => {
        try {
          // 1. Try to Login as Guest
          let res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "guest@example.com", password: "password123" })
          });

          if (!res.ok) {
            // 2. If login fails, Register the Guest
            res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: "Guest User", email: "guest@example.com", password: "password123" })
            });
          }

          const data = await res.json();
          if (data.token) {
            localStorage.setItem("token", data.token);
            // Notify other components (like Navbar) that token is ready
            window.dispatchEvent(new Event("cartUpdated"));
          }
        } catch (error) {
          console.error("Guest auto-login failed:", error);
        }
    };
    autoLogin();
  }, []);

  return (
    <BrowserRouter>
      <Navbar /> {/* ✅ MUST be ABOVE Routes */}

      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
