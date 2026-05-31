import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-[#ececf0] bg-white mt-8 mx-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Logo + About */}
          <div>
            <h1 className="text-2xl font-bold font-['Sora'] text-[#111111] tracking-tight">CampusResell</h1>

            <p className="text-[#6e6e73] mt-3 text-sm leading-relaxed max-w-sm">
              Buy and sell products within your campus community safely and easily.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold text-[0.95rem] text-[#111111] mb-4 tracking-tight">Contact</h2>

            <div className="text-[#6e6e73] text-sm space-y-2.5">
              <p>Anurag University</p>
              <p className="hover:text-[#111111] cursor-pointer transition-colors">support@campusresell.com</p>
              <p>Hyderabad, India</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#ececf0] mt-10 pt-6 text-center text-xs font-medium text-[#a1a1a6]">
          © {new Date().getFullYear()} CampusResell. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
