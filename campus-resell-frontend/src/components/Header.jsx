import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  navbarClass,
  navBrandClass,
  navContainerClass,
  navLinkActiveClass,
  navLinkClass,
  navLinkImg,
  navLinksClass,
} from "../styles/common";
import logo from "../assets/logo.svg";
import btn from "../assets/logout.svg";
import home from "../assets/home.svg";
import login from "../assets/login.svg";
import register from "../assets/register.svg";
import sell from "../assets/sell.svg";
import profile from "../assets/profile.svg";
import productsIcon from "../assets/products.svg";
import chatIcon from "../assets/chat.svg";
import userAuthStore from "../stores/authStore";

function Header() {
  const isAuthenticated = userAuthStore((state) => state.isAuthenticated);
  const logout = userAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Common Nav Links array for DRY
  const publicLinks = [
    { to: "/", icon: home, label: "Home" },
    { to: "login", icon: login, label: "Login" },
    { to: "register", icon: register, label: "Register" },
  ];

  const authLinks = [
    { to: "/", icon: home, label: "Home" },
    { to: "/products", icon: productsIcon, label: "Products" },
    { to: "sell", icon: sell, label: "Sell" },
    { to: "/chats", icon: chatIcon, label: "Chats" },
    { to: "profile", icon: profile, label: "Profile" },
  ];

  const linksToRender = isAuthenticated ? authLinks : publicLinks;

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        <NavLink to="/" className={navBrandClass} onClick={closeMobileMenu}>
          <img
            src={logo}
            alt="CampXConnect"
            className="h-15 w-auto mt-1"
          />
        </NavLink>

        {/* Desktop Navigation */}
        <ul className={`${navLinksClass} hidden md:flex`}>
          {linksToRender.map((link) => (
            <li key={link.to} className="flex">
              <img src={link.icon} alt="" className={navLinkImg} />
              <NavLink 
                to={link.to} 
                className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Logout */}
        <div className="hidden md:block">
          {isAuthenticated && (
            <button className="hover:cursor-pointer mt-1" onClick={handleLogout}>
              <img src={btn} alt="logout" className="w-8 h-8 object-cover bg-white" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:flex hidden md:hidden items-center absolute right-4">
          <button onClick={toggleMobileMenu} className="text-[#111111] hover:text-[#0066cc] focus:outline-none p-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Fix Mobile Display -> Force flex when md:hidden */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-[#111111] hover:text-[#0066cc] focus:outline-none p-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#ececf0] shadow-lg absolute w-full left-0 top-[100%] z-50">
          <ul className="flex flex-col px-6 pt-4 pb-6 gap-3">
            {linksToRender.map((link) => (
              <li key={link.to} className="flex items-center border-b border-gray-100 pb-3">
                <img src={link.icon} alt="" className={navLinkImg} />
                <NavLink 
                  to={link.to} 
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `flex-1 ml-3 text-[1.05rem] ${isActive ? navLinkActiveClass : navLinkClass}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <li className="flex items-center pt-2">
                 <button onClick={handleLogout} className="flex items-center gap-3 text-[#ff3b30] font-semibold text-[1.05rem] px-2 py-2 w-full text-left hover:bg-red-50 rounded-xl transition-colors">
                    <img src={btn} alt="logout" className="w-6 h-6 object-cover" />
                    Logout
                 </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Header;
