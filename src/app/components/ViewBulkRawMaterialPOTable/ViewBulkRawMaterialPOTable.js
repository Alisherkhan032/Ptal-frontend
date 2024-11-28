'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import SearchBar from '../SearchBar/SearchBar';

const ViewBulkRawMaterialPOTable = () => {
  const { allBulkRawMaterialPO, loading, error } = useSelector(
    (state) => state.bulkRawMaterialPO
  );
  const [openIndex, setOpenIndex] = useState(null);
  const sortedMaterials = allBulkRawMaterialPO.sort((a, b) => {
   
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedMaterials);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);
  const currentDateAndFileName = `View_B2B_PO_${moment().format(
    'DD-MMM-YYYY'
  )}`;

  const convertToCSV = (data) => {
    const headers = [
      'RAW MATERIAL NAME',
      'QUANTITY',
      'RAISED BY',
      'FULFILLED BY',
      'CREATED AT',
    ];

    const rows = data.map((po) => [
      po?.raw_material_id?.material_name,
      po?.quantity,
      `${po?.createdBy?.firstName} ${po?.createdBy?.lastName}` || '',
      `${po?.fulfilledBy?.firstName} ${po?.fulfilledBy?.lastName}` || '',
      moment(po?.createdAt).format('DD MM YYYY') || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setFilteredData(sortedMaterials);
    setCurrentPage(1);
  }, [sortedMaterials]);

  const handleSearch = (data) => {
    setFilteredData(data);
    setCurrentPage(1);
  };

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function chageCPage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  function closeModal() {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
    // dispatch(setRawMaterialIdBatch(raw_material_Id));
  };

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const pageNumbers = [];
  const threshold = 10;

  if (totalPages <= threshold) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          onClick={() => chageCPage(i)}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
          key={i}
        >
          <a
            href="#"
            className="relative z-10 inline-flex items-center bg-white border rounded-lg px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)] focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
          >
            {i}
          </a>
        </li>
      );
    }
  } else {
    const leftOffset = Math.max(currentPage - Math.floor(threshold / 2), 1);
    const rightOffset = Math.min(
      leftOffset + threshold - 1,
      totalPages - threshold + 1
    );

    if (leftOffset > 1) {
      pageNumbers.push(
        <li key="ellipsis1">
          <span className="ellipsis">...</span>
        </li>
      );
    }

    for (let i = leftOffset; i <= rightOffset; i++) {
      pageNumbers.push(
        <li
          onClick={() => chageCPage(i)}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
          key={i}
        >
          <a
            href="#"
            className="relative z-10 inline-flex items-center  px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)] focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
          >
            {i}
          </a>
        </li>
      );
    }

    if (rightOffset < totalPages) {
      pageNumbers.push(
        <li key="ellipsis2">
          <span className="ellipsis">...</span>
        </li>
      );
    }
  }

  const searchKeys = [
    'raw_material_id',
    'quantity',
    'createdBy',
    'fulfilledBy',
    'createdAt',
  ];

  return (
    <div class="relative  overflow-x-auto   sm:rounded-lg">
      <div class="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)]  dark:border-[rgb(248,246,242)]  ">
        {/* search item button */}
        <SearchBar
          tableData={sortedMaterials}
          searchKeys={searchKeys}
          onSearch={handleSearch}
        />
        <div class="flex gap-4">
          <button
            onClick={() => convertToCSV(sortedMaterials)}
            className="relative z-10 inline-flex items-center bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
          >
            Download CSV
          </button>
        </div>
      </div>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]  dark:text-gray-400">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded     dark:bg-gray-700 dark:border-gray-600"
                />
                <label for="checkbox-all-search" class="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
             BULK ORDER REFRENCE
            </th>
            <th scope="col" class="px-6 py-3">
              RAW MATERIAL NAME
            </th>

            <th scope="col" class="px-6 py-3">
              QUANTITY
            </th>
            <th scope="col" class="px-6 py-3">
              RAISED BY
            </th>
            <th scope="col" class="px-6 py-3">
              FULFILLED BY
            </th>
            <th scope="col" class="px-6 py-3">
              CREATED AT
            </th>
            <th scope="col" class="px-6 py-3">
              ACTIONS
            </th>
          </tr>
        </thead>
        {allBulkRawMaterialPO?.length > 0 ? (
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-5 font-semibold  text-red-300"
                >
                  Item not found !
                </td>
              </tr>
            ) : (
              records.map((po, index) => (
                <tr
                  id={index}
                  class={`${
                    po.status === 'fulfilled' ? 'bg-green-100' : 'bg-white'
                  }  border-b-[0.15vw]  border-dashed border-[rgb(248,246,242)]  dark:border-[rgb(248,246,242)] `}
                >
                  <td class="w-4 p-4">
                    <div class="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label for="checkbox-table-search-1" class="sr-only">
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-[rgb(153,142,125)] max-w-[20vw]"
                  >
                    {po?.bulkOrderReference}
                  </th>
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-[rgb(153,142,125)] max-w-[20vw]"
                  >
                    {po?.raw_material_id?.material_name}
                  </th>

                  <td class="px-6 py-4">{po?.quantity}</td>
                  <td class="px-6 py-4">
                    {po?.createdBy?.firstName} {po?.createdBy?.lastName}
                  </td>
                  <td class="px-6 py-4">
                    {po?.fulfilledBy?.firstName} {po?.fulfilledBy?.lastName}
                  </td>
                  <td class="px-6 py-4">
                    {moment(po?.createdAt).format('DD MMM YYYY')}
                  </td>
                  <td>
                    <button
                      id="dropdownHoverButton"
                      className={`${
                        openIndex === index
                          ? 'bg-[rgb(216,241,247)] text-[rgb(79,202,220)]'
                          : 'text-[rgb(144,138,129)] bg-[rgb(248,246,242)]'
                      }   hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none  font-medium rounded-lg text-xs px-2 py-2.5 text-center inline-flex items-center `}
                      type="button"
                      onClick={() =>
                        toggleDropdown(index, po?.raw_material_id?._id)
                      }
                    >
                      View Batches
                      <svg
                        class="w-2.5 h-2.5 ms-3"
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
                    {openIndex === index && (
                      // <div
                      //   id="dropdownHover"
                      //   className="z-1000 absolute min-w-24 max-w-24 bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700"
                      // >
                      //   <ul
                      //     className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      //     aria-labelledby="dropdownHoverButton"
                      //   >
                      //     <li>
                      //       <a
                      //         onClick={() => upatePoStatus(po._id)}
                      //         href="#"
                      //         className="block px-4 py-2 text-sm font-medium text-[rgb(144,138,129)] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      //       >
                      //         Fulfill
                      //       </a>
                      //     </li>
                      //   </ul>
                      // </div>
                      <div
                        id="popup-modal"
                        tabIndex="-1"
                        className=" flex  overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                        style={{
                          backdropFilter: 'blur(2px)',
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                          <div className="relative w-[30vw] flex items-center justify-center bg-[#F8F6F2] text-[#838481] rounded-lg shadow ">
                            <div className="p-4 md:p-5 text-center">
                              <div className="overflow-y-scroll h-24">
                                <ul className="bg-[#F8F6F2] w-[25vw] rounded-lg p-2 px-4">
                                  {po?.batchData?.length > 0 ? (
                                    po.batchData.map((item) => (
                                      <li
                                        key={item.batchNumber}
                                        className="flex justify-between font-semibold rounded-md mb-1 bg-[#ffffff] p-2 px-4"
                                      >
                                        <span>
                                          Batch no: {item.batchNumber}
                                        </span>
                                        <span>Quantity: {item.quantity}</span>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="font-semibold mt-7 text-center">
                                      Items not available !
                                    </li>
                                  )}
                                </ul>
                              </div>

                              <div className="flex mt-3 gap-4 justify-end">
                                <button
                                  data-modal-hide="popup-modal"
                                  type="button"
                                  className="py-2.2 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                  onClick={() => closeModal()}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        ) : (
          <div>loading.....</div>
        )}
      </table>
      <nav className="p-[1vw] flex ">
        <ul className="pagination flex gap-[1vw]">
          <li className="page-item">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={prePage}
            >
              Prev
            </a>
          </li>
          {pageNumbers}
          <li className="page-item">
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={nextPage}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ViewBulkRawMaterialPOTable;
