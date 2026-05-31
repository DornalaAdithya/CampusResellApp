import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useChatStore from "../stores/chatStore";
import Loader from "../components/Loader";
import userAuthStore from "../stores/authStore";

const Chats = () => {
  const { conversations, fetchConversations, loading } = useChatStore();
  const user = userAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("buying"); // 'buying' or 'selling'

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (loading && conversations.length === 0) return <Loader />;

  // Filter conversations
  const buyingChats = conversations.filter(conv => conv.product?.owner !== user?._id);
  const sellingChats = conversations.filter(conv => conv.product?.owner === user?._id);
  
  const activeConversations = activeTab === "buying" ? buyingChats : sellingChats;

  return (
    <div className="min-h-screen bg-[#fcfcfd] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-[#111111] mb-6 font-['Sora'] tracking-tight">Your Chats</h1>

        {/* Custom Tabs */}
        <div className="flex bg-[#f5f5f7] p-1 rounded-2xl mb-6 shadow-sm border border-[#ececf0] w-full max-w-sm">
          <button
            onClick={() => setActiveTab("buying")}
            className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
              activeTab === "buying" 
                ? "bg-white text-[#111111] shadow-[0_2px_10px_rgba(0,0,0,0.06)]" 
                : "text-[#6e6e73] hover:text-[#111111]"
            }`}
          >
            Buying ({buyingChats.length})
          </button>
          <button
            onClick={() => setActiveTab("selling")}
            className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
              activeTab === "selling" 
                ? "bg-white text-[#111111] shadow-[0_2px_10px_rgba(0,0,0,0.06)]" 
                : "text-[#6e6e73] hover:text-[#111111]"
            }`}
          >
            Selling ({sellingChats.length})
          </button>
        </div>

        {activeConversations.length === 0 ? (
          <div className="bg-white p-10 rounded-[28px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#ececf0] text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-[#a1a1a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            
            {activeTab === "buying" ? (
              <>
                <h3 className="text-2xl font-bold text-[#111111] font-['Sora'] mb-2 tracking-tight">No buying chats</h3>
                <p className="text-[#6e6e73] mb-8 max-w-sm">You haven't contacted any sellers yet. Find something you like and start a conversation!</p>
                <Link
                  to="/products"
                  className="px-8 py-3.5 bg-[#0066cc] text-white font-semibold rounded-full hover:bg-[#005bb5] transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
                >
                  Browse Products
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-[#111111] font-['Sora'] mb-2 tracking-tight">No selling chats</h3>
                <p className="text-[#6e6e73] mb-8 max-w-sm">No one has messaged you about your listings yet. Make sure your items are priced to sell!</p>
                <Link
                  to="/profile"
                  className="px-8 py-3.5 bg-[#111111] text-white font-semibold rounded-full hover:bg-black transition-all shadow-md shadow-black/20 active:scale-[0.98]"
                >
                  View My Listings
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activeConversations.map((conv) => {
              const otherParticipant = conv.participants.find(
                (p) => p._id !== user?._id
              );
              const productImage = conv.product.productImages[0] || "https://placehold.co/100x100?text=No+Image";

              return (
                <Link
                  key={conv._id}
                  to={`/chat/${conv._id}`}
                  className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#ececf0] flex items-center p-5 sm:p-6 hover:shadow-md hover:border-[#d2d2d7] transition-all duration-300 group"
                >
                  <div className="relative flex-shrink-0 mr-5">
                    <img
                      src={productImage}
                      alt={conv.product.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-[18px] object-cover border border-[#ececf0] shadow-sm group-hover:shadow transition-shadow"
                    />
                    <img
                      src={otherParticipant?.profileUrl || "https://placehold.co/40x40?text=U"}
                      alt={otherParticipant?.firstName}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-[3px] border-white absolute -bottom-2 -right-2 bg-gray-200 shadow-sm"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[1.05rem] font-bold text-[#111111] truncate pr-4">
                        {otherParticipant?.firstName} {otherParticipant?.lastName}
                      </h3>
                      {conv.lastMessageAt && (
                        <span className="text-xs font-medium text-[#a1a1a6] whitespace-nowrap">
                          {new Date(conv.lastMessageAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="inline-block text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider bg-[#f5f5f7] px-2.5 py-1 rounded-md w-fit truncate max-w-[150px]">
                        {conv.product.title}
                      </span>
                      <p className="text-[14px] text-[#6e6e73] truncate pr-4 mt-1 sm:mt-0">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
