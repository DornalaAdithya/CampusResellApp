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
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSummary, setReportSummary] = useState(null);

  const user = userAuthStore((state) => state.user);

  const handleReportSubmit = async () => {
    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }

    if (!reportMessage.trim()) {
      toast.error("Please describe the issue");
      return;
    }

    try {
      setSubmittingReport(true);

      await api.post(`/product-reports/${pid}`, {
        reason: reportReason,
        message: reportMessage.trim(),
      });

      toast.success("Product reported successfully");

      setShowReportModal(false);
      setReportReason("");
      setReportMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to report product");
    } finally {
      setSubmittingReport(false);
    }
  };

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

  useEffect(() => {
    const fetchReportSummary = async () => {
      try {
        const response = await api.get(`/product-reports/${pid}`);

        //console.log("REPORT SUMMARY:", response.data);

        setReportSummary(response.data);
      } catch (error) {
        console.error("Error fetching report summary:", error);
      }
    };

    fetchReportSummary();
  }, [pid]);

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

  const images = product.productImages?.length ? product.productImages : ["https://placehold.co/600x600?text=No+Image"];

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
              <img src={images[activeImage]} alt={product.title} className="w-full h-full object-contain rounded-lg" />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`
                      w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200
                      ${activeImage === index ? "border-[#0066cc] shadow-md p-0.5 bg-white" : "border-transparent hover:border-gray-300 opacity-70"}
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
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${product.status === "AVAILABLE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {product.status}
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] font-['Sora'] leading-tight tracking-tight">
                  {product.title}
                </h1>

                {reportSummary?.totalReports > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-sm font-bold px-3 py-1.5 rounded-full">
                    ⚠ {reportSummary.totalReports} {reportSummary.totalReports === 1 ? "Report" : "Reports"}
                  </span>
                )}
              </div>

              <div className="flex items-end gap-4 mb-2">
                <span className="text-4xl font-bold text-[#111111] tracking-tight">₹{product.price}</span>
              </div>
              <p className="text-sm text-[#6e6e73]">
                Posted on {new Date(product.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>

            <hr className="border-gray-200 my-6" />

            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#111111] font-['Sora'] mb-3">Description</h3>
              <p className="text-[#333336] leading-relaxed whitespace-pre-line text-[0.95rem]">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-10">
              <div className={`${sPanelClass} p-4 bg-[#f5f5f7] shadow-none border border-gray-100`}>
                <span className="block text-xs font-bold text-[#6e6e73] uppercase tracking-wider mb-1">Condition</span>
                <span className="font-semibold text-[#111111]">{product.condition?.replace("_", " ")}</span>
              </div>
              <div className={`${sPanelClass} p-4 bg-[#f5f5f7] shadow-none border border-gray-100`}>
                <span className="block text-xs font-bold text-[#6e6e73] uppercase tracking-wider mb-1">Price Type</span>
                <span className="font-semibold text-[#111111]">{product.isNegotiable ? "Negotiable" : "Fixed Price"}</span>
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
                <>
                  <button
                    onClick={async () => {
                      if (!user) {
                        toast.error("Please login to contact the seller");
                        navigate("/login", { state: { from: location.pathname } });
                        return;
                      }

                      try {
                        setStartingChat(true);
                        const res = await api.post("/api/chat/conversation", {
                          productId: product._id,
                        });

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

                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error("Please login to report a product");
                        navigate("/login", { state: { from: location.pathname } });
                        return;
                      }

                      setShowReportModal(true);
                    }}
                    className="flex-1 border border-red-300 text-red-600 py-4 px-6 rounded-2xl font-bold text-lg hover:bg-red-50 transition-all"
                  >
                    Report Product
                  </button>
                </>
              )}
            </div>
            {/* Community Reports */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-[#111111] font-['Sora'] mb-3">Community Reports</h3>

              <p className="text-sm text-gray-500 mb-3">Total reports: {reportSummary?.totalReports ?? "Loading..."}</p>

              <div className="space-y-3">
                {(reportSummary?.reports || []).map((report, index) => (
                  <div key={index} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-amber-800 mb-1">⚠ Report {index + 1}</p>

                    <p className="text-sm text-gray-700">{report.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* REPORT PRODUCT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#111111]">Report Product</h2>

              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                  setReportMessage("");
                }}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#111111] mb-2">Reason</label>

              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#0066cc]"
              >
                <option value="">Select a reason</option>
                <option value="FAKE_PRODUCT">Fake / Counterfeit Product</option>
                <option value="WRONG_DESCRIPTION">Wrong / Misleading Description</option>
                <option value="DAMAGED_PRODUCT">Damaged / Different from Description</option>
                <option value="PROHIBITED_ITEM">Prohibited Item</option>
                <option value="SPAM">Spam</option>
                <option value="DUPLICATE_LISTING">Duplicate Listing</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#111111] mb-2">Additional Details</label>

              <textarea
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                placeholder="Describe the issue with this product..."
                rows={5}
                maxLength={500}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none resize-none focus:border-[#0066cc]"
              />

              <p className="mt-1 text-xs text-gray-500 text-right">{reportMessage.length}/500</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                  setReportMessage("");
                }}
                disabled={submittingReport}
                className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleReportSubmit}
                disabled={submittingReport}
                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {submittingReport ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
