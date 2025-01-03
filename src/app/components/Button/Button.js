import React from "react";

const Button = ({
  title,
  height,
  width,
  padding,
  bgColor,
  color,
  textSize,
  fontWeight,
  radius,
  type,
}) => {
  return (
    <button
      type={type}
      className={`flex items-center text-center justify-center ${bgColor} ${textSize} ${fontWeight} ${height} ${width} ${padding} ${radius} ${color} `}
    >
      {title}
    </button>
  );
};

export default Button;

{
  /* <Button
title={"Continue"}
bgColor={"bg-[rgb(79,201,218)]"}
radius={"rounded-lg"}
height={"h-[3.5vw] min-h-[3.5vh]"}
padding={"p-[1vw]"}
type={"email"}
color={"text-[#ffff]"}
textSize={"text-[1vw]"}
fontWeight={"font-medium"}
/> */
}
