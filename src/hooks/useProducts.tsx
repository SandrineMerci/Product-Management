import { useState, useEffect } from "react";
import api from "../services/api";

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  thumbnail: string;
  images: string[];
}


export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async (query?: string, category?: string) => {
    try {
      setLoading(true);
      setError("");
      let url = "/products";
      if (query) url = `/products/search?q=${query}`;
      if (category) url = `/products/category/${category}`;
      const res = await api.get(url);
      setProducts(res.data.products || res.data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await api.get("/products/categories");
   setCategories(res.data.map((c: any) => c.slug));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return { products, categories, loading, error, fetchProducts, setProducts };
}
