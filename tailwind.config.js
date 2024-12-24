/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors : {
        "primary": "#3758F9",
        "primary-dark": "#1C3FB7",
        "secondary": "#13C296",
        "primary-text" : "#637381",
        "secondary-text" : "#8899A8",
        "stroke" : "#DFE4E4",
        "dark" : "#111928",
        "dark-2" : "#1F2A37",
        "dark-3" : "#374151",
        "dark-4" : "#4B5563",
        "dark-5" : "#6B7280",
        "dark-6" : "#9CA3AF",
        "dark-7" : "#D1D5DB",
        "dark-8" : "#E5E7EB",
        "dark-opacity" : "#111928",
        "gray-1" : "#F9FAFB",
        "gray-2" : "#F3F4F6",
        "gray-3" : "#E5E7EB",
        "gray-4" : "#DEE2E6",
        "gray-5" : "#CED4DA",
        "stroke" : "#DFE4EA",
        "red-light" : "#F56060",
        "green-light-6" : "#DAF8E6",
        "green" : "#22AD5C",
        "green-dark": "#1A8245",
        "purple-dark" : "#6D28D9",
        "purple-light-4" : "#EDE9FE",
        "purple-light-3": "#DDD6FE",
        "purple-light-5" : "#F5F3FF",
        "purple-dark" : "#6D28D9",
        'svg-gray' : "#9ca3af",
        "yellow-light-4": "#FFFBEB",
        "yellow-dark": "#F59E0B",


      }
    },
  },
  plugins: [require('tailwind-scrollbar'),],
};
