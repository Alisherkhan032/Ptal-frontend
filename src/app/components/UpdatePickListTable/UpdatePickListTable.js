'use client';
import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { useSelector } from 'react-redux';
import { pickListServices } from '@/app/services/pickListService';
import Link from 'next/link';
import moment from 'moment';
import SearchBar from '../SearchBar/SearchBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';

const UpdatePickListTable = () => {
  const router = useRouter();
  const { allpickListData } = useSelector((state) => state.pickList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [filterLast24Hours, setFilterLast24Hours] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  

  const sortedMaterials = allpickListData.sort((a, b) => {
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
  const currentDateAndFileName = `Outward_PickList_${moment().format(
    'DD-MMM-YYYY'
  )}`;
  const convertToCSV = (data) => {
    const headers = [
      'PICKLIST NUMBER',
      'NUMBER OF ORDERS PROCESSED',
      'CREATED BY',
    ];

    const rows = data.map((picklist) => [
      picklist?.pickListumber,
      picklist?.orderIds.length,
      `${picklist?.createdBy?.firstName} ${picklist?.createdBy?.lastName}`,
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

  const filterByLast24Hours = () => {
    const currentTime = moment();
    const filteredData = sortedMaterials.filter(picklist => {
      const updatedAt = moment(picklist.updatedAt);
      return currentTime.diff(updatedAt, 'hours') <= 24;
    });
    setFilteredData(filteredData);
  };

  const handleFilterLast24Hours = () => {
    setFilterLast24Hours(true);
    setSelectedDate(null); // Reset selected date filter
    filterByLast24Hours();
  };
  
  const handleDateChange = date => {
    setSelectedDate(date);
    setFilterLast24Hours(false); // Reset last 24 hours filter
    filterBySelectedDate();
  };
  
  
  const filterBySelectedDate = () => {
    if (selectedDate) {
      const filteredData = sortedMaterials.filter(picklist => {
        const updatedAt = moment(picklist.updatedAt).startOf('day');
        return updatedAt.isSame(selectedDate, 'day');
      });
      setFilteredData(filteredData);
    }
  };
  

  useEffect(() => {
    if (filterLast24Hours) {
      filterByLast24Hours();
    } else if (selectedDate) {
      filterBySelectedDate();
    } else {
      setFilteredData(sortedMaterials);
    }
    setCurrentPage(1);
  }, [sortedMaterials, filterLast24Hours, selectedDate]);
  
  const handleSearch = (data) => {
    setFilteredData(data);
    setCurrentPage(1);
  };

  const handleViewData = () => {
    // Extract all IDs from filteredData
    const ids = filteredData.map(picklist => picklist._id);
  
    // // Navigate to the new page with the IDs as a query parameter
    // router.push({
    //   pathname: '/inventory/outward_picklist/view_data/page', 
    //   query: { ids: ids.join(',') } // Convert IDs array to a comma-separated string
    // });
    router.push(`/inventory/outward_picklist/view_data/page?ids=${ids.join(',')}`);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

  const searchKeys = ['pickListumber', 'orderIds', 'createdBy'];

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
       <div className="p-4 flex justify-between items-center border border-dashed bg-gray-100 rounded-lg">
          {/* Search Bar */}
          <SearchBar
            tableData={sortedMaterials}
            searchKeys={searchKeys}
            onSearch={handleSearch}
          />

          {/* Last 24 Hours Button */}
          <button
            onClick={handleFilterLast24Hours}
            className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg"
          >
            Last 24 Hours
          </button>

          {/* Date Picker */}
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="px-4 py-2 text-sm font-semibold bg-white border rounded-lg"
          />

          {/* Download CSV Button */}
          <button
            onClick={() => convertToCSV(sortedMaterials)}
            className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-lg"
          >
            Download CSV
          </button>

          {/* View Data Button */}
          <button
            onClick={handleViewData}
            className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg"
          >
            View Data
          </button>
        </div>
      {/* Modal for uploading CSV */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Upload CSV</h2>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mb-4"
            />
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              Close
            </button>

            {loading ? (
              <p>File is uploading please wait</p>
            ) : (
              <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Upload
              </button>
            )}
            {message && (
              <p
                style={{ color: message.startsWith('Error') ? 'red' : 'green' }}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}

      <table
        className={` w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400`}
      >
        <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]  dark:text-gray-400">
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
              PICKLIST NUMBER
            </th>
            <th scope="col" className="px-6 py-3">
              NUMBER OF ORDERS PROCESSED
            </th>
            <th scope="col" className="px-6 py-3">
              CREATED AT
            </th>
            <th scope="col" className="px-6 py-3">
              UPDATED AT
            </th>

            <th scope="col" className="px-6 py-3">
              CREATED BY
            </th>
            <th scope="col" className="px-6 py-3">
              ACTION
            </th>
          </tr>
        </thead>

        {allpickListData?.length > 0 ? (
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
              records.map((picklist, index) => (
                <tr
                  id={index}
                  className={`${
                    picklist.status === 'fulfilled'
                      ? 'bg-green-100'
                      : 'bg-white'
                  } border-b-[0.15vw]  border-dashed border-[rgb(248,246,242)]  dark:border-[rgb(248,246,242)] `}
                  key={picklist._id}
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-table-search-${picklist._id}`}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor={`checkbox-table-search-${picklist._id}`}
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
                    {picklist?.pickListumber}
                  </th>
                  <td className="px-6 py-4">{picklist?.orderIds.length}</td>
                  <td className="px-6 py-4"> {moment(picklist?.createdAt).format('MMMM DD YYYY, hh:mm:ss ')}</td>
                  <td className="px-6 py-4"> {moment(picklist?.updatedAt).format('MMMM DD YYYY, hh:mm:ss ')}</td>
                  <td className="px-6 py-4">
                    {picklist?.createdBy?.firstName}{' '}
                    {picklist?.createdBy?.lastName}
                  </td>
                  <td>
                    {picklist.status !== 'fulfilled' ? (
                      <Link
                        href={`/inventory/outward_picklist/fullfill_picklist/${picklist?._id}`}
                        key={picklist?._id}
                      >
                        <button
                          id="fulfillButton"
                          className="text-[rgb(144,138,129)] bg-[rgb(248,246,242)] hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center justify-center"
                          type="button"
                          style={{ minWidth: '120px', textAlign: 'center' }} 
                        >
                          Fulfill
                        </button>
                      </Link>
                    ) : (
                      <Link
                        href={`/inventory/outward_picklist/view_details/${picklist?._id}`}
                        key={picklist?._id}
                      >
                        <button
                          className="text-[rgb(144,138,129)] bg-[rgb(248,246,242)] hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center justify-center"
                          type="button"
                          style={{ minWidth: '120px', textAlign: 'center' }} 
                        >
                          View Details
                        </button>
                      </Link>
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

export default UpdatePickListTable;
