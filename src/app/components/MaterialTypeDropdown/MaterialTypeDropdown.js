import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSelectedCat } from "@/app/Actions/categoryActions";
import { ICONS } from "@/app/utils/icons";

const MaterialTypeDropdown = ({ bgColor, name, options, height, width }) => {
  const dispatch = useDispatch();

  // Default selected category logic (similar to previous component)
  const defaultCategoryId = options.find(
    (category) => category.category_name === "Raw Material"
  )?._id;
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    defaultCategoryId || null
  );

  useEffect(() => {
    if (defaultCategoryId) {
      dispatch(setSelectedCat(defaultCategoryId));
    }
  }, [defaultCategoryId, dispatch]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    dispatch(setSelectedCat(categoryId));
  };

  // Style object to maintain previous dropdown styling if needed
  const containerStyle = {
    backgroundColor: bgColor || "white",
    height: height || "3.5vw",
    minHeight: "3.5vw",
    width: width || "auto",
  };

  return (
    <div className="flex flex-col space-y-2" style={containerStyle}>
      <div className="flex w-full">
        {options.map((category, index) => (
          <button
            key={category._id}
            className={`h-10 ${
              selectedCategoryId === category._id
                ? "bg-gray-2 text-primary border border-primary"
                : "bg-white text-[#111928] border border-stroke"
            } flex-1 font-medium px-6 py-2 text-sm cursor-pointer 
        ${index === 0 ? "rounded-l-lg" : ""} 
        ${index === options.length - 1 ? "rounded-r-lg" : ""}
        ${index !== 0 && index !== options.length - 1 ? "border-l-0" : ""}`}
            onClick={() => handleCategoryClick(category._id)}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>
                {category.category_name === "Raw Material"
                  ? React.cloneElement(ICONS["rawMaterial"], {
                      width: 20,
                      height: 20,
                    })
                  : ""}
                {category.category_name === "Packaging Material"
                  ? React.cloneElement(ICONS["packaging"], {
                      width: 20,
                      height: 20,
                    })
                  : ""}
              </span>
              <span className="text-sm">
                {category.category_name === "Packaging Material"
                  ? "Packaging"
                  : "Raw Material"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MaterialTypeDropdown;