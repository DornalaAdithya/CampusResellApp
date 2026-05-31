import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useChatStore from "../stores/chatStore";
import userAuthStore from "../stores/authStore";
import { getSocket } from "../lib/socket";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const ChatRoom = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const scrollContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const {
    messages,
    currentConversation,
    fetchMessages,
    sendMessage,
    loading,
    clearCurrentConversation,
    isTyping
  } = useChatStore();

  const user = userAuthStore((state) => state.user);

  useEffect(() => {
    fetchMessages(conversationId);
    return () => clearCurrentConversation();
  }, [conversationId, fetchMessages, clearCurrentConversation]);

  // Auto-scroll inside the container, preventing full page shift
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const messageText = text;
    setText(""); // Optimistic UI clear
    
    // Clear typing indicator when sent
    const socket = getSocket();
    const otherParticipant = currentConversation?.participants.find(p => p._id !== user?._id);
    if (otherParticipant) {
      socket.emit("stopTyping", { receiverId: otherParticipant._id });
    }
    
    await sendMessage(conversationId, messageText);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    
    const otherParticipant = currentConversation?.participants.find(p => p._id !== user?._id);
    if (!otherParticipant) return;
    
    const socket = getSocket();
    socket.emit("typing", { receiverId: otherParticipant._id });
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: otherParticipant._id });
    }, 2000);
  };

  if (loading && messages.length === 0) return <Loader />;

  if (!currentConversation) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center">
        <p className="text-gray-500">Chat not found.</p>
      </div>
    );
  }

  const otherParticipant = currentConversation.participants.find(
    (p) => p._id !== user?._id
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#fcfcfd]">
      {/* Chat Header */}
      <div className="bg-white px-6 py-4 shadow-sm z-10 flex items-center border-b border-gray-100">
        <button
          onClick={() => navigate("/chats")}
          className="mr-4 flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="relative mr-4 flex-shrink-0">
          <img
            src={otherParticipant?.profileUrl || "https://placehold.co/40x40?text=U"}
            alt={otherParticipant?.firstName}
            className="w-11 h-11 rounded-full object-cover border border-gray-200"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-[#111111] font-['Sora'] truncate tracking-tight">
            {otherParticipant?.firstName} {otherParticipant?.lastName}
          </h2>
          <p className="text-sm text-[#6e6e73] truncate flex items-center gap-1">
            <span>Product:</span>
            <span className="font-semibold text-gray-900">{currentConversation.product.title}</span>
          </p>
        </div>
        <div className="flex-shrink-0 ml-4 hidden sm:block">
           <img
             src={currentConversation.product.productImages[0] || "https://placehold.co/60x60?text=No+Image"}
             alt={currentConversation.product.title}
             className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow-sm"
           />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
            <svg className="w-12 h-12 text-[#0066cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-[#111111] font-medium">Say hello to {otherParticipant?.firstName}!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender === user?._id;
            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] px-5 py-3 shadow-sm relative text-[15px] ${
                    isMine
                      ? "bg-[#0066cc] text-white rounded-[24px] rounded-tr-[6px]"
                      : "bg-white border border-gray-100 text-[#111111] rounded-[24px] rounded-tl-[6px]"
                  }`}
                >
                  <p className="leading-relaxed break-words">{msg.text}</p>
                </div>
                <span className="text-[11px] font-medium text-[#6e6e73] mt-1.5 mx-2 select-none">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex flex-col items-start animate-fade-in">
            <div className="bg-white border border-gray-100 px-5 py-4 shadow-sm relative rounded-[24px] rounded-tl-[6px] flex space-x-1.5 w-fit">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-[11px] font-medium text-[#6e6e73] mt-1.5 mx-2 select-none">
              {otherParticipant?.firstName} is typing...
            </span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-3 sm:p-4 pb-6 sm:pb-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-3">
          <div className="flex-1 bg-[#f5f5f7] rounded-[24px] border border-gray-200 focus-within:border-[#0066cc] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#0066cc]/20 transition-all flex items-end overflow-hidden px-5">
            <textarea
              value={text}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type your message..."
              className="flex-1 bg-transparent py-3.5 outline-none resize-none min-h-[48px] max-h-[120px] text-[15px] text-[#111111] placeholder-gray-400"
              rows={1}
              style={{ height: "auto" }}
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className={`w-[48px] h-[48px] flex items-center justify-center rounded-full flex-shrink-0 transition-all active:scale-95 ${
              text.trim()
                ? "bg-[#0066cc] text-white shadow-md shadow-blue-500/20 hover:bg-[#005bb5]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
