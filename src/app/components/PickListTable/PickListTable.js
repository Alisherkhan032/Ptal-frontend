'use client';
import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { orderServices } from '@/app/services/oderService';
import { useSelector } from 'react-redux';
import { pickListServices } from '@/app/services/pickListService';
import moment from 'moment';
import SearchBar from '../SearchBar/SearchBar';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const PickListTable = () => {
  const { allAmazonOrders, allOpenOrders } = useSelector(
    (state) => state.order
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [formDisabled, setFormDisabled] = useState(false); // State to disable form interactions
  
  const sortedMaterials = allOpenOrders.sort((a, b) => {
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
  const currentDateAndFileName = `Create_PickList_${moment().format(
    'DD-MMM-YYYY'
  )}`;

  const convertToCSV = (data) => {
    const headers = [
      'ORDER ID',
      'ORDER DATE',
      'BATCH ID',
      'AWB NUMBER',
      'PLATFORME',
      'STATUS',
    ];

    const rows = data.map((order) => [
      order?.orderId,
      order?.orderDate,
      order?.batchID,
      order?.AWB?.map((awb, index) => awb),
      order?.platform,
      order?.status,
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

  const handleSubmit = async () => {
    try {
      const response = await pickListServices.createPickList(selectedOrderIds);
      if (response.success === true) {
        toast.success(`Picklist Created Successfully!`, {
          autoClose: 1500,
          onClose: () => window.location.reload(),
        });
        setFormDisabled(true); // Disable form interactions when toaster is shown
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrderIds((prevSelectedOrderIds) => {
      if (prevSelectedOrderIds.includes(orderId)) {
        return prevSelectedOrderIds.filter((id) => id !== orderId);
      } else {
        return [...prevSelectedOrderIds, orderId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = records.map((order) => order._id);
      setSelectedOrderIds(allIds);
    } else {
      setSelectedOrderIds([]);
    }
  };

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

  const searchKeys = ['orderId', 'orderDate', 'AWB', 'platform', 'status', 'batchID'];

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
        <ToastContainer />
      <div className="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)]">
        {/* search item button */}
        <SearchBar
          tableData={sortedMaterials}
          searchKeys={searchKeys}
          onSearch={handleSearch}
        />

        {/* po raise button */}
        <div className="flex gap-5 ">
          <div onClick={handleSubmit}>
            <Button
              title={'Create Pick List'}
              bgColor={'bg-[rgb(79,201,218)]'}
              radius={'rounded-lg'}
              height={'h-[3vw] min-h-[3vh]'}
              padding={'p-[1vw]'}
              color={'text-[#ffff]'}
              textSize={'text-[1vw]'}
              fontWeight={'font-medium'}
              width={'w-[10vw]'}
              disabled={formDisabled} // Disable if form is submitted or toaster shown
            />
          </div>
          <button
            onClick={() => convertToCSV(sortedMaterials)}
            className="relative z-10 inline-flex items-center bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
          >
            Download CSV
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]  dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  onChange={handleSelectAll}
                  checked={selectedOrderIds.length === records.length}
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              ORDER ID
            </th>
            <th scope="col" className="px-6 py-3">
              ORDER DATE
            </th>
            <th scope="col" className="px-6 py-3">
              BATCH ID
            </th>
            <th scope="col" className="px-6 py-3">
              AWB NUMBER
            </th>
            <th scope="col" className="px-6 py-3">
              PLATFORM
            </th>
            <th scope="col" className="px-6 py-3">
              STATUS
            </th>
          </tr>
        </thead>

        {allOpenOrders?.length > 0 ? (
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
              records.map((order, index) => (
                <tr
                  id={index}
                  className="bg-white border-b-[0.15vw]  border-dashed border-[rgb(248,246,242)]  dark:border-[rgb(248,246,242)] hover:bg-gray-50 "
                  key={order._id}
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-table-search-${order._id}`}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                        checked={selectedOrderIds.includes(order._id)}
                        onChange={() => handleCheckboxChange(order._id)}
                      />
                      <label
                        htmlFor={`checkbox-table-search-${order._id}`}
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-[hsl(36,12%,55%)] whitespace-nowrap "
                  >
                    {order?.orderId}
                  </th>
                  <td className="px-6 py-4">{order?.orderDate}</td>
                  <td className="px-6 py-4">{order?.batchID}</td>
                  <td className="px-6 py-4">
                    {order?.AWB?.map((awb, index) => (
                      <div key={index}>{awb}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4">{order?.platform}</td>
                  <td className="px-6 py-4">{order?.status}</td>
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
        {/* Overlay to prevent user interaction */}
    {formDisabled && (
      <div
        className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
        style={{ zIndex: 1000 }}
      />
    )}
    </div>
  );
};

export default PickListTable;
