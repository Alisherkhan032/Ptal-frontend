import React from "react";

const Dropdown = ({ bgColor, height, width, options }) => {
  const dropdownStyle = {
    backgroundColor: bgColor || "white",
    height: height || "3.5vw",
    minHeight: "3.5vw",
    width: width || "auto",

    color: "#838481 ",
    fontSize: "1.1vw",
  };

  return (
    <select
      style={dropdownStyle}
      className="  w-full  text-[#838481] font-medium     px-4 py-[1vw] rounded-lg leading-tight focus:outline-none "
    >
      {options.map((option) => (
        <option
          className="text-[#838481] py-[1vw] text-[1.1vw] font-medium "
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
