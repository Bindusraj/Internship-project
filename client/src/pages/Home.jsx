import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  // 🔥 FILTER STATES
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 🔹 Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  // 🔹 Add to Cart
  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first ⚠️");
        return;
      }

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (res.ok) {
        window.dispatchEvent(new Event("cartUpdated"));
        alert("Added to cart ✅");
      } else {
        alert(data.message || "Error adding to cart");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong ❌");
    }
  };

  // 🔥 FILTER + SORT LOGIC
  let filteredProducts = products
    // 🔍 Search
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )

    // 📂 Category
    .filter((p) =>
      selectedCategory === "All"
        ? true
        : p.category === selectedCategory
    )

    // 💰 Price filter
    .filter((p) =>
      minPrice ? p.price >= Number(minPrice) : true
    )
    .filter((p) =>
      maxPrice ? p.price <= Number(maxPrice) : true
    );

  // 🔽 Sorting
  if (sortOption === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🛍️ Products
      </h1>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-lg shadow-sm"
      />

      {/* 📂 CATEGORY */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {["All", "Mobile", "Laptop", "Electronics", "Fashion", "Furniture"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 💰 PRICE + SORT */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">

        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-3 py-1 border rounded w-24"
        />

        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-3 py-1 border rounded w-24"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="default">Sort By</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>

      </div>

      {/* 🛍️ PRODUCTS */}
      {products.length === 0 ? (
        <p>Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
