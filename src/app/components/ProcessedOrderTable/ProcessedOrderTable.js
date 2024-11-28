import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import SearchBar from '../SearchBar/SearchBar';
import Button from '../Button/Button';

const ProcessedOrderTable = () => {
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  // Fetch all processed orders
  const { allOrderDetails } = useSelector((state) => state.orderDetail);
  console.log("🚀 ~ ProcessedOrderTable ~ allOrderDetails:", allOrderDetails);

  // Sort orders by updated date
  const sortedOrders = allOrderDetails.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedOrders);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  useEffect(() => {
    setFilteredData(sortedOrders);
    setCurrentPage(1);
  }, [sortedOrders]);

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

  const convertToCSV = (data) => {
    const headers = [
      'ORDER ID',
      'AWB NUMBER',
      'REFERENCE CODE',
      'FULFILLED SKU CODES',
      'FULFILLED QR CODES',
      'UPDATED AT',
    ];

    const rows = data.map((order) => [
      order?.orderId,
      order?.awbNumber || '',
      order?.referenceCode || '',
      order?.fulfilledQRCodes.map((item) => item.skuCode).join(', ') || '',
      order?.fulfilledQRCodes.map((item) => item.qrCode).join(', ') || '',
      moment(order?.updatedAt).format('DD MMM YYYY') || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const currentDateAndFileName = `Processed_Orders_${moment().format(
      'DD-MMM-YYYY'
    )}.csv`;
    link.setAttribute('download', currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const searchKeys = [
    'orderId',
    'awbNumber',
    'referenceCode',
    'fulfilledQRCodes.skuCode',
    'fulfilledQRCodes.qrCode',
  ];

  const handleOpenModal = (order) => {
    setModalData(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)]">
        <SearchBar
          tableData={sortedOrders}
          searchKeys={searchKeys}
          onSearch={handleSearch}
        />
        <button
          onClick={() => convertToCSV(allOrderDetails)}
          className="relative z-10 inline-flex items-center bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
        >
          Download CSV
        </button>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]">
          <tr>
            <th className="px-6 py-3">ORDER ID</th>
            <th className="px-6 py-3">AWB NUMBER</th>
            <th className="px-6 py-3">REFERENCE CODE</th>
            <th className="px-6 py-3">VIEW FULFILLED QR CODE INFO</th>
            <th className="px-6 py-3">UPDATED AT</th>
          </tr>
        </thead>
        {allOrderDetails?.length > 0 ? (
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-5 font-semibold text-red-300">
                  No orders found!
                </td>
              </tr>
            ) : (
              records.map((order, index) => (
                <tr
                  key={index}
                  className={`${
                    order.status === 'fulfilled' ? 'bg-green-100' : 'bg-white'
                  } border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]`}
                >
                  <td className="px-6 py-4">{order?.orderId}</td>
                  <td className="px-6 py-4">{order?.awbNumber}</td>
                  <td className="px-6 py-4">{order?.referenceCode}</td>
                  <td className="px-6 py-4">
                    <button
                      id="dropdownHoverButton"
                      className="text-[rgb(144,138,129)] bg-[rgb(248,246,242)] hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                      type="button"
                      onClick={() => handleOpenModal(order)}
                    >
                      View Details
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {moment(order?.updatedAt).format('DD MMM YYYY HH:mm')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        ) : (
          <div>Loading...</div>
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
          {numbers.map((n, i) => (
            <li key={i} className="page-item">
              <a
                href="#"
                onClick={() => chageCPage(n)}
                className={`relative z-10 inline-flex items-center bg-white border rounded-lg px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)] ${currentPage === n ? ' text-black' : 'hover:bg-gray-50'}`}
              >
                {n}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              onClick={nextPage}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4">Order Details</h2>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]">
                <tr>
                  <th className="px-6 py-3">SKU CODE</th>
                  <th className="px-6 py-3">QR CODE</th>
                </tr>
              </thead>
              <tbody>
                {modalData?.fulfilledQRCodes.map((item, idx) => (
                  <tr key={idx} className="bg-white border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] hover:bg-gray-50">
                    <td className="px-6 py-4">{item.skuCode}</td>
                    <td className="px-6 py-4">{item.qrCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="inline-flex items-center bg-red-500 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessedOrderTable;

