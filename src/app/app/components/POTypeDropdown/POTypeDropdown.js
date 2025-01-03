import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const POTypeDropdown = ({ 
  options, 
  selectedOption, 
  onOptionSelect, 
  onToggle, 
  isOpen 
}) => {
  const visibleOptions = isOpen 
    ? options.filter(option => option.value !== 'assembly')
    : options;

  return (
    <div className="relative w-auto">
      <div
        className={`flex items-center justify-between ${
          isOpen ? "bg-purple-dark" : "bg-primary"
        } text-white px-2 rounded-xl text-sm h-9 cursor-pointer`}
        onClick={onToggle}
      >
        <span>{selectedOption}</span>
        <div className="h-full mx-2 border-r-[1.5px] border-white"></div>
        <ChevronDown className="ml-2" size={20} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-lg z-10">
          {visibleOptions.map((option, index) => (
            <div
              key={option.value}
              className={`
                p-2 
                text-primary hover:bg-purple-light-5 cursor-pointer text-sm font-medium
                ${
                  index !== visibleOptions.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }
              `}
              onClick={() => onOptionSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default POTypeDropdown;