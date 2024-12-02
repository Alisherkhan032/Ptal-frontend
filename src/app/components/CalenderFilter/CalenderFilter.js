import React, { useState, useEffect } from "react";

const CalenderFilter = ({ onFilterChange }) => {
  // Set default date to today's date
  const currentDate = new Date();

  // Set the fromDate to 1 day before today
  const fromDate = new Date();
  fromDate.setDate(currentDate.getDate() - 1); // Subtract 1 day from current date
  const formattedFromDate = fromDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  // Set the toDate as today's date
  const formattedToDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  const [fromDateState, setFromDate] = useState(formattedFromDate);
  const [toDateState, setToDate] = useState(formattedToDate);

  const handleFilterSubmit = () => {
    // Pass the dates to the parent component
    onFilterChange(fromDateState, toDateState);
  };

  return (
    <div className="mt-12 flex justify-center text-black items-center gap-x-3">
      <input
        type="date"
        className="border cursor-pointer border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        value={fromDateState}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <input
        type="date"
        className="border cursor-pointer border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        value={toDateState}
        onChange={(e) => setToDate(e.target.value)}
      />
      <input
        type="submit"
        className="cursor-pointer bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition ease-in-out duration-150"
        value="Check"
        onClick={handleFilterSubmit}
      />
    </div>
  );
};

export default CalenderFilter;
