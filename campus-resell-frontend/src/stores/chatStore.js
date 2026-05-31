import { create } from "zustand";
import api from "../api/axios";
import { initSocket, disconnectSocket, getSocket } from "../lib/socket";
import userAuthStore from "./authStore";

const useChatStore = create((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  isTyping: false,

  // Socket setup
  setupSocket: () => {
    const user = userAuthStore.getState().user;
    if (!user) return;

    const socket = initSocket(user._id);

    // Remove any existing listener to prevent duplicates if called multiple times
    socket.off("newMessage");
    socket.off("typing");
    socket.off("stopTyping");

    socket.on("typing", () => set({ isTyping: true }));
    socket.on("stopTyping", () => set({ isTyping: false }));

    socket.on("newMessage", (message) => {
      const { currentConversation, messages } = get();

      // Update the active chat room if we are in it
      if (currentConversation && message.conversation === currentConversation._id) {
        // Prevent duplicate messages by ID
        const isDuplicate = messages.some((msg) => msg._id === message._id);
        if (!isDuplicate) {
          set({ messages: [...messages, message] });
        }
      }

      // Also update the conversations list with new last message
      set((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv._id === message.conversation) {
            return {
              ...conv,
              lastMessage: message.text,
              lastMessageAt: new Date().toISOString(),
            };
          }
          return conv;
        }),
      }));
    });
  },

  disconnectSocket: () => {
    disconnectSocket();
  },

  // Fetch all conversations
  fetchConversations: async () => {
    try {
      set({ loading: true });
      const response = await api.get("/api/chat/conversations");
      set({ conversations: response.data.conversations });
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      set({ loading: false });
    }
  },

  // Fetch single conversation messages
  fetchMessages: async (conversationId) => {
    try {
      set({ loading: true });
      const response = await api.get(`/api/chat/${conversationId}/messages`);
      
      set({ 
        messages: response.data.messages,
        currentConversation: response.data.conversation
      });
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      set({ loading: false });
    }
  },

  // Send a message
  sendMessage: async (conversationId, text) => {
    try {
      const response = await api.post("/api/chat/message", { conversationId, text });
      const newMessage = response.data.message;

      const { messages } = get();
      // Optimistic or real addition
      set({ messages: [...messages, newMessage] });

      // Update last message in conversations list
      set((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv._id === conversationId) {
            return {
              ...conv,
              lastMessage: text,
              lastMessageAt: new Date().toISOString(),
            };
          }
          return conv;
        }),
      }));

    } catch (error) {
      console.error("Failed to send message", error);
    }
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },

  clearCurrentConversation: () => {
    set({ currentConversation: null, messages: [], isTyping: false });
  }
}));

export default useChatStore;
