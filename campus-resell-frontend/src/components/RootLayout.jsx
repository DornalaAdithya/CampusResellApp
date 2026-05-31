import React, { useEffect } from "react";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";

function RootLayout() {
  const location = useLocation();
  const isChatRoom = location.pathname.startsWith("/chat/");

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfd] font-sans">
      <Header />
      <main className="flex-1 w-full flex flex-col relative">
        <Outlet />
      </main>
      {!isChatRoom && <Footer />}
    </div>
  );
}

export default RootLayout;
