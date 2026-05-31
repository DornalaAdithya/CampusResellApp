import React from "react";

function Loader({
  fullScreen = true,
  text = "Loading...",
  size = 40,
}) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? "min-h-screen bg-[#fcfcfd]" : "py-10"
        }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-black/5 blur-md"></div>

          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              animation: "spin 1s linear infinite",
            }}
          >
            {/* Background ring */}
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#e5e7eb"
              strokeWidth="3.5"
            />

            {/* Moving arc */}
            <path
              d="M22 12a10 10 0 0 0-10-10"
              stroke="#111111"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p className="text-sm text-[#6e6e73] font-medium tracking-wide">
          {text}
        </p>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Loader;