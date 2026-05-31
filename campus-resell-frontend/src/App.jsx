import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Loader from "./components/Loader";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";
import Sell from "./pages/Sell";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import userAuthStore from "./stores/authStore";
import useChatStore from "./stores/chatStore";
import Products from "./pages/Products";
import Chats from "./pages/Chats";
import ChatRoom from "./pages/ChatRoom";

const routerObj = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:pid",
        element: <Product />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      //protected routes
      {
        path: "sell",
        element: (
          <ProtectedRoute>
            <Sell />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "chats",
        element: (
          <ProtectedRoute>
            <Chats />
          </ProtectedRoute>
        ),
      },
      {
        path: "chat/:conversationId",
        element: (
          <ProtectedRoute>
            <ChatRoom />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  const loading = userAuthStore((state) => state.loading);

  const getProfile = userAuthStore((state) => state.getProfile);

  const isAuthenticated = userAuthStore((state) => state.isAuthenticated);
  
  const { setupSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    getProfile();
  }, []);

  // Socket Lifecycle
  useEffect(() => {
    if (isAuthenticated) {
      setupSocket();
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, setupSocket, disconnectSocket]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;
