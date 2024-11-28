import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

const ViewBatchTable = () => {
  const { allBatches } = useSelector((state) => state.batch);

  // Sort the batches by createdAt in descending order
  const sortedBatches = allBatches?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="relative overflow-x-auto mr-[1vw] sm:rounded-lg">
      <div className="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)]">
        {/* search item button */}
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
            />
          </div>
        </div>
        {/* po raise button */}
        {/* <div>
          <Button
            title={"PO Raise"}
            bgColor={"bg-[rgb(79,201,218)]"}
            radius={"rounded-lg"}
            height={"h-[3vw] min-h-[3vh]"}
            padding={"p-[1vw]"}
            color={"text-[#ffff]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            width={"w-[7vw]"}
          />
        </div> */}
      </div>
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
            <th scope="col" className="px-6 py-3">
              RAW MATERIAL NAME
            </th>
            <th scope="col" className="px-6 py-3">
              PURCHASE ORDER NUMBER
            </th>
            <th scope="col" className="px-6 py-3">
              BATCH NUMBER
            </th>
            {/* <th scope="col" className="px-6 py-3">
              VENDOR NAME
            </th> */}
            <th scope="col" className="px-6 py-3">
              QUANTITY
            </th>
            <th scope="col" className="px-6 py-3">
              WEIGHT
            </th>
            <th scope="col" className="px-6 py-3">
              CREATED BY
            </th>
            <th scope="col" className="px-6 py-3">
              CREATED AT
            </th>
          </tr>
        </thead>
        {sortedBatches?.length > 0 ? (
          <tbody>
            {sortedBatches.map((batch, index) => (
              <tr
                key={index}
                className="bg-white border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)] hover:bg-gray-50"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-table-search-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-[rgb(153,142,125)] whitespace-nowrap"
                >
                  {batch?.raw_material_id?.material_name}
                </th>
                <td className="px-6 py-4">{batch?.po_id?.po_number}</td>
                <td className="px-6 py-4">{batch?.batch_number}</td>
                <td className="px-6 py-4">{batch?.quantity}</td>
                <td className="px-6 py-4">{batch?.po_id?.weight}</td>
                <td className="px-6 py-4">
                  {batch?.created_by?.firstName} {batch?.created_by?.lastName}
                </td>
                <td className="px-6 py-4">
                  {moment(batch?.createdAt).format("DD MMM YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <div>loading.....</div>
        )}
      </table>
    </div>
  );
};

export default ViewBatchTable;
