import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import SearchBar from '../SearchBar/SearchBar';
import Button from '../Button/Button';
import { rawMaterialServices } from '@/app/services/rawMaterialService';

const RtoOrderTable = () => {
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  // Fetch all RTO orders
  const { orders } = useSelector((state) => state.rtoOrder);


  // Sort orders by updated date
  const sortedOrders = orders.sort((a, b) => {
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
      'SOURCE PLATFORM',
      'LOGISTICS PARTNER',
      'RETURNED ITEMS',
      'CREATED AT',
    ];

    const rows = data.map((order) => [
      order?.orderId,
      order?.awbNumber || '',
      order?.sourcePlatform || '',
      order?.logisticsPartner || '',
      order?.returnedItems.map((item) => `${item.sku}: ${item.quantity}`).join(', ') || '',
      moment(order?.createdAt).format('DD MMM YYYY') || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const currentDateAndFileName = `RTO_Orders_${moment().format(
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
    'sourcePlatform',
    'logisticsPartner',
    'returnedItems.sku',
    'returnedItems.quantity',
  ];

  const handleOpenModal = async (order) => {
    const detailedItems = await Promise.all(
      order.returnedItems.map(async (item) => {
        try {
          const response = await rawMaterialServices.getSkuCodeById(item.sku);

          return { ...item, sku: response.data.sku_code };
        } catch (error) {
          console.error('Error fetching SKU code:', error);
          return item; // fallback to original item in case of error
        }
      })
    );
    setModalData({ ...order, returnedItems: detailedItems });
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
          onClick={() => convertToCSV(orders)}
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
            <th className="px-6 py-3">SOURCE PLATFORM</th>
            <th className="px-6 py-3">LOGISTICS PARTNER</th>
            <th className="px-6 py-3">VIEW RETURNED ITEM INFO</th>
            <th className="px-6 py-3">CREATED AT</th>
          </tr>
        </thead>
        {orders?.length > 0 ? (
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-5 font-semibold text-red-300">
                  No RTO orders found!
                </td>
              </tr>
            ) : (
              records.map((order, index) => (
                <tr
                  key={index}
                  className={`${
                    order.status === 'returned' ? 'bg-yellow-100' : 'bg-white'
                  } border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]`}
                >
                  <td className="px-6 py-4">{order?.orderId}</td>
                  <td className="px-6 py-4">{order?.awbNumber}</td>
                  <td className="px-6 py-4">{order?.sourcePlatform}</td>
                  <td className="px-6 py-4">{order?.logisticsPartner}</td>
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
                    {moment(order?.createdAt).format('DD MMM YYYY HH:mm')}
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
              <h2 className="text-lg font-bold mb-4">Returned Items Details</h2>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]">
                  <tr>
                    <th className="px-6 py-3">SKU CODE</th>
                    <th className="px-6 py-3">QUANTITY</th>
                  </tr>
                </thead>
                <tbody>
                  {modalData?.returnedItems.map((item, idx) => (
                    <tr key={idx} className="bg-white border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] hover:bg-gray-50">
                      <td className="px-6 py-4">{item.sku}</td>
                      <td className="px-6 py-4">{item.quantity}</td>
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
  
  export default RtoOrderTable;
  
