const design = {
  // Fonts
  fonts: {
    heading: "font-bold text-2xl md:text-3xl lg:text-4xl",
    subheading: "font-semibold text-lg md:text-xl",
    body: "text-base md:text-lg",
  },

  // Colors
  colors: {
    primaryGradient: "bg-[#398881]",
    sectionBg: "bg-white",
    cardBg: "bg-white",
    borderColor: "border-gray-300",
  },

  // Input / Buttons
  inputs:
    "input w-full bg-white border border-[#398881] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#398881] focus:ring-opacity-50",
  buttons:
    "block text-center text-sm md:text-md bg-[#398881]  text-white font-semibold px-4 py-2 rounded-md hover:bg-black transition cursor-pointer",

  // Responsive containers
  container:
    "max-w-[320px] xs:max-w-[375px] sm:max-w-[425px] sm2:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10",

  navbarContainer:
    "w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2",
};

export default design;
