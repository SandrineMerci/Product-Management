import { createContext, useContext, useState, useEffect} from "react";
import type {ReactNode } from "react";
import { useAuth } from "../hooks/AuthContext";
import api from "../services/api";
import type { Product } from "../hooks/useProducts";

export type CartProduct = Product & {
  quantity: number;
  total: number;
  discountedTotal: number;
};

export interface Cart {
  id: number;
  userId: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

interface CartContextType {
  cart: Cart | null;
  addToCart: (product: Product) => Promise<boolean>;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  fetchUserCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);

  
  const calculateCart = (products: CartProduct[], userId: number): Cart => {
    const total = products.reduce((sum, p) => sum + p.total, 0);
    const discountedTotal = products.reduce((sum, p) => sum + p.discountedTotal, 0);
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

    return {
      id: 1, 
      userId,
      products,
      total,
      discountedTotal,
      totalProducts,
      totalQuantity,
    };
  };

  
  const fetchUserCart = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/carts/user/${user.id}`);
      const userCart = res.data.carts[0];
      if (userCart) {
        setCart(calculateCart(userCart.products, user.id));
      } else {
        setCart(calculateCart([], user.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, [user]);

  const addToCart = async (product: Product): Promise<boolean> => {
    if (!user) return false;

    let products: CartProduct[] = cart?.products || [];

    const existing = products.find((p) => p.id === product.id);
    if (existing) {
      products = products.map((p) =>
        p.id === product.id
          ? {
              ...p,
              quantity: p.quantity + 1,
              total: (p.quantity + 1) * p.price,
              discountedTotal: (p.quantity + 1) * p.price * (1 - (p.discountPercentage || 0) / 100),
            }
          : p
      );
    } else {
      products.push({
        ...product,
        quantity: 1,
        total: product.price,
        discountedTotal: product.price * (1 - (product.discountPercentage || 0) / 100),
      });
    }

    const updatedCart = calculateCart(products, user.id);
    setCart(updatedCart);

    try {
      await api.put(`/carts/${user.id}`, updatedCart);
    } catch (err) {
      console.error(err);
    }

    return true;
  };

  const removeFromCart = (id: number) => {
    if (!cart) return;
    const products = cart.products.filter((p) => p.id !== id);
    setCart(calculateCart(products, cart.userId));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (!cart) return;
    if (quantity <= 0) return removeFromCart(id);

    const products = cart.products.map((p) =>
      p.id === id
        ? {
            ...p,
            quantity,
            total: p.price * quantity,
            discountedTotal: p.price * quantity * (1 - (p.discountPercentage || 0) / 100),
          }
        : p
    );

    setCart(calculateCart(products, cart.userId));
  };

  const clearCart = () => {
    if (!cart) return;
    setCart(calculateCart([], cart.userId));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, fetchUserCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
