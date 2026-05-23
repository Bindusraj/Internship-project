import { useEffect, useState } from "react";

export default function Checkout() {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch cart total
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await fetch("/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        const total =
          data.items?.reduce(
            (sum, item) =>
              sum + (item.product?.price || 0) * item.quantity,
            0
          ) || 0;

        setAmount(total);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTotal();
  }, [token]);

  // ✅ Razorpay Payment
  const handlePayment = async () => {
    try {
      setLoading(true);

      // 🔹 create order from backend
      const res = await fetch(
        "/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount + 50,
          }),
        }
      );

      const order = await res.json();

      if (!order.id) {
        alert("Order creation failed ❌");
        return;
      }

      // 🔥 Razorpay options
      const options = {
        key: "rzp_test_SjZ0xIq0sihNyX",
        amount: order.amount,
        currency: "INR",
        name: "ShopSphere",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            const res = await fetch(
              "/api/orders",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const data = await res.json();

            if (res.ok) {
              alert("Payment Successful 🎉 Order Placed!");

              // 🔥 update UI
              window.dispatchEvent(new Event("cartUpdated"));

              window.location.href = "/";
            } else {
              alert(data.message || "Order failed ❌");
            }
          } catch (err) {
            console.log(err);
            alert("Order saving failed ❌");
          }
        },

        // ❌ HANDLE FAILURE
        modal: {
          ondismiss: function () {
            alert("Payment cancelled ❌");
          },
        },

        prefill: {
          name: "Test User",
          email: "test@razorpay.com",
          contact: "9999999999",
        },

        theme: {
          color: "#000000",
        },
      };

      // ✅ Safety check
      if (!window.Razorpay) {
        alert("Razorpay not loaded ❌");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();

      setLoading(false);
    } catch (err) {
      console.log(err);
      alert("Payment failed ❌");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        <p className="mb-2 flex justify-between">
          <span>Subtotal</span>
          <span>₹{amount}</span>
        </p>

        <p className="mb-2 flex justify-between">
          <span>Delivery</span>
          <span>₹50</span>
        </p>

        <hr className="my-3" />

        <h3 className="font-bold text-lg mb-4 flex justify-between">
          <span>Total</span>
          <span>₹{amount + 50}</span>
        </h3>

        <button
          onClick={handlePayment}
          disabled={loading || amount === 0}
          className="bg-black text-white w-full py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Pay with Razorpay 💳"}
        </button>
      </div>
    </div>
  );
}
