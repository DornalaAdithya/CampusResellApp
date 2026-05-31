import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import { Link, useLocation } from "react-router-dom";
import { homePageTitle, sPanelClass } from "../styles/common";
import ProductCard from "../components/ProductCard";
import books from "../assets/books.svg";
import laptop from "../assets/laptop.svg";
import cycle from "../assets/cycle.svg";
import sofa from "../assets/sofa.svg";
import coat from "../assets/coat.svg";
import api from "../api/axios";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function Products() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || "ALL");
  const [searchQuery, setSearchQuery] = useState(location.state?.search || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "ALL", link: null },
    { name: "BOOKS", link: books },
    { name: "ELECTRONICS", link: laptop },
    { name: "CYCLES", link: cycle },
    { name: "FURNITURE", link: sofa },
    { name: "FASHION", link: coat },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data.payload);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-16">
      <div className="pt-8 pb-10">
        <h1 className={homePageTitle}>Explore Products</h1>
        <div className="mt-6">
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </div>

      <div className="w-full max-w-[1600px] min-h-[150vh] mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row gap-8">
        {/* Categories Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 md:sticky md:top-24 md:self-start">
          <div className={`${sPanelClass} p-5`}>
            <h2 className="text-lg font-bold text-[#111111] font-['sora'] mb-4 tracking-tight">
              Categories
            </h2>
            <div className="flex flex-row flex-wrap md:flex-col gap-2 sm:gap-3 pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`
                    flex items-center gap-2 px-4 py-2 md:py-2.5 rounded-xl transition-all duration-200 group
                    ${selectedCategory === category.name
                      ? "bg-[#111111] text-white shadow-md font-medium"
                      : "bg-[#f5f5f7] md:bg-transparent text-[#6e6e73] hover:bg-[#ececf0] md:hover:bg-[#f5f5f7] hover:text-[#111111] font-medium border border-[#ececf0] md:border-transparent"
                    }
                  `}
                >
                  {category.link && (
                    <img
                      src={category.link}
                      alt={category.name}
                      className={`w-4 h-4 md:w-5 md:h-5 object-contain transition-all ${selectedCategory === category.name ? 'invert brightness-0' : 'opacity-70 group-hover:opacity-100'}`}
                    />
                  )}
                  <span className="text-[0.85rem] md:text-[0.95rem] tracking-wide">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#111111] font-['sora'] tracking-tight">
              {selectedCategory === "ALL" ? "All Products" : `${selectedCategory} Products`}
            </h2>
            <span className="text-sm font-medium text-[#6e6e73] bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              {filteredProducts.length} Results
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className={`${sPanelClass} p-12 text-center flex flex-col items-center justify-center`}>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
              <p className="text-gray-500">We couldn't find any items in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;