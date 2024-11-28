'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { QrCodeServices } from '@/app/services/qrGenerate';
import GenerateQrFormEngraving from '../GenerateQRFormEngraving/GenerateQRFormEngraving';


const EngravingOrderTable = () => {
  // Fetch engraving orders from Redux store
  const { allEngravingOrders } = useSelector((state) => state.engravingOrder);

  // Sort orders by last updated date (descending)
  const sortedOrders = allEngravingOrders.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  // States
  const [filteredData, setFilteredData] = useState(sortedOrders); // Filtered orders for display
  const [modalOpen, setModalOpen] = useState(false); // View Details modal
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for modals
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isRawMaterialQRFLowSuccessfull, setIsRawMaterialQRFLowSuccessful] = useState(false);



  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);

  // Generate CSV filename with current date
  const currentDateAndFileName = `Engraving_Order_${moment().format('DD-MMM-YYYY')}`;

 

  // Update filtered data whenever orders are re-sorted
  useEffect(() => {
    setFilteredData(sortedOrders);
    setCurrentPage(1); // Reset to page 1
  }, [sortedOrders]);

  // Open and close modal functions
  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const openRawMaterialQRModal = (order) => {
    setSelectedOrder(order);
    setQrModalOpen(true);
  };

  const closeRawMaterialQRModal = () => {
    setQrModalOpen(false);
    setSelectedOrder(null);
  };

const handleRawMaterialQRFlowSuccess = (state) => {
  setIsRawMaterialQRFLowSuccessful(state);
};
  

  // Pagination controls
  const prePage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < npage) setCurrentPage(currentPage + 1);
  };

  // Format status by capitalizing words
  const formatStatus = (status) => {
    if (!status) return '';
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Convert orders to CSV format for download
  const convertToCSV = (data) => {
    const headers = [
      'ORDER ID',
      'ORDER STATUS',
      'CREATED AT',
      'ENGRAVING CONTENT',
      'SKU CODE',
      'QUANTITY',
      'INVENTORY QR CODE',
      'ENGRAVING QR CODE',
    ];

    const rows = data
      .map((order) =>
        order?.listOfProducts.map((product) => [
          order?.orderID,
          order?.status,
          order?.createdAt ? moment(order.createdAt).format('DD MMM YYYY HH:mm') : '',
          product?.engravingContent,
          product?.skuCode,
          product?.quantity,
          product?.inventory_qr_code,
          product?.engraving_qr_code,
        ])
      )
      .flat();

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
    if (isRawMaterialQRFLowSuccessfull) {
      closeRawMaterialQRModal();
      setIsRawMaterialQRFLowSuccessful(false);
    }
  }, [isRawMaterialQRFLowSuccessfull]);


  // Generate PDF for engraved QR codes
  const handleGenerateQRCode = async (order) => {
   try {
 
     if (order.status === 'outwarded_from_storage'){
      openRawMaterialQRModal(order);
     }
     else {
        const response = await QrCodeServices.generateEngravedQrPDF(order);
  
        // Create and download PDF link
        const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Engraving_Order_${order?.orderID}_QR_Codes.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
     }
   } catch (error) {
     console.error("Error generating QR Code:", error);
   }
 };



  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      {/* Download CSV button */}
      <th scope="col" className="px-6 py-3 text-right">
        <button
          onClick={() => convertToCSV(filteredData)}
          className="bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
        >
          Download CSV
        </button>
      </th>

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">ORDER ID</th>
            <th scope="col" className="px-6 py-3">STATUS</th>
            <th scope="col" className="px-6 py-3">CREATED AT</th>
            <th scope="col" className="px-6 py-3">ENGRAVING CONTENT</th>
            <th scope="col" className="px-6 py-3">SKU CODE</th>
            <th scope="col" className="px-6 py-3">QUANTITY</th>
            <th scope="col" className="px-6 py-3">VIEW ORDER PARTICULARS</th>
            <th scope="col" className="px-6 py-3">GENERATE QR CODE</th>
          </tr>
        </thead>
        <tbody>
          {records.map((order, index) => {
            return (
              <tr key={index} className={`${order.status === 'completed' ? 'bg-green-100' : ''}`}>
                <td className="px-6 py-4 font-medium text-gray-900">{order?.orderID}</td>
                <td className="px-6 py-4">{formatStatus(order?.status)}</td>
                <td className="px-6 py-4">{order?.createdAt ? moment(order?.createdAt).format('DD MMM YYYY HH:mm') : ''}</td>
                {order?.listOfProducts.map((product, idx) => (
                  <React.Fragment key={idx}>
                    <td className="px-6 py-4">{product?.engravingContent}</td>
                    <td className="px-6 py-4">{product?.skuCode}</td>
                    <td className="px-6 py-4">{product?.quantity}</td>
                  </React.Fragment>
                ))}
                <td className="px-6 py-4">
                  <button
                    onClick={() => openModal(order)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
                  >
                    View Details
                  </button>
                </td>
                 {/* New Generate QR Code button */}
                 <td className="px-6 py-4">
                {order.status !== 'pending' && (
                  <button
                    onClick={() => handleGenerateQRCode(order)}
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition duration-200"
                  >
                    Generate QR Code
                  </button>
                )}
              </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button onClick={prePage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={nextPage} disabled={currentPage === npage}>
          Next
        </button>
      </div>

      {/* View Order Particulars Modal */}
      {modalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
    <div className="bg-white p-5 rounded-lg shadow-lg max-w-4xl w-full">
      <h2 className="text-lg font-semibold mb-4 text-center">Order Particulars</h2>
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th className="px-4 py-2">SKU Code</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Engraving Content</th>
            <th className="px-4 py-2">Inventory QR Code</th>
            <th className="px-4 py-2">Engraving QR Code</th>
          </tr>
        </thead>
        <tbody>
          {selectedOrder?.listOfProducts.map((product, index) => (
            <tr key={index}>
              <td className="px-4 py-2 text-center">{product.skuCode}</td>
              <td className="px-4 py-2 text-center">{product.quantity}</td>
              <td className="px-4 py-2 text-center">{product.engravingContent}</td>
              <td className="px-4 py-2 text-center">{product.inventory_qr_code.join(', ')}</td>
              <td className="px-4 py-2 text-center">{product.engraving_qr_code.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-center">
        <button
          onClick={closeModal}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{qrModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
    <div className="bg-white p-5 rounded-lg shadow-lg w-4/5 max-w-full max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Generate QR Code</h2>
        <button
          onClick={() => {closeRawMaterialQRModal()}}  
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Close
        </button>
      </div>
      {/* Child Component (Dynamic content will be rendered here) */}
      <GenerateQrFormEngraving selectedOrder={selectedOrder} isFlowSuccessful={handleRawMaterialQRFlowSuccess}/>
    </div>
  </div>
)}




    </div>
  );
};

export default EngravingOrderTable;

