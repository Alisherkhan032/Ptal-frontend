'use client';
import React, { useState, useEffect } from 'react';
import { engravingOrderServices } from '@/app/services/engravingOrderService';
import moment from 'moment';
import SearchBar from '../SearchBar/SearchBar';

// Modal Component
const Modal = ({ isOpen, onClose, productName, inProgress, engravedAndOutwarded }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4">Details for {productName}</h2>
        <div>
          <h3 className="font-semibold mb-2">In Progress QR Codes:</h3>
          <ul className="list-disc ml-5 mb-4">
            {inProgress.map((qr, index) => (
              <li key={index} className="text-sm text-gray-600">{qr}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Engraved And Outwarded QR Codes:</h3>
          <ul className="list-disc ml-5">
            {engravedAndOutwarded.map((qr, index) => (
              <li key={index} className="text-sm text-gray-600">{qr}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="inline-flex items-center bg-red-500 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EngravingInventoryLevel = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);

  // Fetch data from the API
  useEffect(() => {
    const fetchInventoryLevels = async () => {
      try {
        const response = await engravingOrderServices.getEngravingInventoryLevels();
        if (response.success) {
          setInventoryData(response.data);
          setFilteredData(response.data);
        } else {
          console.error('Error fetching inventory levels:', response.message);
        }
      } catch (error) {
        console.error('API error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryLevels();
  }, []);

  // Function to open the modal and set the selected product
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSearch = (data) => {
    setFilteredData(data);
    setCurrentPage(1);
  };

  // CSV Export
  const convertToCSV = (data) => {
    const headers = ['PRODUCT NAME', 'IN PROGRESS COUNT', 'ENGRAVED AND OUTWARDED COUNT'];
    const rows = data.map((item) => [
      item.product_name,
      item.in_progress.length,
      item.engraved_and_outwarded.length,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Engraving_Inventory_${moment().format('DD-MMM-YYYY')}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination
  const prePage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < npage && setCurrentPage(currentPage + 1);
  const chageCPage = (id) => setCurrentPage(id);

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)]">
        <SearchBar tableData={inventoryData} searchKeys={['product_name']} onSearch={handleSearch} />
        <button
          onClick={() => convertToCSV(filteredData)}
          className="relative z-10 inline-flex items-center bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
        >
          Download CSV
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]">
            <tr>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">In Progress Count</th>
              <th className="px-6 py-3">Engraved And Outwarded Count</th>
              <th className="px-6 py-3">View Details</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-5 font-semibold text-red-300">
                  No products found!
                </td>
              </tr>
            ) : (
              records.map((item, index) => (
                <tr key={index} className="bg-white border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] hover:bg-gray-50">
                  <td className="px-6 py-4">{item.product_name}</td>
                  <td className="px-6 py-4">{item.in_progress.length}</td>
                  <td className="px-6 py-4">{item.engraved_and_outwarded.length}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="text-[rgb(144,138,129)] bg-[rgb(248,246,242)] hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <nav className="p-[1vw] flex">
        <ul className="pagination flex gap-[1vw]">
          <li>
            <button onClick={prePage} className="px-4 py-2 bg-gray-200 rounded">Prev</button>
          </li>
          {[...Array(npage).keys()].map((_, idx) => (
            <li key={idx}>
              <button
                onClick={() => chageCPage(idx + 1)}
                className={`px-4 py-2 ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {idx + 1}
              </button>
            </li>
          ))}
          <li>
            <button onClick={nextPage} className="px-4 py-2 bg-gray-200 rounded">Next</button>
          </li>
        </ul>
      </nav>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        productName={selectedProduct?.product_name}
        inProgress={selectedProduct?.in_progress || []}
        engravedAndOutwarded={selectedProduct?.engraved_and_outwarded || []}
      />
    </div>
  );
};

export default EngravingInventoryLevel;
