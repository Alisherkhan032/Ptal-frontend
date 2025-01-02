import React from "react";

// Helper function to get size-specific classes
const getInputSizeClasses = (size) => {
  switch (size) {
    case "small":
      return "h-8 text-sm px-2 py-1"; // Small input size
    case "medium":
      return "h-10 text-sm px-4 py-2"; // Medium input size (default)
    case "large":
      return "h-12 text-base px-5 py-3"; // Large input size
    default:
      return "h-10 text-sm px-4 py-2"; // Default to medium
  }
};

const Input = ({
  type = "text", // Default input type
  placeholder = "",
  value,
  onChange,
  onKeyDown,
  name,
  size = "medium", // Default size
  bgColor = "bg-white", // Transparent by default
  borderColor = "border-[#DFE4EA]", // Default border color
  width = "w-full", // Full width by default
  color = "text-[#838481]", // Text color
  fontWeight = "font-normal", // Font weight
  radius = "rounded-xl", // Border-radius
}) => {
  // Get size classes based on the size prop
  const sizeClasses = getInputSizeClasses(size);

  return (
    <input
      type={type}
      className={`${bgColor} border ${borderColor} ${sizeClasses} ${fontWeight} ${width} ${radius} ${color} focus:outline-none`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      name={name}
    />
  );
};

export default Input;
