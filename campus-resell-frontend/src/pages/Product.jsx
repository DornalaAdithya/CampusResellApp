import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { sPanelClass } from "../styles/common";
import userAuthStore from "../stores/authStore";

function Product() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [startingChat, setStartingChat] = useState(false);

  const user = userAuthStore((state) => state.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${pid}`);
        setProduct(response.data.payload);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [pid, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center">
        <p className="text-xl font-semibold text-[#6e6e73]">Product not found.</p>
      </div>
    );
  }

  const images = product.productImages?.length
    ? product.productImages
    : ["https://placehold.co/600x600?text=No+Image"];

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-sm font-medium text-[#6e6e73] hover:text-[#111111] transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

          {/* Left Column: Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Main Image */}
            <div className={`${sPanelClass} aspect-square overflow-hidden bg-white flex items-center justify-center p-4`}>
              <img
                src={images[activeImage]}
                alt={product.title}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`
                      w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200
                      ${activeImage === index ? 'border-[#0066cc] shadow-md p-0.5 bg-white' : 'border-transparent hover:border-gray-300 opacity-70'}
                    `}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#111111] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {product.category}
                </span>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${product.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.status}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] font-['Sora'] leading-tight mb-4 tracking-tight">
                {product.title}
              </h1>

              <div className="flex items-end gap-4 mb-2">
                <span className="text-4xl font-bold text-[#111111] tracking-tight">
                  ₹{product.price}
                </span>
              </div>
              <p className="text-sm text-[#6e6e73]">
                Posted on {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <hr className="border-gray-200 my-6" />

            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#111111] font-['Sora'] mb-3">Description</h3>
              <p className="text-[#333336] leading-relaxed whitespace-pre-line text-[0.95rem]">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-10">
              <div className={`${sPanelClass} p-4 bg-[#f5f5f7] shadow-none border border-gray-100`}>
                <span className="block text-xs font-bold text-[#6e6e73] uppercase tracking-wider mb-1">Condition</span>
                <span className="font-semibold text-[#111111]">{product.condition?.replace('_', ' ')}</span>
              </div>
              <div className={`${sPanelClass} p-4 bg-[#f5f5f7] shadow-none border border-gray-100`}>
                <span className="block text-xs font-bold text-[#6e6e73] uppercase tracking-wider mb-1">Price Type</span>
                <span className="font-semibold text-[#111111]">
                  {product.isNegotiable ? "Negotiable" : "Fixed Price"}
                </span>
              </div>
            </div>

            {/* Seller Info */}
            {product.owner && (
              <div className={`${sPanelClass} p-4 mb-6 flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-100">
                  {product.owner.profileUrl ? (
                    <img src={product.owner.profileUrl} alt={product.owner.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-full h-full text-gray-400 p-2.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#6e6e73] uppercase tracking-wider mb-0.5">Seller</p>
                  <h4 className="font-bold text-[#111111] leading-tight">
                    {product.owner.firstName} {product.owner.lastName}
                  </h4>
                </div>
              </div>
            )}

            {/* Action Buttons Pushed to Bottom */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6">
              {product.owner._id === user?._id ? (
                <button
                  disabled
                  className="flex-1 bg-gray-200 text-gray-500 py-4 px-6 rounded-2xl font-bold text-lg cursor-not-allowed shadow-none border border-gray-300"
                >
                  Your Listing
                </button>
              ) : (
                <button
                  onClick={async () => {
                    if (!user) {
                      toast.error("Please login to contact the seller");
                      navigate("/login", { state: { from: location.pathname } });
                      return;
                    }
                    try {
                      setStartingChat(true);
                      const res = await api.post("/api/chat/conversation", { productId: product._id });
                      if (res.data.success) {
                        navigate(`/chat/${res.data.conversation._id}`);
                      }
                    } catch (error) {
                      toast.error(error.response?.data?.message || "Failed to start conversation");
                      setStartingChat(false);
                    }
                  }}
                  disabled={startingChat}
                  className="flex-1 bg-[#0066cc] text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-[#005bb5] transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50"
                >
                  {startingChat ? "Starting chat..." : "Contact Seller"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;