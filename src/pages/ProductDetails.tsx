import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import type { Product, Review } from "../hooks/useProducts";
import { 
  // FaShoppingCart, 
FaEdit,
  FaStar, 
  FaRegStar,
  FaCheckCircle,
  FaCheck,
  FaChevronRight,
  FaTimes,
  FaTrash,
  FaArrowLeft 
} from 'react-icons/fa';
import { Link } from "react-router-dom";

const StarIcon = ({ filled, className = '' }: { filled: boolean; className?: string }) => (
  filled ? <FaStar className={`${className} text-[#d4af37]`} /> : <FaRegStar className={`${className} text-gray-300`} />
);

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [activeTab, setActiveTab] = useState('Description');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
   const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const deleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        alert("Product deleted successfully!");
        setDeleted(true);  
      } catch (err) {
        console.error(err);
        alert("Failed to delete product");
      }
    }
  };
   const updateProduct = async () => {
  try {
    const res = await api.put(`/products/${id}`, editForm);

    
    setProduct(prev => ({ ...prev, ...res.data }));

    setIsEditing(false);
    alert("Product updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update product");
  }
};


  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d5a80]"></div>
    </div>
  );

  if (deleted) return (
    <div className="max-w-6xl mx-auto bg-[#f6f8f9] shadow-sm rounded-xl p-8 mt-6 text-center border border-[#d0d7dc]">
      <FaTimes className="mx-auto text-red-500 text-5xl mb-4" />
      <h2 className="text-2xl font-bold text-red-500 mb-2">Product Deleted</h2>
      <p className="text-gray-500">This product has been removed from our catalog.</p>
    </div>
  );

  if (!product) return (
    <div className="max-w-6xl mx-auto bg-[#f6f8f9] shadow-sm rounded-xl p-8 mt-6 text-center border border-[#d0d7dc]">
      <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
      <p className="text-gray-500 mt-2">The requested product could not be located.</p>
    </div>
  );

  const averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length || 0;

  return (
    <div className="max-w-6xl mx-auto bg-[#b0c2c7] shadow-sm rounded-xl overflow-hidden mt-6 mb-10 border border-[#d0d7dc]">
      <Link to="/products" className="flex gap-3 items-center px-4 py-4">
        <FaArrowLeft /> 
        Go back
      </Link>
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedImage} 
              alt="Enlarged product view" 
              className="max-w-full max-h-screen object-contain rounded-lg shadow-sm"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100"
            >
              <FaTimes className="text-gray-800 text-xl" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 p-6">
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-4">
            <div 
              className="w-full h-96 bg-gray-50 rounded-xl border border-[#d0d7dc] mb-4 flex items-center justify-center cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              onClick={() => setSelectedImage(product.thumbnail)}
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto py-2 px-1">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg border border-[#d0d7dc] overflow-hidden cursor-pointer relative hover:before:absolute hover:before:inset-0 hover:before:bg-[#3d5a80]/10 hover:before:z-10 transition-all shadow-sm"
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`${product.title} ${idx}`} 
                    className="w-full h-full object-cover relative z-20"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          {/* Title and Basic Info */}
          <div className="border-b border-[#d0d7dc] pb-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-[#333333]">{product.title}</h1>
              <div className="flex gap-2">
               
                <button
  onClick={() => {
    setEditForm({
      title: product.title,
      price: product.price,
      stock: product.stock,
      description: product.description,
    });
    setIsEditing(true);
  }}
  className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
  title="Edit product"
>
  <FaEdit />
</button>
              <button
                onClick={deleteProduct}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                title="Delete product"
              >
                <FaTrash />
              </button>
            </div>
            </div>
            {isEditing && (
            <div className="fixed inset-0 bg-[#d0d7dc] bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-[#b0c2c7] rounded-lg p-6 w-full max-w-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                
                <div className="space-y-4">
                  <input 
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Product Title"
                  />
                  <input 
                    type="number"
                    value={editForm.price || ""}
                    onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Price"
                  />
                  <input 
                    type="number"
                    value={editForm.stock || ""}
                    onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Stock"
                  />
                </div>

                <div className="flex justify-end mt-6 gap-3">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={updateProduct}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-900"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
            
            <div className="flex items-center mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < Math.floor(averageRating)} />
                ))}
              </div>
              <span className="ml-2 text-[#333333] text-sm">
                {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''} | {product.brand}
              </span>
            </div>
            
            {/* Price Section */}
            <div className="mt-4 flex items-center flex-wrap gap-2">
              <span className="text-3xl font-bold text-[#3d5a80]">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="ml-2 text-lg text-gray-400 line-through">
                    ${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}
                  </span>
                  <span className="bg-[#d4af37] text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                    Save {product.discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Availability */}
            <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <div className="flex items-center">
                {product.stock > 0 ? (
                  <>
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">In Stock</span>
                    <span className="text-gray-500 text-sm ml-2">{product.stock} available</span>
                  </>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
              <span className="text-[#3d5a80] text-sm font-medium flex items-center">
                Delivery options <FaChevronRight className="ml-1 text-xs" />
              </span>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-6 border-b border-[#d0d7dc] pb-6">
            <h3 className="text-lg font-semibold text-[#333333] mb-3">Highlights</h3>
            <ul className="space-y-3">
              {['Brand', 'Category', 'Warranty', 'Free shipping on orders over $50'].map((text, idx) => (
                <li key={idx} className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>{text === 'Brand' ? `Brand: ${product.brand}` :
                        text === 'Category' ? `Category: ${product.category}` :
                        text === 'Warranty' ? `Warranty: ${product.warrantyInformation}` :
                        text
                      }</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          {/* <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-[#3d5a80] hover:bg-[#2c3e50] text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition duration-200 shadow-sm hover:shadow-md">
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </button>
            
          </div> */}

          {/* Tabs */}
          <div className="mt-8">
            <div className="border-b border-[#d0d7dc]">
              <nav className="-mb-px flex space-x-8">
                {['Description', 'Specifications', 'Shipping', 'Reviews'].map((tab) => (
                  <button
                    key={tab}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab
                        ? 'border-[#3d5a80] text-[#3d5a80]'
                        : 'border-transparent text-[#333333] hover:text-[#3d5a80] hover:border-[#d0d7dc]'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-6 text-[#333333]">
              {activeTab === 'Description' && (
                <p className="whitespace-pre-line">{product.description}</p>
              )}
              {activeTab === 'Specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-[#333333] mb-3">Product Details</h4>
                    <dl className="space-y-3">
                      {[ 
                        { label: 'SKU', value: product.sku },
                        { label: 'Weight', value: product.weight },
                        { label: 'Dimensions', value: `${product.dimensions.width}x${product.dimensions.height}x${product.dimensions.depth}` }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b border-[#d0d7dc]">
                          <dt className="text-gray-500">{item.label}</dt>
                          <dd className="text-[#333333] font-medium">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#333333] mb-3">Additional Info</h4>
                    <dl className="space-y-3">
                      {[ 
                        { label: 'Minimum Order', value: product.minimumOrderQuantity },
                        { label: 'Return Policy', value: product.returnPolicy },
                        { label: 'Tags', value: product.tags.join(', ') }
                      ].map((item, idx) => (
                        <div key={idx} className={`flex justify-between py-2 ${idx < 2 ? 'border-b border-[#d0d7dc]' : ''}`}>
                          <dt className="text-gray-500">{item.label}</dt>
                          <dd className="text-[#333333] font-medium">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
              {activeTab === 'Shipping' && <p className="whitespace-pre-line">{product.shippingInformation}</p>}
              {activeTab === 'Reviews' && (
                <div className="space-y-5">
                  {product.reviews.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm">
                      <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                      <button className="mt-3 bg-[#3d5a80] hover:bg-[#2c3e50] text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm hover:shadow-md">
                        Write a Review
                      </button>
                    </div>
                  ) : (
                    product.reviews.map((review: Review, idx: number) => (
                      <div key={idx} className="border-b border-[#d0d7dc] pb-5 last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <div className="flex mr-2">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon key={i} filled={i < review.rating} className="text-sm" />
                                ))}
                              </div>
                              <span className="font-medium text-[#333333]">{review.reviewerName}</span>
                            </div>
                            <p className="mt-1 text-[#333333]">{review.comment}</p>
                          </div>
                          <span className="text-sm text-gray-400 whitespace-nowrap">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
