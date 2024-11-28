'use client';
import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../Input/Input';
import { poServices } from '@/app/services/poService';
import SearchBar from '../SearchBar/SearchBar';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FulfilledProcurementPOTable = () => {
  const { allPO, loading, error } = useSelector((state) => state.po);
  const [openIndex, setOpenIndex] = useState(null);
 
  const sortedMaterials = allPO
  .filter((po) => po.status === 'fulfilled') // Only include POs where status is 'fulfilled'
  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));



  const [filteredData, setFilteredData] = useState(sortedMaterials);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);
  const currentDateAndFileName = `Inward_Procurement_PO_${moment().format(
    'DD-MMM-YYYY'
  )}`;

  const convertToCSV = (data) => {
    const headers = [
      'CREATED AT',
      'VENDOR NAME',
      'PO NUMBER',
      'QUANTITY',
      'RAW MATERIAL NAME',
      'GRN',
      'RAISED BY',
    ];

    const rows = data.map((po) => [
      moment(po?.createdAt).format('DD MMM YYYY'),
      po?.vendor_id?.vendor_name,
      po?.po_number,
      po?.quantity,
      po?.raw_material_id?.material_name,
      po?.grn_number,
      `${po?.created_by?.firstName} ${po?.created_by?.lastName}`,
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
    const sortedMaterials = allPO
      .filter((po) => po.status === 'fulfilled') // Only include POs where status is 'fulfilled'
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
    setFilteredData(sortedMaterials);
    setCurrentPage(1);
  }, [allPO]);

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

  const searchKeys = [
    'vendor_id',
    'po_number',
    'quantity',
    'raw_material_id',
    'grn_number',
    'quantity',
  ];

  return (
    <div class="relative overflow-x-auto    sm:rounded-lg">
      <div class="p-[2vw] w-full flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)]  dark:border-[rgb(248,246,242)]  ">
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
           
            <th scope="col" class="px-6 py-3">
              CREATED AT
            </th>
            <th scope="col" class="px-6 py-3">
              FULFILLED AT
            </th>
            <th scope="col" class="px-6 py-3">
              VENDOR NAME
            </th>
            <th scope="col" class="px-6 py-3">
              PO NUMBER
            </th>
            <th scope="col" class="px-6 py-3">
              BILL NUMBER
            </th>
            <th scope="col" class="px-6 py-3">
              QUANTITY
            </th>
            <th scope="col" class="px-6 py-3">
              RAW MATERIAL NAME
            </th>
            <th scope="col" class="px-6 py-3">
              GRN
            </th>

            <th scope="col" class="px-6 py-3">
              RAISED BY
            </th>
          </tr>
        </thead>
        {allPO?.length > 0 ? (
          <tbody>
             { records.length === 0? (
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
                  className={`${
                     'bg-white'
                  } border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)]`}
                >
                 
                  <td className="px-6 py-4">
                    {moment(po?.createdAt).format('DD MMM YYYY HH:MM:SS')}
                  </td>
                  <td className="px-6 py-4">
                    {moment(po?.updatedAt).format('DD MMM YYYY HH:MM:SS')}
                  </td>
                  <td className="px-6 py-4">{po?.vendor_id?.vendor_name}</td>
                  <td className="px-6 py-4">{po?.po_number}</td>
                  <td className="px-6 py-4">{po?.bill_number}</td>
                  <td className="px-6 py-4">{po?.quantity}</td>
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-[rgb(153,142,125)] max-w-[20vw]"
                  >
                    {po?.raw_material_id?.material_name}
                  </th>
                  <td className="px-6 py-4">{po?.grn_number}</td>

                  <td className="px-6 py-4">
                    {po?.created_by?.firstName} {po?.created_by?.lastName}
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

export default FulfilledProcurementPOTable;
