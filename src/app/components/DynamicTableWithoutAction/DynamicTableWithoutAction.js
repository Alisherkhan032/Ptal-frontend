import React, { useState, useEffect } from "react";
import { PendingRed, FulfilledGreen , DefaultStatus} from "../ButtonComponent/ButtonComponent";

const DynamicTable = ({ headings, rows }) => {
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
          <thead className="text-sm text-dark-4 bg-gray-2  border-b border-gray-200">
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
                          <PendingRed title='Pending' />
                        ) : row[heading] === "fulfilled" ? (
                          <FulfilledGreen  title='Fulfilled'  />
                        ) : (
                          <DefaultStatus title={row[heading].replace(/_/g, " ")} /> 
                        )
                      ) : (
                        row[heading] || "N/A"
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headings.length} className="text-center py-4">
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

export default DynamicTable;
