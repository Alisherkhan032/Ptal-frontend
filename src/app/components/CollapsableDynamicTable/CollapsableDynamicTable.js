import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const DynamicTable = ({
  headings,
  expandedColumns,
  data,
  onToggleExpand,
  expandedItems,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Calculate current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    setCurrentPage((prevPage) => (prevPage > totalPages ? 1 : prevPage));
  }, [data, totalPages]);

  // Handle previous page
  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div>
      <div className="relative overflow-x-auto rounded-2xl border-[1.2px] border-stroke scrollbar-none">
        <table className="w-full text-sm text-left text-dark">
          <thead className="text-sm text-dark-4 bg-gray-2 border-b border-gray-200">
            <tr>
              {Object.keys(headings).map((key) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left capitalize font-medium whitespace-nowrap"
                >
                  {headings[key].label}
                </th>
              ))}
            </tr>
          </thead>

          {currentRows.length > 0 ? (
            <tbody>
              {currentRows.map((group, index) => (
                <React.Fragment key={index}>
                  {/* Main Row */}
                  <tr
                    onClick={() => onToggleExpand(group.materialName)} // Toggle expand on click
                    className="cursor-pointer px-4 py-2 text-left text-dark font-medium whitespace-nowrap bg-white border-b-[0.5px]"
                  >
                    {Object.keys(headings).map((key) => {
                      if (key === "material_name") {
                        return (
                          <td
                            key={key}
                            className="px-4 py-4 flex items-center gap-x-2"
                          >
                            {/* Chevron Icon */}
                            {expandedItems[group.materialName] ? (
                              <FaChevronDown className="inline-block" />
                            ) : (
                              <FaChevronRight className="inline-block" />
                            )}
                            {headings[key].renderCell(group)}
                          </td>
                        );
                      }

                      // Render other columns normally
                      return (
                        <td key={key} className="px-6 py-4">
                          {headings[key].renderCell(group)}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Expanded Row (Details) */}
                  {expandedItems[group.materialName] && (
                    <tr>
                      <td colSpan={Object.keys(headings).length}>
                        <table className="w-full text-sm text-dark">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 border-t-2 border-b border-gray-200 bg-gray-2">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                />
                              </th>
                              {expandedColumns.map((column, subIndex) => (
                                <th
                                  key={subIndex}
                                  className="bg-gray-2 font-medium px-6 py-3 border-t-2 border-b border-stroke"
                                >
                                  {column.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {group.items.map((item, subIndex) => (
                              <tr
                                key={subIndex}
                                className="bg-white border-b border-gray-200"
                              >
                                <td className="px-6 py-4">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                  />
                                </td>
                                {expandedColumns.map((column, colIndex) => (
                                  <td key={colIndex} className="px-6 py-4">
                                    {column.renderCell(item)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          ) : (
            <tr>
              <td
                colSpan={Object.keys(headings).length}
                className="text-center p-5 font-semibold text-red-300"
              >
                No data available
              </td>
            </tr>
          )}
        </table>
      </div>
      <nav className="flex justify-center items-center bg-gray-1 mt-4">
        <div className="min-w-36 text-sm border border-stroke rounded-2xl flex justify-center items-center">
          <div className="flex justify-center items-center min-h-8 min-w-36 rounded-l-2xl text-dark-4 bg-gray-2 border-stroke border-r-2">
            <div>
              <span className="text-dark font-bold mr-2">{currentPage}</span>
              <span>of {totalPages}</span>
            </div>
          </div>

          <div className="flex justify-center items-center min-h-8 min-w-36 text-dark-4 bg-white border-stroke border-r-2">
            <div className="flex justify-center gap-x-2 items-center text-dark-4">
              <svg
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.82495 13.3249C6.67495 13.3249 6.52495 13.2749 6.42495 13.1499L0.774951 7.3999C0.549951 7.1749 0.549951 6.8249 0.774951 6.5999L6.42495 0.849902C6.64995 0.624902 6.99995 0.624902 7.22495 0.849902C7.44995 1.0749 7.44995 1.4249 7.22495 1.6499L1.97495 6.9999L7.24995 12.3499C7.47495 12.5749 7.47495 12.9249 7.24995 13.1499C7.09995 13.2499 6.97495 13.3249 6.82495 13.3249Z"
                  fill="#9CA3AF"
                />
              </svg>

              <button onClick={prePage} disabled={currentPage === 1}>
                Previous
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center min-h-8 min-w-36 rounded-r-2xl text-dark-4 bg-white">
            <div className="flex justify-center gap-x-2 items-center text-dark-4">
              <button onClick={nextPage} disabled={currentPage === totalPages}>
                Next
              </button>
              <svg
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.17495 13.3249C1.02495 13.3249 0.899951 13.2749 0.774951 13.1749C0.549951 12.9499 0.549951 12.5999 0.774951 12.3749L6.02495 6.9999L0.774951 1.6499C0.549951 1.4249 0.549951 1.0749 0.774951 0.849902C0.999951 0.624902 1.34995 0.624902 1.57495 0.849902L7.22495 6.5999C7.44995 6.8249 7.44995 7.1749 7.22495 7.3999L1.57495 13.1499C1.47495 13.2499 1.32495 13.3249 1.17495 13.3249Z"
                  fill="#9CA3AF"
                />
              </svg>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DynamicTable;
