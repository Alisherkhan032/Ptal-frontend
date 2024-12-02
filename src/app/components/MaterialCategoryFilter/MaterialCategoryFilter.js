import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSelectedCat } from "@/app/Actions/categoryActions";

const MaterialCategoryFilter = ({ bgColor, name, options }) => {
  const dispatch = useDispatch();

  //  default selected category is "Raw Material"
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

  return (
    <div className="flex flex-col space-y-2">
      <h2 className="block text-[#111928] text-sm font-medium mb-1">
        {name}
        <span className="text-[#9CA3AF] ml-[2px]">*</span>
      </h2>
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
              {/*todo : ICONS to be added */}
              <span>
                {category.icon && (
                  <img
                    src={category.icon} // Replace with your icon source
                    alt={`${category.category_name} icon`}
                    className="w-4 h-4"
                  />
                )}
              </span>
              <span>{category.category_name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MaterialCategoryFilter;
