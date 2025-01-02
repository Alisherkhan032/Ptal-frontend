import React from "react";
import { CloseWhite, SecondaryButton } from "../ButtonComponent/ButtonComponent";

const DynamicTable = ({ headings, rows, handleCancel }) => {
  console.log("rows", rows);
  console.log("headings", headings);
  return (
    <>
      <div className="relative  overflow-x-auto rounded-2xl border-[1.5px] mb-12  border-stroke">
        <table className="w-full text-sm text-dark table-auto">
          <thead className="text-sm text-dark-4 bg-gray-2 border-b border-gray-200">
            <tr>
              {headings.map((heading, index) => (
                <th key={index} className="px-4 py-2 text-left font-medium">
                  {heading.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {headings.map((heading, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-4 text-left text-dark font-medium"
                    >
                      {heading.renderCell(row)}
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

      <div className="absolute bottom-0 left-0 w-full  bg-white px-6 py-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <CloseWhite
              title="Close"
              onClick={handleCancel}
              size='full'
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicTable;
