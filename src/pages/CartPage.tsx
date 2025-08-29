import { useCart } from "../hooks/CartContext";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  if (!cart || cart.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-600">
        <h2 className="text-2xl font-bold mb-4">
          Your cart is empty <FaShoppingCart />
        </h2>
        <p className="text-gray-500">Browse products and add them to your cart!</p>
        <Link
          to="/products"
          className="mt-4 px-4 py-2 bg-[#3d5a80] text-white rounded-xl hover:bg-[#2c3e50] transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = cart.total;
  const totalQuantity = cart.totalQuantity;

  return (
    <div className="min-h-screen bg-[#b0c2c7]">
      <div className="max-w-5xl mx-auto p-6 bg-[#3d5a80]/10">
        {/* Back to Products */}
        <Link
          to="/products"
          className="flex gap-2 items-center text-[#3d5a80] font-medium mb-6 hover:underline"
        >
          <FaArrowLeft /> Go back
        </Link>

        <h2 className="text-3xl font-bold text-[#3d5a80] mb-6">Your Cart</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.products.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white rounded-2xl shadow p-4"
              >
                {/* Thumbnail & Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-[#3d5a80]">{item.title}</h3>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                {/* Total & Remove */}
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-700">
                    ${item.discountedTotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="flex justify-between font-bold text-gray-700 mb-2">
              <span>Subtotal ({totalQuantity} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-700 mb-2">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#3d5a80] border-t pt-2">
              <span>Total</span>
              <span>${cart.discountedTotal.toFixed(2)}</span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
              >
                Clear Cart
              </button>
              {/* <button className="bg-[#3d5a80] text-white py-2 rounded-xl hover:bg-[#2c3e50] transition">
                Checkout
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
