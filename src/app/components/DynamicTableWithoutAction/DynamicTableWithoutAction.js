import React, { useState, useEffect } from "react";
import StatusComponent from "@/app/components/StatusComponent/StatusComponent";

const DynamicTable = ({ headings, rows }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  // Calculate total pages
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  // Calculate current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    setCurrentPage((prevPage) => (prevPage > totalPages ? 1 : prevPage));
  }, [rows, totalPages]);

  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <div className="relative overflow-x-auto rounded-2xl border-[1.2px] border-stroke scrollbar-none">
        <table className="w-full text-sm text-dark table-auto">
          <thead className="text-sm text-dark-4 bg-gray-2 border-b border-gray-200">
            <tr>
              {/* Checkbox header */}
              {headings.checkbox ? (
                <th scope="col" className="pl-4 py-2">
                  <div className="flex items-center">
                    {headings.checkbox.label ? (
                      <span className="text-sm font-medium">
                        {headings.checkbox.label}
                      </span>
                    ) : (
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                      />
                    )}
                  </div>
                </th>
              ) : (
                <th scope="col" className="pl-4 py-2"></th>
              )}

              {/* Dynamic headers */}
              {Object.keys(headings).map((key, index) => {
                if (key === "checkbox") return null;
                return (
                  <th
                    key={index}
                    className={`px-4 py-2 min-w-40 max-w-80 text-left capitalize font-medium ${
                      key === 'status' ? '' : ''
                    } ${
                      headings[key].isSticky
                        ? `${headings[key].stickyClassHeader}`
                        : "py-2"
                    }`}
                  >
                    {headings[key].label || key}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white relative">
            {currentRows.length > 0 ? (
              currentRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-white border-b-[0.5px]">
                  {/* Checkbox column */}
                  <td scope="col" className="px-4">
                    {headings.checkbox?.isCheckbox ? (
                      <input
                        type="checkbox"
                        onChange={() =>
                          headings.checkbox.onChange
                            ? headings.checkbox.onChange(row)
                            : null
                        }
                        {...(headings.checkbox.checked
                          ? { checked: headings.checkbox.checked(row) }
                          : {})}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                      />
                    ) : (
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                      />
                    )}
                  </td>

                  {/* Dynamic columns */}
                  {Object.keys(headings).map(
  (key, colIndex) =>
    key !== "checkbox" && (
      <td
        key={colIndex}
        className={`px-4 py-2 min-w-40 max-w-80 font-medium ${
          key === "Status" ? "text-center" : "text-left"
        } text-dark ${
          headings[key].isSticky
            ? `${headings[key].stickyClassRow} `
            : ""
        }`}
      >
        <div className="min-w-40 max-w-80">
          {headings[key].renderCell
            ? headings[key].renderCell(row, rowIndex)
            : row[key] || "N/A"}
        </div>
      </td>
    )
)}

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={Object.keys(headings).length + 1}
                  className="text-center py-4"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav className="flex justify-center items-center bg-gray-1 mt-4">
        <div className="min-w-36 text-sm border border-stroke rounded-2xl flex justify-center items-center">
          <div className="flex justify-center items-center min-h-8 min-w-36 rounded-l-2xl text-dark-4 bg-gray-2 border-stroke border-r-2">
            <div>
              <span className="text-dark font-bold mr-2">{currentPage}</span>
              <span>of {totalPages}</span>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex">
            <button
              onClick={prePage}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-dark-4 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 text-dark-4 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DynamicTable;