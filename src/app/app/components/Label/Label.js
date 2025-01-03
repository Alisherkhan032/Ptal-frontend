import React from "react";

const Label = ({ text, isRequired = false, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor} // Associates the label with an input field
      className="block text-[#111928] text-sm font-medium mb-1"
    >
      {text}
      {isRequired && <span className="text-[#9CA3AF] ml-[2px]">*</span>}
    </label>
  );
};

export default Label;
