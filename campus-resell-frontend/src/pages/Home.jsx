import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../components/Search";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";
import { sPanelClass } from "../styles/common";

import books from "../assets/books.svg";
import laptop from "../assets/laptop.svg";
import cycle from "../assets/cycle.svg";
import sofa from "../assets/sofa.svg";
import coat from "../assets/coat.svg";

function Home() {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "BOOKS", link: books },
    { name: "ELECTRONICS", link: laptop },
    { name: "CYCLES", link: cycle },
    { name: "FURNITURE", link: sofa },
    { name: "FASHION", link: coat },
  ];

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await api.get("/products");
        // Get the 4 most recent products
        const products = response.data.payload || [];
        setRecentProducts(products.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch recent products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-[#f4f4f6] to-[#fcfcfd] pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#ececf0]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Sora'] font-extrabold text-[#111111] tracking-[-0.04em] leading-tight mb-4 sm:mb-6">
            Your Campus Marketplace,<br className="hidden md:block" /> Reimagined.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#6e6e73] mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Buy, sell, and trade safely within your university community. Discover great deals on textbooks, electronics, and dorm essentials.
          </p>
          
          <div className="mb-10">
            <Search />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/sell" 
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0066cc] text-white rounded-full font-semibold text-[15px] hover:bg-[#005bb5] transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98]"
            >
              Start Selling
            </Link>
            <Link 
              to="/products" 
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#111111] border border-[#d2d2d7] rounded-full font-semibold text-[15px] hover:bg-[#f5f5f7] transition-all active:scale-[0.98]"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] font-['Sora'] tracking-tight">
              Explore Categories
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => navigate('/products', { state: { category: category.name } })}
                className="group bg-white p-6 rounded-[24px] border border-[#ececf0] flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#d2d2d7] transition-all duration-300 active:scale-[0.98]"
              >
                <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#0066cc]/10 transition-colors duration-300">
                  <img
                    src={category.link}
                    alt={category.name}
                    className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  />
                </div>
                <span className="text-[13px] font-bold text-[#111111] tracking-wide">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Products Section */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#111111] font-['Sora'] tracking-tight mb-2">
                Fresh on Campus
              </h2>
              <p className="text-[#6e6e73] text-sm md:text-base">The latest items listed by your peers.</p>
            </div>
            <Link 
              to="/products"
              className="hidden sm:flex items-center gap-1 text-[#0066cc] font-semibold hover:text-[#004499] transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white rounded-[24px] aspect-[3/4] animate-pulse border border-[#ececf0]"></div>
              ))}
            </div>
          ) : recentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className={`${sPanelClass} p-12 text-center`}>
              <p className="text-[#6e6e73] font-medium">No products listed yet.</p>
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link 
              to="/products"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#f5f5f7] text-[#111111] rounded-xl font-semibold hover:bg-[#ececf0] transition-colors"
            >
              View All Products
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
