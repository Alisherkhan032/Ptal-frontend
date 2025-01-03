import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCat } from "@/app/Actions/categoryActions";

const CategoryDropdown = ({ bgColor, height, width, options }) => {


  const dispatch = useDispatch();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategoryChange = (e) => {
    const selectedCatId = e.target.value;
    console.log('CategoryDropdown: Selected Category ID', selectedCatId);
    setSelectedCategoryId(selectedCatId);
    dispatch(setSelectedCat(selectedCatId));
  };

  return (
    <select
      className="w-full border font-normal text-sm h-10 appearance-none px-4 bg-white border-gray-300 text-[#4B5563] rounded-xl"
      value={selectedCategoryId}
      onChange={handleCategoryChange}
    >
      <option className="px-5 py-3 text-sm font-medium cursor-pointer text-[#111928] hover:bg-[#F5F3FF] hover:text-[#3758F9]" value="">Select Category</option>
      {options.map((category) => (
        <option className="px-5 py-3 text-sm font-medium cursor-pointer text-[#111928] hover:bg-[#F5F3FF] hover:text-[#3758F9]" key={category._id} value={category._id}>
          {category.category_name}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
