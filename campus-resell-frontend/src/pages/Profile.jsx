import React, { useState, useEffect, useRef } from "react";
import userAuthStore from "../stores/authStore";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function Profile() {
  const { user, updateUser, logout } = userAuthStore();
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changingPassword, setChangingPassword] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await api.get("/products/me");
        setMyProducts(response.data.payload || []);
      } catch (error) {
        toast.error("Failed to load your products");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Only JPG and PNG allowed");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be less than 4MB");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setUploadingImage(true);
      const res = await api.put("/auth/profile-photo", formData);
      updateUser(res.data.payload);
      toast.success("Profile photo updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile photo");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setChangingPassword(true);
      await api.put("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleStatusToggle = async (productId, newStatus) => {
    try {
      await api.put(`/products/${productId}/status`, { status: newStatus });
      setMyProducts(myProducts.map(p => p._id === productId ? { ...p, status: newStatus } : p));
      toast.success(`Product marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-12 pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Floating Profile & Settings */}
          <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-6">

            {/* Profile Card */}
            <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#ececf0] text-center relative">
              <div className="relative mx-auto w-36 h-36 mb-6 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-full h-full rounded-[2rem] overflow-hidden border-[6px] border-white shadow-xl bg-white rotate-3 group-hover:rotate-0 transition-all duration-300 relative z-10">
                  {uploadingImage ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <div className="w-8 h-8 border-4 border-[#0066cc] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <img
                      src={user.profileUrl || "https://placehold.co/150x150?text=U"}
                      alt={user.firstName}
                      className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                    />
                  )}
                </div>

                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-[#0066cc]/90 rounded-[2rem] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 scale-95 group-hover:scale-100 border-[6px] border-white rotate-3 group-hover:rotate-0">
                  <svg className="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg"
                  className="hidden"
                />
              </div>

              <h1 className="text-3xl font-extrabold text-[#111111] font-['Sora'] tracking-tight mb-1">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-[#6e6e73] font-medium bg-gray-100/50 inline-block px-4 py-1.5 rounded-full mb-8">
                {user.email}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-[20px] border border-blue-100/50">
                  <span className="block text-3xl font-bold text-[#0066cc] mb-1">{myProducts.length}</span>
                  <span className="text-xs font-semibold text-blue-700/70 uppercase tracking-wider">Listings</span>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-[20px] border border-gray-100">
                  <span className="block text-3xl font-bold text-[#111111] mb-1">
                    {myProducts.filter(p => p.status === 'AVAILABLE').length}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active</span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
                className="w-full py-4 bg-white/50 text-[#ff3b30] font-bold rounded-2xl hover:bg-[#ff3b30] hover:text-white border border-[#ff3b30]/20 transition-all shadow-sm active:scale-[0.98]"
              >
                Sign Out
              </button>
            </div>

            {/* Premium Security Card */}
            <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#ececf0]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#111111] font-['Sora'] tracking-tight">Security</h3>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="group relative">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                    autoComplete="current-password"
                    className="w-full bg-[#f8f8f9] border-2 border-transparent focus:bg-white focus:border-[#0066cc] rounded-2xl px-5 py-4 outline-none transition-all text-[15px] font-medium placeholder-gray-400"
                  />
                </div>
                <div className="group relative">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    autoComplete="new-password"
                    className="w-full bg-[#f8f8f9] border-2 border-transparent focus:bg-white focus:border-[#0066cc] rounded-2xl px-5 py-4 outline-none transition-all text-[15px] font-medium placeholder-gray-400"
                  />
                </div>
                <div className="group relative">
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    autoComplete="new-password"
                    className="w-full bg-[#f8f8f9] border-2 border-transparent focus:bg-white focus:border-[#0066cc] rounded-2xl px-5 py-4 outline-none transition-all text-[15px] font-medium placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full py-4 mt-2 bg-[#111111] text-white font-bold rounded-2xl hover:bg-[#222222] transition-all shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] active:scale-[0.98] disabled:opacity-50"
                >
                  {changingPassword ? "Updating Securely..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Listings */}
          <div className="flex-1 mt-6 lg:mt-24">
            <div className="bg-white p-6 sm:p-10 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#ececf0] min-h-[700px]">

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
                <div>
                  <h2 className="text-3xl font-extrabold text-[#111111] font-['Sora'] tracking-tight mb-2">
                    My Marketplace
                  </h2>
                  <p className="text-[#6e6e73] text-[15px]">Manage and view all the items you are selling.</p>
                </div>
                <a href="/sell" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0066cc] text-white font-bold rounded-full hover:bg-[#005bb5] transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98] flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                  New Listing
                </a>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="animate-pulse">
                      <div className="bg-gray-100 rounded-3xl h-64 mb-4"></div>
                      <div className="h-6 bg-gray-100 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : myProducts.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                  <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🏷️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#111111] mb-3 font-['Sora']">Your storefront is empty</h3>
                  <p className="text-[#6e6e73] mb-8 max-w-md text-lg">You haven't listed any items for sale yet. Declutter your space and make some extra cash today!</p>
                  <a href="/sell" className="px-8 py-4 bg-[#111111] text-white font-bold rounded-full hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-[0.98]">
                    Create Your First Listing
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                  {myProducts.map((product) => (
                    <div key={product._id} className="relative flex flex-col group">

                      {/* Floating Action Button */}
                      <div className="absolute top-3 right-3 z-20">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleStatusToggle(product._id, product.status === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE');
                          }}
                          className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold shadow-md transition-all backdrop-blur-md border ${product.status === 'AVAILABLE'
                            ? 'bg-white/95 text-red-600 border-red-100 hover:bg-red-50 hover:scale-105 active:scale-95'
                            : 'bg-[#111111]/95 text-white border-gray-800 hover:bg-black hover:scale-105 active:scale-95'
                            }`}
                        >
                          {product.status === 'AVAILABLE' ? 'Mark Sold' : 'Relist Item'}
                        </button>
                      </div>

                      <div className={`transition-all duration-500 h-full ${product.status === 'SOLD' ? 'opacity-50 grayscale-[40%]' : ''}`}>
                        <ProductCard product={product} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;