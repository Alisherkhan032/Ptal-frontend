import React, { useState } from "react";

const DynamicTable = ({ headings, rows, fromDate, toDate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 50;

  // Filter rows based on the search term
  const searchKeys = headings;
  const filteredRows = rows.filter((row) =>
    searchKeys.some((key) => {
      const value = row[key];
      return (
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to calculate visible page numbers
  const getVisiblePages = () => {
    const visiblePages = [];
    if (totalPages <= 6) {
      // Show all pages if total pages are 6 or less
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // For more than 6 pages
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

  // format date

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${day}${suffix} ${
      date.toLocaleDateString("en-US", options).split(" ")[0]
    } ${date.getFullYear()}`;
  };

  return (
    <div>
      {/* adding dates */}
      {fromDate && toDate && (
        <h2 className="text-base font-semibold text-gray-700 mb-4 text-center border-t border-b py-2 border-gray-300">
          Showing Results from{" "}
          <span className="text-blue-700">{formatDate(fromDate)}</span> to{" "}
          <span className="text-blue-700">{formatDate(toDate)}</span>
        </h2>
      )}

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              {headings.map((heading, index) => (
                <th key={index} className="px-6 py-3 text-center">
                  {heading.replace(/_/g, " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-white border-b hover:bg-gray-50 odd:bg-gray-100 even:bg-gray-50"
                >
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </th>
                  {headings.map((heading, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 text-center ${
                        heading === "item_name" || heading === "Product_name" 
                        || heading === "material_name"
                          ? "font-medium text-[hsl(36,12%,55%)] max-w-[20vw]"
                          : heading === "sku_code" || heading === "Date"
                          ? "whitespace-nowrap"
                          : ""
                      }`}
                    >
                      {typeof row[heading] === "object" && row[heading] !== null
                        ? row[heading]?.category_name || "N/A"
                        : row[heading] || "N/A"}
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
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            className={`px-3 py-1 ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded hover:bg-gray-300`}
            disabled={page === "..."}
            onClick={() => typeof page === "number" && handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DynamicTable;
