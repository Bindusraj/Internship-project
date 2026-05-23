const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition duration-300">
      
      <img
      src={product.image}
      alt={product.name}
      onError={(e) => {
        e.target.src = "https://via.placeholder.com/200";
    }}
    className="w-full h-40 object-contain mb-3"
    />

      <h2 className="text-lg font-semibold text-gray-800">
        {product?.name}
      </h2>

      <p className="text-green-600 font-bold text-lg mt-1">
        ₹ {product?.price}
      </p>

      <button
        onClick={() => addToCart(product._id)}
        className="w-full mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
      >
        Add to Cart 🛒
      </button>

    </div>
  );
};

export default ProductCard;
