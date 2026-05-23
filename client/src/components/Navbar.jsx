import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  const getCartCount = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartCount(0);
      return;
    }

    const res = await fetch("/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    // ✅ FILTER invalid/null products (THIS FIXES YOUR BUG)
    const validItems = data.items?.filter(item => item.product);

    const count =
      validItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    setCartCount(count);
  } catch (err) {
    console.log(err);
    setCartCount(0);
  }
};

  useEffect(() => {
    getCartCount();

    // ✅ listen for cart updates (VERY IMPORTANT)
    window.addEventListener("cartUpdated", getCartCount);

    return () => {
      window.removeEventListener("cartUpdated", getCartCount);
    };
  }, []);

  return (
    <div className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold tracking-wide">
        🛍️ ShopSphere
      </h1>

      {/* Links */}
      <div className="flex gap-6 items-center text-lg">
        
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>

        {/* Cart with badge */}
        <Link to="/cart" className="relative hover:text-gray-300">
          🛒 Cart

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        <Link to="/checkout" className="hover:text-gray-300">
          Checkout
        </Link>
      </div>
    </div>
  );
}
