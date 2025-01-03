'use client';
import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { orderServices } from '@/app/services/oderService';
import { useSelector } from 'react-redux';
import moment from 'moment';
import SearchBar from '../SearchBar/SearchBar';

const OrderTable = () => {
  const { allAmazonOrders } = useSelector((state) => state.order);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEcomModalOpen, setIsEcomModalOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sortedMaterials = allAmazonOrders.sort((a, b) => {
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

  const currentDateAndFileName = `Inward_Order_${moment().format(
    'DD-MMM-YYYY'
  )}`;

  const convertToCSV = (data) => {
    const headers = [
      'ORDER ID',
      'ORDER DATE',
      'BATCH ID',
      'AWB NUMBER',
      'PLATFORM',
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

  const handleAmazonButtonClick = () => {
    setIsModalOpen(true);
  };
  const handleEasyEcomButtonClick = () => {
    setIsEcomModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEcomCloseModal = () => {
    setIsEcomModalOpen(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('amazonCSV', file); // Change the field name here

      setLoading(true);
      setMessage('');
      // Log FormData just before making the API call
      console.log('formData just before API call:', formData);

      const response = await orderServices.uploadCSVFile(formData);
      console.log('response====', response);
      if (response.success === true) {
        setMessage(response.message);
        window.location.reload();
      } else {
        setMessage('Error: ' + response.message);
      }
      setIsModalOpen(false); // Close the modal on successful upload
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadEasyEcom = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('amazonCSV', file); // Change the field name here

      setLoading(true);
      setMessage('');
      // Log FormData just before making the API call
      console.log('formData just before API call:', formData);

      const response = await orderServices.uploadCSVFileByEasyEcom(formData);
      console.log('response====', response);
      if (response.success === true) {
        setMessage(response.message);
        window.location.reload();
      } else {
        setMessage('Error: ' + response.message);
      }

      setIsEcomModalOpen(false); // Close the modal on successful upload
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred');
    } finally {
      setLoading(false);
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

  const searchKeys = [
    'status',
    'orderId',
    'orderDate',
    'AWB',
    'platform',
    'status',
    'batchID'
  ];

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)]">
        {/* search item button */}
        <SearchBar
          tableData={sortedMaterials}
          searchKeys={searchKeys}
          onSearch={handleSearch}
        />

        {/* po raise button */}
        <div className="flex gap-5 ">
          <div onClick={handleEasyEcomButtonClick}>
            <Button
              title={'Easy Ecom'}
              bgColor={'bg-[rgb(79,201,218)]'}
              radius={'rounded-lg'}
              height={'h-[3vw] min-h-[3vh]'}
              padding={'p-[1vw]'}
              color={'text-[#ffff]'}
              textSize={'text-[1vw]'}
              fontWeight={'font-medium'}
              width={'w-[10vw]'}
            />
          </div>
          <div onClick={handleAmazonButtonClick}>
            <Button
              title={'Amazon'}
              bgColor={'bg-[rgb(79,201,218)]'}
              radius={'rounded-lg'}
              height={'h-[3vw] min-h-[3vh]'}
              padding={'p-[1vw]'}
              color={'text-[#ffff]'}
              textSize={'text-[1vw]'}
              fontWeight={'font-medium'}
              width={'w-[10vw]'}
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
      {/* Modal for uploading amazon CSV */}
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

      {/* Modal for uploading EasyEcom CSV */}
      {isEcomModalOpen && (
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
              onClick={handleEcomCloseModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              Close
            </button>

            {loading ? (
              <p>File is uploading please wait</p>
            ) : (
              <button
                onClick={handleUploadEasyEcom}
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

      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]  dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              ORDER ID
            </th>
            <th scope="col" class="px-6 py-3">
              ORDER DATE
            </th>
            <th scope="col" class="px-6 py-3">
              BATCH ID
            </th>
            <th scope="col" class="px-6 py-3">
              AWB NUMBER
            </th>
            <th scope="col" class="px-6 py-3">
              PLATFORM
            </th>
            <th scope="col" class="px-6 py-3">
              STATUS
            </th>
          </tr>
        </thead>

        {allAmazonOrders?.length > 0 ? (
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
                  className={`${order.status === 'open' && 'bg-white'} ${
                    order.status === 'picked' && 'bg-green-100'
                  } ${
                    order.status === 'closed' && 'bg-red-100'
                  }   border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]  dark:border-[rgb(248,246,242)] `}
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-[hsl(36,12%,55%)] whitespace-nowrap "
                  >
                    {order?.orderId}
                  </th>
                  <td class="px-6 py-4">{order?.orderDate}</td>
                  <td class="px-6 py-4">{order?.batchID}</td>
                  <td className="px-6 py-4">
                    {order?.AWB?.map((awb, index) => (
                      <div key={index}>{awb}</div>
                    ))}
                  </td>
                  <td class="px-6 py-4">{order?.platform}</td>
                  <td class="px-6 py-4">{order?.status}</td>
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

export default OrderTable;
