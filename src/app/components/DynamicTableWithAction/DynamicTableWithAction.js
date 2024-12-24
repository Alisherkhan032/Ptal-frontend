import React, { useState, useEffect } from "react";
import {
  PendingRed,
  FulfilledGreen,
  DefaultStatus,
} from "../ButtonComponent/ButtonComponent";
import DropdownComponent from "../DropDownComponent/DropDownComponent";

const DynamicTableWithAction = ({ headings, rows, openDropDownToggle,generateBatchSticker, toggleDropdown}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 50;

  // Function to calculate indices for the current rows
  const calculatePageIndices = (currentPage, rowsPerPage, filteredRows) => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return filteredRows.slice(indexOfFirstRow, indexOfLastRow);
  };

  // Function to calculate the total number of pages
  const calculateTotalPages = (filteredRows, rowsPerPage) => {
    return Math.ceil(filteredRows.length / rowsPerPage);
  };

  // Function to generate visible page numbers
  const getVisiblePages = (currentPage, totalPages) => {
    const visiblePages = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        visiblePages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage > totalPages - 3) {
        visiblePages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        visiblePages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return visiblePages;
  };

  // Filter rows based on the search term
  const filteredRows = rows.filter((row) =>
    headings.some((key) => {
      const value = row[key];
      return (
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );

  // Calculate the total pages and current rows
  const totalPages = calculateTotalPages(filteredRows, rowsPerPage);
  const currentRows = calculatePageIndices(
    currentPage,
    rowsPerPage,
    filteredRows
  );
  const visiblePages = getVisiblePages(currentPage, totalPages);

  // Handle page change
  const onPageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to page 1 when filteredRows changes
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever filteredRows changes
  }, [rows]);

  return (
    <div>
      {/* Table */}
      <div className="relative overflow-x-auto rounded-2xl border-[1.2px] border-stroke scrollbar-none">
        <table className="w-full text-sm text-dark">
          <thead className="text-sm text-dark-4 bg-gray-2 border-b border-gray-200">
            <tr>
              <th scope="col" className="pl-4 py-3">
                <div className="flex">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </th>
              {headings.map((heading, index) => (
                <th
                  key={index}
                  className="px-6 py-1 text-left capitalize font-medium whitespace-nowrap"
                >
                  {heading.replace(/_/g, " ")}
                </th>
              ))}
              <th className="px-6 py-1 text-left capitalize font-medium whitespace-nowrap sticky right-0 border-l-2 border-stroke bg-gray-2">
                Actions
              </th>{" "}
              {/* Sticky Action Column */}
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentRows.length > 0 ? (
              currentRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-white border-b">
                  <th scope="col" className="p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </th>
                  {headings.map((heading, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-left text-dark font-medium whitespace-nowrap"
                    >
                      {heading === "status" ? (
                        row[heading] === "pending" ? (
                          <PendingRed title="Pending" />
                        ) : row[heading] === "fulfilled" ? (
                          <FulfilledGreen title="Fulfilled" />
                        ) : (
                          <DefaultStatus
                            title={row[heading].replace(/_/g, " ")}
                          />
                        )
                      ) : (
                        row[heading] || "N/A"
                      )}
                    </td>
                  ))}
                  {/* Action Dropdown Column */}
                  <td>
                    <button
                      id="dropdownHoverButton"
                      className={`${
                        openDropDownToggle === rowIndex
                          ? "bg-[rgb(216,241,247)] text-[rgb(79,202,220)]"
                          : "text-[rgb(144,138,129)] bg-[rgb(248,246,242)]"
                      } hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center `}
                      type="button"
                      onClick={() => toggleDropdownMenu(rowIndex)}
                    >
                      Action
                      <svg
                        className="w-2.5 h-2.5 ms-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>

                    {/* Use DropdownComponent */}
                    <DropdownComponent
                      openDropDownToggle={openDropDownToggle}
                      index={index}
                      po={row} // Pass the PO object
                      generateBatchSticker={generateBatchSticker} // Pass the generateBatchSticker function
                      toggleDropdown={toggleDropdown} // Pass the toggleDropdown function
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headings.length + 1} className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        {/* Previous Button */}
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => (
          <button
            key={index}
            className={`px-3 py-1 ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded hover:bg-gray-300`}
            disabled={page === "..."}
            onClick={() => typeof page === "number" && onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DynamicTableWithAction;
