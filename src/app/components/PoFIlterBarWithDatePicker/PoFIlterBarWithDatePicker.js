import React from "react";
import { ColoredIcon, ICONS } from "../../utils/icons";
import SearchBar from "../SearchBar/SearchBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PoFilterBarWithDatePicker = ({
  filter,
  setFilter,
  searchText,
  setSearchText,
  convertToCSV,
  allPO,
  filterOptions,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  isSearchBarVisible = true,
}) => {
  return (
    <div className="mb-6 bg-dark-1 rounded-lg gap-x-2 flex justify-between overflow-x-auto scrollbar-none">
      {/* Left Section: Search Bar and Filter Buttons */}
      <div className="flex items-center space-x-2">
        <div>
          {isSearchBarVisible && (
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
          )}
        </div>
        {filterOptions &&
          filterOptions.length > 0 &&
          filterOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`whitespace-nowrap cursor-pointer bg-white h-9 border text-sm border-stroke px-4 flex items-center justify-center font-medium rounded-lg text-center ${
                filter === option.value ? "text-primary" : "text-dark-4"
              }`}
            >
              {option.label}
            </div>
          ))}
      </div>

      {/* Right Section: Date Pickers and Download CSV */}
      <div className="flex space-x-2 items-center whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 rounded-lg border border-stroke bg-white">
            <span className="text-dark-6 pl-2">
              {<ColoredIcon icon={ICONS.calender} size="mediumSmall" />}
            </span>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="appearance-none text-sm rounded-lg p-2  w-28 h-full px-2 cursor-pointer outline-none text-dark-4 font-medium hover:text-primary"
            />
          </div>
          <div className="flex items-center space-x-2 rounded-lg border border-stroke bg-white">
            <span className="text-dark-6 pl-2">
              {<ColoredIcon icon={ICONS.calender} size="mediumSmall" />}
            </span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
              className="appearance-none rounded-lg p-2  w-28 h-full px-2 cursor-pointer outline-none text-dark-4 font-medium text-sm hover:text-primary"
            />
          </div>
        </div>
        <div>
          <button
            onClick={() => convertToCSV(allPO)}
            className="cursor-pointer bg-white h-9 text-sm border text-dark-4 border-stroke px-4 flex items-center justify-center font-medium rounded-lg hover:text-primary"
          >
            <span className="mr-1 text-dark-6">
              {<ColoredIcon icon={ICONS.download} size="mediumSmall" />}
            </span>
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoFilterBarWithDatePicker;
