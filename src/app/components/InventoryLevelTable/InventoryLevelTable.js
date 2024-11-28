'use client';
import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { rawMaterialServices } from '../../services/rawMaterialService';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllMaterialRequest,
  getAllMaterialSuccess,
  getAllMaterialFailure,
} from '../../Actions/materialActions';
import { setRawMaterialIdBatch } from '../../Actions/batchActions';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import SearchBar from '../SearchBar/SearchBar';

const InventoryLevelTable = () => {
  const { allMaterials } = useSelector((state) => state.material);
  const [openIndex, setOpenIndex] = useState(null);

  const sortedMaterials = allMaterials.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedMaterials);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const router = useRouter();
  const dispatch = useDispatch();
  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const setRawMaterialId = (raw_material_Id) => {
    console.log('raw_material_Id===', raw_material_Id);
    dispatch(setRawMaterialIdBatch(raw_material_Id));
    router.push('/storage/view_batches');
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

  const totalPages = Math.ceil(sortedMaterials.length / recordsPerPage);
  // Calculate page numbers to be displayed
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
            className="relative z-10 inline-flex items-center bg-white border rounded-lg px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)] focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
            className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)] focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

  const convertToCSV = (data) => {
    const headers = [
      'MATERIAL NAME',
      'MATERIAL SKU CODE',
      'CATEGORY',
      'CURRENT STOCK',
      'LOWER THRESHOLD',
      'UPPER THRESHOLD',
      'UPDATED AT',
    ];

    const rows = data.map((material) => [
      material?.material_name,
      material?.sku_code,
      material?.material_category_id?.category_name,
      material?.current_stock,
      material?.lower_threshold,
      material?.upper_threshold,
      moment(material?.updatedAt).format('DD MMM YYYY') || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const currentDateAndFileName = `Storage_Inventory_Level_${moment().format(
      'DD-MMM-YYYY'
    )}.csv`;
    link.setAttribute('download', currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const searchKeys = [
    'material_name',
    'sku_code',
    'material_category_id',
    'current_stock',
    'lower_threshold',
    'upper_threshold',
  ];

  return (
    <div class="relative overflow-x-auto mr-[1vw] sm:rounded-lg">
      <div class="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)]">
        {/* search item button */}
        <SearchBar
          tableData={sortedMaterials}
          searchKeys={searchKeys}
          onSearch={handleSearch}
        />
        {/* download CSV button */}
        <div class="flex gap-4">
          <button
            onClick={() => convertToCSV(allMaterials)}
            className="relative z-10 inline-flex items-center bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
          >
            Download CSV
          </button>
        </div>
      </div>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:text-gray-400">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label for="checkbox-all-search" class="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              MATERIAL NAME
            </th>
            <th scope="col" class="px-6 py-3">
              MATERIAL SKU CODE
            </th>
            <th scope="col" class="px-6 py-3">
              CATEGORY
            </th>
            <th scope="col" class="px-6 py-3">
              CURRENT STOCK
            </th>
            <th scope="col" class="px-6 py-3">
              LOWER THRESHOLD
            </th>
            <th scope="col" class="px-6 py-3">
              UPPER THRESHOLD
            </th>
            <th scope="col" class="px-6 py-3">
              ACTIONS
            </th>
          </tr>
        </thead>
        {allMaterials?.length > 0 ? (
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
              records.map((material, index) => ( material.current_stock > 0 && ( 
                <tr
                  id={index}
                  class="bg-white border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)] hover:bg-gray-50"
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
                    class="px-6 py-4 font-medium text-[hsl(36,12%,55%)] max-w-[20vw]"
                  >
                    {material?.material_name}
                  </th>
                  <td class="px-6 py-4">{material?.sku_code}</td>
                  <td class="px-6 py-4">
                    {material?.material_category_id?.category_name}
                  </td>
                  <td class="px-6 py-4">{material?.current_stock}</td>
                  <td class="px-6 py-4">{material?.lower_threshold}</td>
                  <td class="px-6 py-4">{material?.upper_threshold}</td>
                  <td>
                    <button
                      id="dropdownHoverButton"
                      className={`${
                        openIndex === index
                          ? 'bg-[rgb(216,241,247)] text-[rgb(79,202,220)]'
                          : 'text-[rgb(144,138,129)] bg-[rgb(248,246,242)]'
                      } hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center`}
                      type="button"
                      onClick={() => toggleDropdown(index)}
                    >
                      Action
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
                      <div
                        id="dropdownHover"
                        className="z-1000 absolute min-w-24 max-w-24 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
                      >
                        <ul
                          className="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownHoverButton"
                        >
                          <li>
                            <a
                              onClick={() => setRawMaterialId(material?._id)}
                              href="#"
                              className="block px-4 py-2 text-sm font-medium text-[rgb(144,138,129)] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              View Batches
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              )))
            )}
          </tbody>
        ) : (
          <div>loading.....</div>
        )}
      </table>
      <nav className="p-[1vw] flex">
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

export default InventoryLevelTable;
