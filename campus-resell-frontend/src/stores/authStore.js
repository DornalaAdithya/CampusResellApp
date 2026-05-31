import { create } from "zustand";
import api from "../api/axios";

const userAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  authChecked: false,

  //update user locally
  updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),

  //login
  login: async (data) => {
    try {
      set({ loading: true });
      const res = await api.post("/auth/login", data);
      set({
        user: res.data.payload,
        isAuthenticated: true,
        authChecked: true,
      });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        authChecked: true,
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  //register
  register: async (data) => {
    try {
      set({ loading: true });

      const res = await api.post("/auth/register", data);

      return res.data;
    } catch (err) {
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  //get profile
  getProfile: async () => {
    try {
      set({ loading: true });

      const res = await api.get("/auth/profile");

      set({
        user: res.data.payload,
        isAuthenticated: true,
      });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
      });

      // DO NOT throw error here
      // because unauthenticated user is normal
    } finally {
      set({
        loading: false,
        authChecked: true,
      });
    }
  },

  //logout
  logout: async () => {
    try {
      set({ loading: true });
      const res = await api.post("/auth/logout", {});
      set({
        user: null,
        isAuthenticated: false,
        authChecked: true,
      });
    } catch (err) {
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

export default userAuthStore;
