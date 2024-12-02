import React, { useState } from 'react';

const SearchBar = ({ searchText, setSearchText }) => {
  // const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event) => {
    searchText = event.target.value;
    setSearchText(searchText);

  };


  return (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0  rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          id="table-search"
          className="flex p-[0.5vw] ps-10  h-9  text-dark-6 text-sm  focus:outline-none border-stroke border rounded-lg w-56 bg-gray-1"
          placeholder="Search items"
          value={searchText}
          onChange={handleSearchChange} 
        />
      </div>
    </div>
  );
};

export default SearchBar;
