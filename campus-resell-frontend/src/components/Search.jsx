import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Search({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState("");

  const query = searchQuery !== undefined ? searchQuery : localQuery;
  const setQuery = setSearchQuery !== undefined ? setSearchQuery : setLocalQuery;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && setSearchQuery === undefined) {
      if (query.trim()) {
        navigate("/products", { state: { search: query } });
      } else {
        navigate("/products");
      }
    }
  };

  return (
    <div className="flex justify-center w-full px-4">
      <div className="relative w-full max-w-3xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="
            w-full
            rounded-2xl
            border
            border-gray-200
            bg-white
            px-6
            py-4
            text-base
            text-gray-900
            shadow-sm
            outline-none
            transition-all
            duration-200
            placeholder:text-gray-400
            focus:border-gray-300
            focus:shadow-md
          "
        />

        {/* Search Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="
            absolute
            right-5
            top-1/2
            -translate-y-1/2
            h-5
            w-5
            text-gray-400
          "
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}

export default Search;
