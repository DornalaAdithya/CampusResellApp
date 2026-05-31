import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfd] px-4">
      <h1 className='text-7xl font-bold text-[#111111] font-["Sora"]'>404</h1>

      <p className="text-[#6e6e73] mt-3 text-sm sm:text-base">The page you’re looking for doesn’t exist.</p>

      <Link to="/" className="mt-6 px-5 py-2.5 rounded-full bg-[#111111] text-white text-sm font-medium hover:bg-black transition">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
