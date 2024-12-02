import React from "react";

const Button = ({
  title,
  onClick,
  bgColor,
  radius,
  height,
  padding,
  color,
  textSize,
  fontWeight,
  width,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex  items-center justify-center ${bgColor} ${radius} ${height} ${padding} ${color} ${textSize} ${fontWeight} ${width} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

// Primary Button with predefined styling
export const PrimaryButton = ({ width = "w-full", ...props }) => (
  <Button
    color="text-white"
    radius="rounded-xl"
    height="h-9"
    padding="px-6 py-2"
    textSize="text-sm"
    fontWeight="font-normal"
    width={width}
    {...props}
  />
);

// Secondary Button with predefined styling
export const SecondaryButton = ({ width = "w-full",height='h-12', ...props }) => (
  <Button
    bgColor="bg-[#F5F3FF]"
    color="text-[#3758F9]"
    radius="rounded-xl"
    height={height}
    padding="px-6 py-2"
    textSize="text-sm"
    fontWeight="font-medium"
    width={width}
    {...props}
  />
);

export const PendingRed = ({ title }) => (
  <Button
    bgColor="bg-red-light"
    color="text-white"
    radius="rounded-xl"
    height="h-7"
    padding="px-6 py-2"
    textSize="text-sm"
    fontWeight="font-normal"
    title={title}
  />
);

export const FulfilledGreen = ({ title }) => (
  <Button
    bgColor="bg-green-light-6"
    color="text-green"
    radius="rounded-xl"
    height="h-7"
    padding="px-6 py-2"
    textSize="text-sm"
    fontWeight="font-normal"
    title={title}
  />
);

export const DefaultStatus = ({ title }) => (
  <Button
    bgColor="bg-purple-light-4"
    color="text-purple-dark"
    radius="rounded-xl"
    height="h-7"
    padding="px-6 py-2"
    textSize="text-sm"
    fontWeight="font-normal"
    title={<span className="capitalize">{title}</span>} 
  />
)

export default Button;
