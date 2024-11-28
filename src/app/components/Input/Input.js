import React from "react";

const Input = ({
  height,
  width,
  padding,
  bgColor,
  color,
  textSize,
  fontWeight,
  placeholder,
  radius,
  type,
  value,
  onChange,
  onKeyDown,
  name,
}) => {
  return (
    <input
      type={type}
      className={`${bgColor} ${textSize} ${fontWeight} ${height} ${width} ${padding} ${radius} ${color} focus:outline-none `}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      name={name}
    />
  );
};

export default Input;

{
  /* <Input
// placeholder={"email"}
bgColor={"bg-[#F8F6F2]"}
radius={"rounded-lg"}
height={"h-[3.5vw] min-h-[3.5vh]"}
padding={"p-[1vw]"}
type={"email"}
color={"text-[#838481]"}
textSize={"text-[1vw]"}
fontWeight={"font-medium"}
/> */
}
