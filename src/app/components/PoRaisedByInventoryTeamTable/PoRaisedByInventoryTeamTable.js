'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { assemblyPOServices } from '@/app/services/assemblyPO';
import { inventoryPOServices } from '@/app/services/inventoryPO';
import { poServices } from '@/app/services/poService';
import BatchNumbeDropdown from '../BatchNumbeDropdown/BatchNumbeDropdown';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { setRawMaterialIdBatch } from '../../Actions/batchActions';
import {
  getAllBatchRequest,
  getAllBatchSuccess,
  getAllBatchFailure,
} from '../../Actions/batchActions';
import { getBatchNumber } from '../../Actions/dropdownValuesActions';

import { batchServices } from '@/app/services/batchService';
import Link from 'next/link';
import SearchBar from '../SearchBar/SearchBar';

const PoRaisedByInventoryTeamTable = () => {
  const { allInventoryPO, loading, error } = useSelector(
    (state) => state.inventoryPo
  );
  const { selectedRawMaterialId } = useSelector((state) => state.batch);
  const { allBatches } = useSelector((state) => state.batch);
  const { dropDownBatchNumber } = useSelector((state) => state.dropdown);
  const [formData, setFormData] = useState({
    batchNumber: null,
    quantity: null,
  });
  const [listData, setListData] = useState([]);
  const dispatch = useDispatch();

  console.log('listData====', listData);

  console.log('formData====', formData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const numericValue = value === '' ? null : Number(value); // Convert value to a number
    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      batchNumber: dropDownBatchNumber,
    });
  }, [dropDownBatchNumber]);

  const [openIndex, setOpenIndex] = useState(null);

  const sortedMaterials = allInventoryPO.sort((a, b) => {
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
  const currentDateAndFileName = `Raise_Inventory_PO_${moment().format(
    'DD-MMM-YYYY'
  )}`;

  const convertToCSV = (data) => {
    const headers = [
      'PRODUCT NAME',
      'PRODUCT SKU CODE',
      'QUANTITY',
      'RAISED BY',
      'FULFILLED BY',
      'CREATED AT',
    ];

    const rows = data.map((po) => [
      po?.product_id?.product_name,
      po?.product_id?.sku_code,
      po?.quantity,
      `${po?.createdBy?.firstName} ${po?.createdBy?.lastName}`,
      `${po?.fulfilledBy?.firstName} ${po?.fulfilledBy?.lastName}`,
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

  const getAllBatches = async () => {
    try {
      dispatch(getAllBatchRequest());
      const response = await batchServices.getAllBatches(selectedRawMaterialId);
      if (response.success === true) {
        dispatch(getAllBatchSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllBatches();
  }, [selectedRawMaterialId]);

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
  const searchKeys = [
    'product_id',
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
              PRODUCT NAME
            </th>

            <th scope="col" class="px-6 py-3">
              PRODUCT SKU CODE
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
          </tr>
        </thead>
        {allInventoryPO?.length > 0 ? (
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
                    {po?.product_id?.product_name}
                  </th>

                  <td class="px-6 py-4">{po?.product_id?.sku_code}</td>
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

export default PoRaisedByInventoryTeamTable;
