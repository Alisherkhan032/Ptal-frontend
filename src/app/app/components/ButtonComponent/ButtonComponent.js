import React from "react";

// Helper function to determine size classes
const getButtonSizeClasses = (size) => {
  switch (size) {
    case "small":
      return "h-6 text-xs px-4 py-1 min-w-24 max-w-full"; // Added max-w-full
    case "small-medium":
      return "h-7 text-sm px-5 py-2 min-w-28 max-w-full"; // Added max-w-full
    case "medium":
      return "h-9 text-sm px-6 py-3 min-w-36 max-w-full"; // Added max-w-full
    case "large":
      return "h-10 text-base px-8 py-3 min-w-36 max-w-full"; // Added max-w-full
    case "full":
      return "text-sm px-4 py-2 w-full"; // Full width
    case "titleBar":
      return "text-sm px-4 py-2"; // Full width
    default:
      return "text-sm px-4 py-3"; // Added max-w-full
  }
};

const Button = ({
  title,
  onClick,
  bgColor,
  radius,
  size,
  color,
  textSize,
  fontWeight,
  width,
  disabled,
  hoverColor,
  border,
  ...props  
}) => {
  // Get the appropriate button size classes
  const sizeClasses = getButtonSizeClasses(size);

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center text-left break-words whitespace-normal ${border} ${bgColor} ${radius} ${color} ${sizeClasses} ${fontWeight} ${width} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${hoverColor && !disabled ? hoverColor : ""}`}
      disabled={disabled}
      {...props}
    >
      {title}
    </button>
  );
};

// Primary Button with predefined styling
export const PrimaryButton = ({size, ...props }) => (
  <Button
    bgColor="bg-primary"
    color="text-white"
    radius="rounded-xl"
    fontWeight="font-normal"
    size={size}
    hoverColor="hover:bg-primary-dark"
    {...props}
  />
);

// Secondary Button with predefined styling
export const SecondaryButton = ({ size, ...props }) => (
  <Button
    bgColor="bg-[#F5F3FF]"
    color="text-[#3758F9]"
    radius="rounded-xl"
    fontWeight="font-medium"
    size={size}
    hoverColor="hover:bg-[#E0DFFF]"
    {...props}
  />
);

export const CloseWhite = ({ size, ...props }) => (
  <Button
    bgColor="bg-white"
    color="text-dark-4"
    radius="rounded-xl"
    fontWeight="font-medium"
    border="border-[1.5px] border-stroke"
    size={size}
    {...props}
  />
);

// Pending Red Button with predefined styling
export const PendingRed = ({ size = "small-medium", title, ...props }) => (
  <Button
    bgColor="bg-red-light"
    color="text-white"
    radius="rounded-xl"
    fontWeight="font-normal"
    size={size}
    title={<span className="break-words">{title}</span>}
    {...props}
  />
);

// Fulfilled Green Button with predefined styling
export const FulfilledGreen = ({ size = "small-medium", title, ...props }) => (
  <Button
    bgColor="bg-green-light-6"
    color="text-green"
    radius="rounded-xl"
    fontWeight="font-normal"
    size={size}
    title={<span className="break-words">{title}</span>}
    {...props}
  />
);

// Default Status Button with predefined styling
export const DefaultStatus = ({ size = "full", title, ...props }) => (
  <Button
    bgColor="bg-green"
    color="text-white"
    radius="rounded-xl"
    fontWeight="font-normal"
    size={size}
    title={<span className="break-words ">{title}</span>}
    {...props}
  />
);

// QC Info Button with predefined styling
export const QcInfo = ({ size = "full", title, ...props }) => (
  <Button
    bgColor="bg-yellow-light-4"
    color="text-yellow-dark"
    radius="rounded-xl"
    fontWeight="font-normal"
    size={size}
    title={<span className="break-words whitespace-normal capitalize">{title}</span>}
    {...props}
  />
);

export default Button;