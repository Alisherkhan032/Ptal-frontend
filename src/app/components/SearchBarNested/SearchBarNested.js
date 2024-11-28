import React, { useState } from 'react';

const SearchBar = ({ tableData, searchKeys, onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event) => {
    const searchText = event.target.value;
    setSearchText(searchText);

    const filteredData = tableData.filter(item =>
      searchKeys.some(key => {
        const keyParts = key.split('.'); // Split by dot notation for nested keys
        return searchNested(item, searchText.toLowerCase(), keyParts);
      })
    );
    onSearch(filteredData);
  };

  // Modified search function to handle nested keys and arrays
  const searchNested = (obj, query, keyParts) => {
    if (keyParts.length === 0) return false; // No key to search

    const currentKey = keyParts[0];

    if (Array.isArray(obj[currentKey])) {
      // Handle arrays (e.g., products)
      return obj[currentKey].some(item =>
        searchNested(item, query, keyParts.slice(1)) // Recursively search within array items
      );
    }

    if (typeof obj[currentKey] === 'object' && obj[currentKey] !== null) {
      // If it's an object, keep traversing
      return searchNested(obj[currentKey], query, keyParts.slice(1));
    }

    if (typeof obj[currentKey] === 'string' || typeof obj[currentKey] === 'number') {
      // Handle string and number values
      return obj[currentKey].toString().toLowerCase().includes(query);
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
