import React, { useState } from 'react';

const SearchBar = ({ tableData, searchKeys, onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event) => {
    const searchText = event.target.value;
    setSearchText(searchText);

    const filteredData = tableData.filter(item =>
      searchKeys.some(key =>
        searchNested(item[key], searchText.toLowerCase(), key)
      )
    );
    onSearch(filteredData);
  };

  // Recursive function to search nested arrays and objects
  const searchNested = (obj, query, key) => {
    if (Array.isArray(obj)) {
      return obj.some(item => searchNested(item, query, key));
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some(val => searchNested(val, query, key));
    }
    if (typeof obj === 'string') {
      return obj.toLowerCase().includes(query);
    }
    if (typeof obj === 'number' && key === 'quantity') {
      return obj.toString().includes(query);
    }
    return false;
  };

  return (
    <div>
      <label htmlFor="table-search" className="sr-only">
        Search
      </label>
      <div className="relative mt-1">
        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
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
          className="flex p-[0.5vw] ps-10 text-sm text-gray-900 border focus:outline-none border-gray-300 rounded-lg w-80 bg-gray-50 dark:border-gray-600 dark:placeholder-gray-400"
          placeholder="Search for items"
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
