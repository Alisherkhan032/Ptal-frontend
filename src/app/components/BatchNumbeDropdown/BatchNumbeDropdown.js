"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { getBatchNumber } from "../../Actions/dropdownValuesActions";

const BatchNumberDropdown = ({ bgColor, options }) => {
  const dispatch = useDispatch();

  const handleBatchNumberChange = (event) => {
    const selectedBatchNumber = event.target.value;
    console.log("selectedBatchNumber ===", selectedBatchNumber);
    dispatch(getBatchNumber(selectedBatchNumber));
  };

  return (
    <select
      className={`block w-full py-2 px-4  bg-${bgColor || "white"}  rounded-lg 
                  sm:w-full sm:py-2 sm:px-4 
                  md:w-full md:py-3 md:px-3  
                  lg:w-full lg:py-3 lg:px-3  lg:max-w-xl`}
      style={{ fontSize: "1rem" }}
      onChange={handleBatchNumberChange}
    >
      <option value="">Select Batch Number</option>
      {options.map((batch) => (
        <option
          key={batch._id}
          value={batch.batch_number}
          className="text-gray-800 font-medium"
        >
          {batch.batch_number}
        </option>
      ))}
    </select>
  );
};

export default BatchNumberDropdown;
