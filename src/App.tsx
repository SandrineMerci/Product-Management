import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductsList from "./pages/ProductsList";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./hooks/CartContext"; 
import Login from "./pages/Login";
import { AuthProvider } from './hooks/AuthContext';

export default function App() {
  return (
    <AuthProvider>
    <CartProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/carts" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}
