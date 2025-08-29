import React, { useState } from "react";
import api from "../services/api";
import type { Product } from "../hooks/useProducts";

export default function ProductForm({ product, onUpdate }: { product: Product, onUpdate: (p: Product) => void }) {
  const [form, setForm] = useState(product);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
  try {
    
    const payload = {
      title: form.title,
      price: form.price,
      category: form.category,
    };

    const res = await api.patch(`/products/${product.id}`, payload);

    alert("Product updated!");
    onUpdate(res.data);
  } catch (err) {
    console.error(err);
    alert("Update failed.");
  }
};

  return (
    <div className="mt-4 space-y-2">
      <input name="title" value={form.title} onChange={handleChange} className="border p-2 w-full" />
      <input name="price" value={form.price} onChange={handleChange} className="border p-2 w-full" />
      <input name="category" value={form.category} onChange={handleChange} className="border p-2 w-full" />
      <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </div>
  );
}
