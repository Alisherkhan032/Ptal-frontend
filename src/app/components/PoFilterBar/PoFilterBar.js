import React from "react";
import { ColoredIcon, ICONS } from "../../utils/icons";
import SearchBar from "../SearchBar/SearchBar";

const PoFilterBar = ({
  filter,
  setFilter,
  searchText,
  setSearchText,
  convertToCSV,
  dayFilter,
  handleDayFilterChange,
  allPO,
}) => {
  return (
    <div className="mb-6 bg-dark-1 rounded-lg flex justify-between scrollbar-none">
      {/* Left Section: Search Bar and Filter Buttons */}
      <div className="flex items-center space-x-2">
        <div>
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </div>
        <div
          onClick={() => setFilter("allPo")}
          className={`cursor-pointer bg-white h-9 border text-sm border-stroke px-4 flex items-center justify-center font-medium rounded-lg text-center ${
            filter === "allPo" ? "text-primary" : "text-dark-4"
          }`}
        >
          All POs
        </div>
        <div
          onClick={() => setFilter("pending")}
          className={`cursor-pointer bg-white h-9 border text-sm border-stroke px-4 flex items-center justify-center font-medium rounded-lg text-center ${
            filter === "pending" ? "text-primary" : "text-dark-4"
          }`}
        >
          Pending
        </div>
        <div
          onClick={() => setFilter("fulfilled")}
          className={`cursor-pointer bg-white h-9 border text-sm border-stroke px-4 flex items-center justify-center font-medium rounded-lg text-center ${
            filter === "fulfilled" ? "text-primary" : "text-dark-4"
          }`}
        >
          Fulfilled
        </div>
      </div>

      {/* Right Section: Download CSV and Day Filter Dropdown */}
      <div className="flex space-x-2 items-center">
        <div>
          <button
            onClick={() => convertToCSV(allPO)}
            className="cursor-pointer bg-white h-9 text-sm border text-dark-4 border-stroke px-4 flex items-center justify-center  font-medium rounded-lg hover:text-primary"
          >
            <span className="mr-1 text-dark-6">
              {<ColoredIcon icon={ICONS.download} size="mediumSmall" />}
            </span>
            Download CSV
          </button>
        </div>
        <div className="relative inline-block">
          <div className="flex items-center border text-sm border-stroke rounded-lg bg-white px-4 h-9 cursor-pointer">
            <span className="text-dark-6 ">
              {<ColoredIcon icon={ICONS.calender} size="mediumSmall" />}
            </span>
            {/* Dropdown menu */}
            <select
              value={dayFilter}
              onChange={handleDayFilterChange}
              className="appearance-none w-full h-full px-2  cursor-pointer outline-none text-dark-4 font-medium  hover:text-primary"
            >
              <option value="7days">Last 7 Days</option>
              <option value="14days">Last 14 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoFilterBar;
