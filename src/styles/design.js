const design = {
  // Fonts
  fonts: {
    heading: "font-bold text-2xl md:text-3xl lg:text-4xl",
    subheading: "font-semibold text-lg md:text-xl",
    body: "text-base md:text-lg",
  },

  // Colors
  colors: {
    primaryGradient: "bg-[#b5e4e0]",
    sectionBg: "bg-white",
    cardBg: "bg-white",
    borderColor: "border-gray-300",
    focusRing:
      "focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30",
  },

  // Input / Buttons
  inputs:
    "input w-full bg-[#f7f7e7] border border-gray-300 focus:border-[#c0c08c] focus:ring focus:ring-[#c0c08c] focus:ring-opacity-30",
  buttons:
    "block text-center text-sm md:text-md bg-[#ee9714] text-white font-semibold px-4 py-2 rounded-md hover:bg-black transition cursor-pointer",

  // Responsive containers
  container:
    "max-w-[320px] xs:max-w-[375px] sm:max-w-[425px] sm2:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10",

  navbarContainer:
    "w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2",
};

export default design;
