import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Fetch cart
  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Increase quantity
  const addToCart = async (id) => {
    try {
      await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Decrease quantity
  const decreaseQty = async (id) => {
    try {
      await fetch("/api/cart/decrease", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Remove item
  const removeItem = async (id) => {
    try {
      await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ REMOVE BROKEN PRODUCTS (IMPORTANT)
  const validItems = cart.items?.filter((item) => item.product) || [];

  // ✅ Total (safe)
  const total =
    validItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🛒 Your Cart</h1>

      {validItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-4">
            {validItems.map((item) => (
              <div
                key={item.product._id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.product.image ||
                      "https://via.placeholder.com/100"
                    }
                    alt={item.product.name}
                    className="w-20 h-20 object-contain"
                  />

                  <div>
                    <h2 className="font-semibold">
                      {item.product.name}
                    </h2>

                    <p className="text-green-600 font-bold">
                      ₹{item.product.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQty(item.product._id)}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => addToCart(item.product._id)}
                    className="px-3 py-1 bg-black text-white rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-500"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <p className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </p>

            <p className="flex justify-between mb-2">
              <span>Delivery</span>
              <span>₹50</span>
            </p>

            <hr className="my-3" />

            <h3 className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total + 50}</span>
            </h3>

            <button
              onClick={() => navigate("/checkout")}
              className="bg-black text-white w-full mt-5 py-2 rounded hover:bg-gray-800"
            >
              Checkout Now
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
