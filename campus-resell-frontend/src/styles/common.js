// ─── Navbar ───────────────────────────────────────────

export const navbarClass = "sticky top-0 z-50 border-b border-[#ececf0] bg-[#fcfcfd]/80 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all";

export const navContainerClass =
  "w-full h-16 px-4 sm:px-6 lg:px-8 flex justify-between items-center";

export const navBrandClass =
  'flex items-center gap-2 sm:gap-3 text-[0.95rem] sm:text-[1.05rem] md:text-[1.15rem] font-semibold tracking-tight text-[#111111] font-["Sora"]';

export const navLogoClass = "w-7 h-7 sm:w-8 sm:h-8 object-contain";

export const navLinksClass = "flex items-center gap-2 sm:gap-3 md:gap-6";

export const navLinkClass = "text-[0.9rem] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors duration-150 px-2 py-1";

export const navLinkImg = "w-5 h-5 mt-1";

export const navLinkActiveClass =
  "text-[0.9rem] text-[#1d1d1f] font-medium underline decoration-[#1d1d1f] decoration-2 underline-offset-4 px-2 py-1";

// export const navLinkClass =
//   "relative px-2.5 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-[14px] font-medium text-[#52525b] transition-all duration-150 hover:text-[#111111]";

// export const navLinkActiveClass =
//   "relative px-2.5 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-[14px] font-medium text-[#111111] after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[1px] after:w-[70%] after:h-[3.8px] after:rounded-full after:bg-[#111111]";

// ─── Layout ───────────────────────────────────────────

export const pageBackground = "bg-[#fcfcfd] min-h-screen";

export const pageWrapper = "max-w-5xl mx-auto px-6 py-16";

export const section = "mb-14";

// ─── Forms ────────────────────────────────────────────

export const formCard =
  "bg-[#f7f7f8] border border-[#ececf0] rounded-[28px] p-5 sm:p-10 max-w-4xl mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.03)]";

export const formTitle = 'text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight text-center mb-8 font-["Sora"]';

export const labelClass = "text-[13px] font-medium text-[#111111] mb-1 block px-2";

export const inputClass =
  "w-full bg-white border border-[#d2d2d7] rounded-lg px-4 py-[10px] text-[#111111] text-sm placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition";

export const formGroup = "mb-4";

export const submitBtn =
  "w-full bg-[#111111] text-white font-semibold py-2.5 rounded-2xl hover:bg-gray-800 transition-colors cursor-pointer mt-2 text-sm tracking-tight";

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn =
  "bg-[#0066cc] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#004499] transition-colors cursor-pointer text-sm tracking-tight";
export const secondaryBtn =
  "border border-[#d2d2d7] text-[#1d1d1f] font-medium px-5 py-2 rounded-full hover:bg-[#f5f5f7] transition-colors cursor-pointer text-sm";
export const ghostBtn = "text-[#0066cc] font-medium hover:text-[#004499] transition-colors cursor-pointer text-sm";

// ─── Typography ───────────────────────────────────────
export const pageTitleClass = `text-5xl font-bold text-[#1d1d1f] tracking-tight leading-none mb-2 text-center mt-2 font-["sora"]`;
export const headingClass = "text-2xl font-bold text-[#1d1d1f] tracking-tight";
export const subHeadingClass = "text-lg font-semibold text-[#1d1d1f] tracking-tight ";
export const bodyText = "text-[#6e6e73] leading-relaxed";
export const mutedText = "text-sm text-[#a1a1a6]";
export const linkClass = "text-[#0066cc] hover:text-[#004499] transition-colors";

// ─── Sell Page Styles ───────────────────────────────────────

export const sPanelClass = `
  bg-white
  rounded-2xl
  border
  border-gray-200
  shadow-sm
`;

export const sSectionTitle = `
  text-2xl
  font-semibold
  text-gray-900
`;

export const sSectionSubTitle = `
  text-sm
  text-gray-500
  mt-1
`;

export const sLabelClass = `
  block
  text-sm
  font-medium
  text-gray-700
  mb-2
`;

export const sInputClass = `
  w-full
  rounded-xl
  border
  border-gray-300
  bg-white
  px-4
  py-3
  text-sm
  text-gray-800
  outline-none
  transition-all
  duration-200
  focus:border-gray-500
  focus:ring-3
  focus:ring-gray-100
`;

export const sTextareaClass = `
  ${sInputClass}
  resize-none
`;

export const sSelectClass = `
  ${sInputClass}
  appearance-none
`;

export const sErrorText = `
  mt-2
  text-sm
  text-red-500
`;

export const sSubmitBtn = `
  mt-2
  w-full
  rounded-xl
  bg-gray-900
  px-4
  py-3
  text-sm
  font-semibold
  text-white
  transition-all
  duration-200
  hover:bg-black
  cursor-pointer
`;

export const sUploadBox = `
  relative
  border-2
  border-dashed
  border-gray-300
  rounded-2xl
  aspect-square
  flex
  items-center
  justify-center
  overflow-hidden
  bg-gray-50
  transition-all
  duration-200
  hover:border-gray-400
`;

export const sUploadPlaceholder = `
  flex
  flex-col
  items-center
  justify-center
  gap-2
  cursor-pointer
  text-gray-500
`;

export const homePageTitle = `
  text-5xl
  md:text-6xl
  font-["sora"]
  font-extrabold
  tracking-[-0.04em]
  leading-none
  text-center
  mt-4
  text-[#111111]
  [text-shadow:4px_4px_0_rgba(0,0,0,0.12)]
`;
