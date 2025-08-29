
import { useState } from "react";
import type { Product } from "../hooks/useProducts";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../hooks/CartContext"; 
 import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }: { product: Product }) {
  const [message, setMessage] = useState("");
  
   const navigate = useNavigate();
   const { addToCart } = useCart(); 

  const handleAddToCart = async () => {
    const added = await addToCart(product); 
    if (!added) {
      alert("Please log in first!");
      navigate("/login"); 
      return;
    }
    setMessage(`${product.title} added to cart!`);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="bg-[#f6f8f9] border border-[#d0d7dc] rounded-3xl shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1 p-5 flex flex-col">
      {/* Product Image */}
      <div className="w-full h-52 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center mb-4 relative group">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 rounded-2xl"
        />
        <div className="absolute inset-0 bg-[#3d5a80]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-[#3d5a80] line-clamp-1 mb-1">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
      </div>

      {/* Price & Actions */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[#3d5a80] font-bold text-lg">
          ${product.price.toFixed(2)}
        </span>
        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="px-3 py-1 rounded-lg bg-[#3d5a80] hover:bg-[#2c3e50] text-white text-sm font-medium transition-all flex items-center justify-center"
          >
            Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="px-3 py-1 rounded-lg bg-[#f4b6b6] hover:bg-[#f7c1c1] text-[#333333] text-sm font-medium flex items-center justify-center transition-all"
          >
            <FaShoppingCart className="mr-1" /> Add Cart
          </button>
        </div>
      </div>

      {/* Stock / Discount Badge */}
      <div className="mt-3 flex items-center justify-between">
        {product.stock > 0 ? (
          <span className="text-green-500 font-medium">
            In Stock ({product.stock})
          </span>
        ) : (
          <span className="text-red-500 font-medium">Out of Stock</span>
        )}
        {product.discountPercentage > 0 && (
          <span className="bg-[#d4af37] text-white px-2 py-0.5 rounded-full text-xs font-medium">
            Save {product.discountPercentage}%
          </span>
        )}
      </div>

      {/* Inline feedback message */}
      {message && (
        <p className="mt-3 text-gray-700 italic text-sm animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
