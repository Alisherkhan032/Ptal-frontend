'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { qrCodeRecordsServices } from "@/app/services/qrCodeRecordsService";
import { engravingOrderServices } from '@/app/services/engravingOrderService';

Yup.addMethod(
  Yup.string,
  "checkQRCodeStatus",
  function (message, allQrCodeRecords) {
    return this.test("checkQRCodeStatus", message, function (value) {
      const qrCodeStatus = allQrCodeRecords.find(
        (qrCode) => qrCode.qr_code === value
      );

      if (!qrCodeStatus) {
        return this.createError({
          path: this.path,
          message: `${message} does not exist in the system`,
        });
      }

      return (
        qrCodeStatus.current_status === "Inwarded" ||
        this.createError({
          path: this.path,
          message: `${message} Current status: ${
            qrCodeStatus ? qrCodeStatus.current_status : "Unknown"
          }`,
        })
      );
    });
  }
);



Yup.addMethod(Yup.string, "unique", function (message) {
  return this.test("unique", message, function (value) {
    const { path, parent } = this;
    const siblings = Object.keys(parent)
      .filter((key) => key !== path)
      .map((key) => parent[key]);

    const isUnique = !siblings.includes(value);
    return isUnique || this.createError({ path, message });
  });
});

Yup.addMethod(Yup.string, "startsWithSKU", function (message, skuCode) {
  return this.test("startsWithSKU", message, function (value) {
    if (value && !value.startsWith(skuCode)) {
      return this.createError({
        path: this.path,
        message: `${message} must start with ${skuCode}`,
      });
    }
    return true;
  });
});


const OutwardEngravingOrder = () => {
  const { allEngravingOrders } = useSelector((state) => state.engravingOrder);
  const sortedOrders = allEngravingOrders.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const [filteredData, setFilteredData] = useState(sortedOrders);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [allQrCodeRecords, setAllQrCodeRecords] = useState([]);
  const [validationSchema, setValidationSchema] = useState(Yup.object());
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const currentDateAndFileName = `Engraving_Order_${moment().format('DD-MMM-YYYY')}`;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);

  
  useEffect(() => {
    setFilteredData(sortedOrders);
    setCurrentPage(1);
  }, [sortedOrders]);

  useEffect(() => {
      // Start QR code streaming
      qrCodeRecordsServices.streamQrCodeRecords((newRecord) => {
        setAllQrCodeRecords((prevRecords) => {
          const exists = prevRecords.find((record) => record.qr_code === newRecord.qr_code);
          return exists ? prevRecords : [newRecord, ...prevRecords];
        });
      });
  }, []);

  const handleCheckboxChange = (orderID) => {
    setSelectedOrders((prevSelectedOrders) => 
      prevSelectedOrders.includes(orderID) 
      ? prevSelectedOrders.filter((id) => id !== orderID) 
      : [...prevSelectedOrders, orderID]
    );
  };

  const handleOutwardOrders = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order.", {
        autoClose: 2000,
      });
      return;
    }
    setModalOpen(true);

  

    // Set validation schema
    const schemaFields = selectedOrders.reduce((acc, orderID) => {
      const order = filteredData.find((order) => order.orderID === orderID);
      order.listOfProducts.forEach((product) => {
        for (let i = 0; i < product.quantity; i++) {
          const fieldName = `qr_${orderID}_${product.skuCode}_${i + 1}`;
          acc[fieldName] = Yup.string()
            .required("QR Code is required")
            .startsWithSKU("QR Code", product.skuCode)
            .unique("This QR Code must be unique")
            .checkQRCodeStatus("QR Code", allQrCodeRecords);
            
        }
      });
      return acc;
    }, {});

    setValidationSchema(Yup.object().shape(schemaFields));
  };

  const handleKeyDown = (e, name, fieldArray) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const index = fieldArray.findIndex((input) => input.name === name);
      if (index >= 0 && index < fieldArray.length - 1) {
        fieldArray[index + 1].focus();
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      
  
      // Call the service to process the QR codes
      const response = await engravingOrderServices.processEngravingOrderQRCodes(values);
  
      if (response.success) {
        // Handle success case
        toast.success("QR Codes submitted successfully!", { autoClose: 2000,
          onClose: () => {
            window.location.reload();
          }
         });
        setModalOpen(false);  // Close the modal on success
      } else {
        // Handle failure case
        toast.error(`Error: ${response.message}`, { autoClose: 2000, onClose: () => {window.location.reload();} });
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error in handleSubmit:', error);
      toast.error('An error occurred while submitting the QR codes.', { autoClose: 1500, onClose: () => {window.location.reload();} });
    }
  };
  

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

    const rows = data.map((order) => {
      return order?.listOfProducts.map((product) => [
        order?.orderID,
        order?.status,
        order?.createdAt ? moment(order.createdAt).format('DD MMM YYYY HH:mm') : '',
        product?.engravingContent,
        product?.skuCode,
        product?.quantity,
        product?.inventory_qr_code,
        product?.engraving_qr_code,
      ]);
    }).flat();

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

  const formatStatus = (status) => {
    if (!status) return '';
    return status
      .split('_')
      .map((word, index) => {
        if (index === 0) return word.toLowerCase(); // First word remains in lowercase
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize subsequent words
      })
      .join('');
  };
  

  const renderQRCodeForm = () => (
    <Formik
      initialValues={Object.fromEntries(
        selectedOrders.flatMap((orderID) => {
          const order = filteredData.find((order) => order.orderID === orderID);
          return order.listOfProducts.flatMap((product) =>
            Array.from({ length: product.quantity }, (_, idx) => [
              `qr_${orderID}_${product.skuCode}_${idx + 1}`,
              '',
            ])
          );
        })
      )}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, values }) => (
        <Form>
          {selectedOrders.map((orderID) => {
            const order = filteredData.find((order) => order.orderID === orderID);
            return order.listOfProducts.map((product) =>
              Array.from({ length: product.quantity }, (_, idx) => {
                const fieldName = `qr_${orderID}_${product.skuCode}_${idx + 1}`;
                return (
                  <div key={fieldName} className="flex items-center space-x-4 mb-4">
                    <label className="w-1/3">{`Order: ${orderID} - SKU: ${product.skuCode} (${idx + 1}/${product.quantity})`}</label>
                    <Field
                      type="text"
                      placeholder="Enter Inventory QR Code"
                      name={fieldName}
                      className="border p-2 w-1/3"
                      onChange={handleChange}
                      onKeyDown={(e) => handleKeyDown(e, fieldName, document.querySelectorAll('input[type="text"]'))}
                    />
                    <ErrorMessage name={fieldName} component="div" className="text-red-500 text-xs" />
                  </div>
                );
              })
            );
          })}
          <div className="flex justify-end space-x-4 mt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <ToastContainer />
      <div className="flex justify-between mb-4">
        <button onClick={() => convertToCSV(filteredData)} className="bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg">
          Download CSV
        </button>
        <button onClick={handleOutwardOrders} className="bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg">
          Outward Orders
        </button>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Select</th>
            <th className="px-6 py-3">ORDER ID</th>
            <th className="px-6 py-3">STATUS</th>
            <th className="px-6 py-3">CREATED AT</th>
            <th className="px-6 py-3">ENGRAVING CONTENT</th>
            <th className="px-6 py-3">SKU CODE</th>
            <th className="px-6 py-3">QUANTITY</th>
    
          </tr>
        </thead>
        <tbody>
  {records
    .filter((order) => order.status === 'pending') // Only show orders with status 'pending'
    .map((order, index) => (
      <tr key={index} className={`${order.status === 'completed' ? 'bg-green-100' : ''}`}>
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selectedOrders.includes(order.orderID)}
            onChange={() => handleCheckboxChange(order.orderID)}
          />
        </td>
        <td className="px-6 py-4">{order.orderID}</td>
        <td className="px-6 py-4">{formatStatus(order.status)}</td>
        <td className="px-6 py-4">{moment(order.createdAt).format('DD MMM YYYY HH:mm')}</td>
        <td className="px-6 py-4">{order.listOfProducts.map(product => product.engravingContent).join(', ')}</td>
        <td className="px-6 py-4">{order.listOfProducts.map(product => product.skuCode).join(', ')}</td>
        <td className="px-6 py-4">{order.listOfProducts.map(product => product.quantity).join(', ')}</td>
      </tr>
    ))}
</tbody>

      </table>

      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg"
        >
          Previous
        </button>
        <span>Page {currentPage} of {npage}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, npage))}
          disabled={currentPage === npage}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg"
        >
          Next
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Enter Inventory QR Codes</h2>
            {renderQRCodeForm()}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutwardEngravingOrder;
