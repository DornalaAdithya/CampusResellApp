import React from "react";
import { Link } from "react-router-dom";
import { sPanelClass } from "../styles/common";

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className={`${sPanelClass} group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col`}
    >
      <div className="aspect-square overflow-hidden bg-[#f5f5f7] relative">
        <img
          src={product.productImages?.[0] || "https://placehold.co/600x400?text=No+Image"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[0.6rem] font-bold text-[#111111] tracking-wider shadow-sm uppercase">
          {product.category}
        </div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-[0.95rem] sm:text-base font-semibold text-[#111111] mb-1.5 line-clamp-2 leading-snug">
          {product.title}
        </h3>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold text-[#111111]">
            ₹{product.price}
          </span>
          <button className="text-[0.7rem] sm:text-xs font-medium text-[#0066cc] bg-[#0066cc]/10 px-2.5 py-1 rounded-full hover:bg-[#0066cc] hover:text-white transition-colors">
            View
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
