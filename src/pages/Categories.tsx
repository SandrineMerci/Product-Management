import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Categories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products/categories").then((res) => {
      let list: string[];

    
      if (Array.isArray(res.data) && typeof res.data[0] === "object") {
        list = res.data.map((c: any) => c.slug || c.name || "");
      } else {
        list = res.data;
      }

      setCategories(list);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="p-4">Loading categories...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((c) => (
          <Link
            key={c}
            to={`/products?category=${c}`}
            className="block text-center border rounded-lg bg-white shadow hover:shadow-md hover:bg-blue-50 p-4 transition">
          
            <span className="capitalize font-medium">{c}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
