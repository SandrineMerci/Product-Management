import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { FiLoader, FiFilter, FiX } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../hooks/CartContext";

export default function ProductsList() {
  const { products, categories, loading, error, fetchProducts } = useProducts();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const { cart } = useCart();
  const totalQuantity = cart?.totalQuantity || 0;

  const handleCategoryClick = (category: string) => {
    const newCategory = activeCategory === category ? undefined : category;
    setActiveCategory(newCategory);
    fetchProducts(undefined, newCategory);
  };

  return (
    <div className="min-h-screen bg-[#b0c2c7]">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#3d5a80] to-[#f4b6b6] py-16 text-white">
        
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Products</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Shop the latest collection of premium products at unbeatable prices
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 bg-[#f4b6b6] text-[#333333] rounded-xl px-4 py-3 hover:bg-[#f7c1c1] shadow-sm transition"
          >
            <FiFilter /> Filters
          </button>

          {/* Search Bar */}
          <div className="flex items-center justify-between w-full gap-4">
            <SearchBar onSearch={(q) => fetchProducts(q)} />

              <div className="bg-white rounded-full ">
              <Link to="/carts"
      className="relative flex items-center justify-center w-[40px] h-[40px] p-2">
      <FaShoppingCart size={25} className="text-gray-700" />
      {totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 text-xs flex items-center justify-center">
          {totalQuantity}
        </span>
      )}
    </Link>

              </div> 
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="absolute top-0 left-0 h-full w-4/5 bg-[#f6f8f9] p-4 overflow-y-auto rounded-r-2xl shadow-sm border border-[#d0d7dc]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#333333]">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <FiX size={24} className="text-[#333333]" />
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-[#333333]">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        handleCategoryClick(c);
                        setMobileFiltersOpen(false);
                      }}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                        activeCategory === c
                          ? 'bg-[#3d5a80] text-white'
                          : 'bg-white hover:bg-gray-100 border border-[#d0d7dc]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Category Filters */}
        <div className="hidden md:block mb-8">
          <h3 className="text-lg font-medium mb-3 text-[#333333]">Shop by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryClick(c)}
                className={`px-4 py-2 rounded-full transition-all font-medium ${
                  activeCategory === c
                    ? 'bg-[#3d5a80] text-white shadow-sm'
                    : 'bg-white border border-[#d0d7dc] hover:bg-gray-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <FiLoader className="animate-spin text-4xl text-[#3d5a80] mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiX className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-[#333333] mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
