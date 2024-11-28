import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCat } from "@/app/Actions/categoryActions";

const CategoryDropdown = ({ bgColor, height, width, options }) => {
  const dropdownStyle = {
    backgroundColor: bgColor || "white",
    height: height || "3.5vw",
    minHeight: "3.5vw",
    width: width || "auto",
    color: "#838481 ",
    fontSize: "1.1vw",
  };

  const dispatch = useDispatch();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategoryChange = (e) => {
    const selectedCatId = e.target.value;
    setSelectedCategoryId(selectedCatId);
    dispatch(setSelectedCat(selectedCatId));
  };

  return (
    <select
      style={dropdownStyle}
      className="w-full text-[#838481] font-medium px-4 py-[1vw] rounded-lg leading-tight focus:outline-none"
      value={selectedCategoryId}
      onChange={handleCategoryChange}
    >
      <option value="">Select Category</option>
      {options.map((category) => (
        <option key={category._id} value={category._id}>
          {category.category_name}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
