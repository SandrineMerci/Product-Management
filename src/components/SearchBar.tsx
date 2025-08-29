import { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-purple-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search products..."
        className="
          w-full
          py-3
          pl-10
          pr-4
          rounded-xl
          border
          border-gray-300
          focus:outline-none
          focus:ring-2
          focus:ring-purple-400
          focus:border-purple-400
          placeholder-gray-400
          transition
          duration-200
        "
      />
    </div>
  );
}
