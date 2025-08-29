// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password); 
      navigate("/products");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f4f8]">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#3d5a80] mb-6">
          Welcome Back
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d5a80]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d5a80]"
            required
          />
          <button
            type="submit"
            className="mt-4 bg-[#3d5a80] text-white py-3 rounded-xl font-medium hover:bg-[#2c3e50] transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
