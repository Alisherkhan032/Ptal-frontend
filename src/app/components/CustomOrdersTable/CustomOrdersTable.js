'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { orderServices } from '@/app/services/oderService';

const CustomOrderTable = () => {
  const { allCustomOrders } = useSelector((state) => state.order);

  const sortedMaterials = allCustomOrders.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  const [filteredData, setFilteredData] = useState(sortedMaterials);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrderData, setEditOrderData] = useState({});

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);

  const currentDateAndFileName = `Custom_Order_${moment().format('DD-MMM-YYYY')}`;

  // Convert data to CSV
  const convertToCSV = (data) => {
    const headers = [
      'ORDER ID',
      'ORDER TITLE',
      'CREATED AT',
      'ORDER DATE',
      'SCHEDULED DISPATCH DATE',
      'PLATFORM/MODE',
      'NUMBER OF DISTINCT SKU',
      'DESIRED QUANTITY',
      'FULFILLED QUANTITY',
      'RETAILER',
      'LOCATION',
      'TRACKING NUMBER',
      'STATUS',
      'FULFILLED AT',
      'REMARKS',
    ];
  
    const rows = data.map((order) => {
      const totalQuantity = order?.listOfProducts.reduce((acc, product) => acc + product.quantity, 0);
      const totalFulfilledQuantity = order?.listOfProducts.reduce((acc, product) => acc + (product.fulfilledQuantity || 0), 0);
  
      return [
        order?.orderId,
        order?.orderTitle,
        order?.createdAt ? moment(order.createdAt).format('DD MMM YYYY HH:mm') : '',
        order?.orderDate ? moment(order.orderDate).format('DD MMM YYYY') : '',
        order?.scheduledDispatchDate ? moment(order.scheduledDispatchDate).format('DD MMM YYYY') : '',
        order?.platform,
        order?.listOfProducts.length,
        totalQuantity,
        totalFulfilledQuantity,
        order?.retailer,
        order?.location,
        order?.trackingNumber,
        order?.status,
        order?.fulfilledAt ? moment(order.fulfilledAt).format('DD MMM YYYY HH:mm') : '',
        order?.remarks,
      ];
    });
  
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
  
  // Handle page change
  const prePage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < npage) setCurrentPage(currentPage + 1);
  };

  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setFilteredData(sortedMaterials);
    setCurrentPage(1);
  }, [sortedMaterials]);

  // Modal functions
  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  // Edit modal functions
  const openEditModal = (order) => {
    setEditOrderData({
      orderInternalId: order._id,
      orderId: order.orderId,
      orderTitle: order.orderTitle,
      trackingNumber: order.trackingNumber,
      remarks: order.remarks,
      status: order.status,
      // Include other fields you want to edit based on your schema
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditOrderData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
console.log ("data =====",editOrderData);
    const result = await orderServices.editOrderByOrderInternalId(editOrderData);
    if (result.success) {
      alert('Order updated successfully!');
      closeEditModal();
    } else {
      alert('Failed to update order: ' + result.error);
    }

  };

  function formatStatus(status) {
    if (!status) return status;
  
    // Replace underscores with spaces and split the string into words
    const words = status.replace(/_/g, ' ').split(' ');
  
    // Capitalize the first letter of each word
    const formattedWords = words.map(
      word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  
    // Join the words back into a single string
    return formattedWords.join(' ');
  }
  

  // Handle Delete Order
const handleDeleteOrder = async (orderId) => {
  const confirmation = window.confirm(
    'Are you sure you want to delete this order? This action is irreversible.'
  );

  if (confirmation) {
    try {
      const result = await orderServices.deleteOrderByOrderId(orderId);
   
      if (result.success) {
        alert('Order deleted successfully!');
        closeEditModal();
        window.location.reload();
        // Optionally, refresh orders if needed
      } else {
        alert('Failed to delete order: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
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
            <th scope="col" className="px-6 py-3">ORDER TITLE</th>
            <th scope="col" className="px-6 py-3">CREATED AT</th>
            <th scope="col" className="px-6 py-3">ORDER DATE</th>
            <th scope="col" className="px-6 py-3">SCHEDULED DISPATCH DATE</th>
            <th scope="col" className="px-6 py-3">PLATFORM/MODE</th>
            <th scope="col" className="px-6 py-3">NUMBER OF DISTINCT SKU</th>
            <th scope="col" className="px-6 py-3">DESIRED QUANTITY</th>
            <th scope="col" className="px-6 py-3">FULFILLED QUANTITY</th>
            <th scope="col" className="px-6 py-3">RETAILER</th>
            <th scope="col" className="px-6 py-3">LOCATION</th>
            <th scope="col" className="px-6 py-3">TRACKING NUMBER</th>
            <th scope="col" className="px-6 py-3">STATUS</th>
            <th scope="col" className="px-6 py-3">FULFILLED AT</th>
            <th scope="col" className="px-6 py-3">REMARKS</th>
            <th scope="col" className="px-6 py-3">VIEW ORDER PARTICULARS</th>
            <th scope="col" className="px-6 py-3">EDIT ORDER</th>
          </tr>
        </thead>
        <tbody>
          {records.map((order, index) => {
            const totalQuantity = order?.listOfProducts.reduce((accumulator, product) => {
              return accumulator + product.quantity;
            }, 0);
            const totalfulfilledQuantity = order?.listOfProducts.reduce((accumulator, product) => {
              return accumulator + (product.fulfilledQuantity || 0);
            }, 0);
            return (
              <tr
                key={index}
                className={`${order.status === 'open' ? 'bg-white' : ''} ${order.status === 'shipped' ? 'bg-green-100' : order.status === 'partially_processed' ? 'bg-yellow-50' : ''}
`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">{order?.orderId}</td>
                <td className="px-6 py-4">{order?.orderTitle}</td>
                <td className="px-6 py-4">{order?.createdAt ? moment(order?.createdAt).format('DD MMM YYYY HH:mm') : ''}</td>
                <td className="px-6 py-4">{order?.orderDate ? moment(order?.orderDate).format('DD MMM YYYY') : ''}</td>
                <td className="px-6 py-4">{order?.scheduledDispatchDate ? moment(order?.scheduledDispatchDate).format('DD MMM YYYY') : ''}</td>
                <td className="px-6 py-4">{order?.platform}</td>
                <td className="px-6 py-4">{order?.listOfProducts.length}</td>
                <td className="px-6 py-4">{totalQuantity}</td>
                <td className="px-6 py-4">{totalfulfilledQuantity}</td>
                <td className="px-6 py-4">{order?.retailer}</td>
                <td className="px-6 py-4">{order?.location}</td>
                <td className="px-6 py-4">{order?.trackingNumber}</td>
                <td className="px-6 py-4">{formatStatus(order?.status)}</td>
                <td className="px-6 py-4">{order?.fulfilledAt ? moment(order?.fulfilledAt).format('DD MMM YYYY HH:mm') : ''}</td>
                <td className="px-6 py-4">{order?.remarks}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openModal(order)}
 className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
                  >
                    View Details
                  </button>
                </td>
                <td className="px-6 py-4">
  <button
    onClick={() => openEditModal(order)}
    className={`bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-200 ${
      order.status === 'shipped' ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    disabled={order.status === 'shipped'} // Disable button if the order is fulfilled
  >
    Edit Order
  </button>
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Order Particulars</h2>
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th className="px-4 py-2">SKU Code</th>
                  <th className="px-4 py-2">Desired Units</th>
                  <th className="px-4 py-2">Fulfilled Units</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder?.listOfProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-center">{product.skuCode}</td>
                    <td className="px-4 py-2 text-center">{product.quantity}</td>
                    <td className="px-4 py-2 text-center">{product.fulfilledQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white p-5 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Edit Order</h2>
      <form onSubmit={handleSaveChanges}>
        {/* Order ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Order ID</label>
          <input
            type="text"
            name="orderId"
            value={editOrderData.orderId}
            onChange={handleEditChange}
            className="border border-gray-300 rounded-lg w-full px-2 py-1"
          />
        </div>

        {/* Order Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Order Title</label>
          <input
            type="text"
            name="orderTitle"
            value={editOrderData.orderTitle}
            onChange={handleEditChange}
            className="border border-gray-300 rounded-lg w-full px-2 py-1"
          />
        </div>

        {/* Tracking Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Tracking Number</label>
          <input
            type="text"
            name="trackingNumber"
            value={editOrderData.trackingNumber}
            onChange={handleEditChange}
            className="border border-gray-300 rounded-lg w-full px-2 py-1"
          />
        </div>

        {/* Remarks */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Remarks</label>
          <input
            type="text"
            name="remarks"
            value={editOrderData.remarks}
            onChange={handleEditChange}
            className="border border-gray-300 rounded-lg w-full px-2 py-1"
          />
        </div>

        {/* Checkbox for Shipped Status */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="status"
            checked={editOrderData.status === 'shipped'}
            onChange={(e) =>
              setEditOrderData((prev) => ({
                ...prev,
                status: e.target.checked ? 'shipped' : 'open',
              }))
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm font-medium">
            Mark as Shipped
          </label>
        </div>

        {/* Buttons Section */}
        <div className="flex justify-between mt-4">
          <div>
            <button
              type="button"
              onClick={closeEditModal}
              className="mr-2 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>

          {/* Delete Order Button */}
          <button
            type="button"
            onClick={() => handleDeleteOrder(editOrderData.orderInternalId)}
            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition duration-200"
          >
            Delete Order
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  );
};

export default CustomOrderTable;
