'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { engravingOrderServices } from '@/app/services/engravingOrderService';
import { batchServices } from '@/app/services/batchService';

Yup.addMethod(Yup.string, "validateBatch", function (message, availableBatches) {
  return this.test("validateBatch", message, function (value) {
    const { path } = this;
    const batch = availableBatches.find((b) => b.batch_number === value);

    if (!batch) {
      return this.createError({ path, message: `${message} does not exist` });
    }

    if (batch.remaining_quantity <= 0) {
      return this.createError({
        path,
        message: `${message} has no remaining quantity`,
      });
    }

    return true;
  });
});


const OutwardEngravingOrderRawMaterial = () => {
    const { allEngravingOrders } = useSelector((state) => state.engravingOrder);
  
    const filteredOrders = allEngravingOrders
      .filter((order) => order.status === 'pending' && order.type === 'rawMaterial')
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [validationSchema, setValidationSchema] = useState(Yup.object());
    const [batchInfo, setBatchInfo] = useState([]);
    const [groupedFields, setGroupedFields] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
const ordersPerPage = 10; // Adjust this as needed

// Logic to get orders for the current page
const indexOfLastOrder = currentPage * ordersPerPage;
const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

// Total pages calculation
const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  
    const handleCheckboxChange = (orderID) => {
      setSelectedOrders((prevSelectedOrders) =>
        prevSelectedOrders.includes(orderID)
          ? prevSelectedOrders.filter((id) => id !== orderID)
          : [...prevSelectedOrders, orderID]
      );
    };
  
    const handleOutwardOrders = async () => {
        if (selectedOrders.length === 0) {
          toast.error("Please select at least one order.", { autoClose: 2000 });
          return;
        }
      
        try {
          const aggregatedSKUs = selectedOrders.flatMap((_id) => {
            const order = filteredOrders.find((order) => order._id === _id);
            return order.listOfProducts.map((product) => ({
              skuCode: product.skuCode,
              quantity: product.quantity,
            }));
          });
      
          // Group SKUs by total quantity
          const groupedSKUs = aggregatedSKUs.reduce((acc, { skuCode, quantity }) => {
            acc[skuCode] = (acc[skuCode] || 0) + quantity;
            return acc;
          }, {});
      
          // Fetch batch information
          const response = await batchServices.getBatchInfoBySKUCode({
            skuCodes: Object.keys(groupedSKUs),
          });
      
          if (response.success) {
            const batchData = response.data;
            setBatchInfo(batchData);
            setGroupedFields(groupedSKUs);
      
            // Build validation schema with batch usage tracking
            const schemaFields = Object.entries(groupedSKUs).reduce((acc, [skuCode, totalQuantity]) => {
              for (let i = 0; i < totalQuantity; i++) {
                const fieldName = `batch_${skuCode}_${i + 1}`;
                acc[fieldName] = Yup.string()
                  .required("Batch is required")
                  .test(
                    "validateBatch",
                    "Invalid batch or exceeds available quantity",
                    function (value, context) {
                      const allValues = context.parent;  // This contains all field values
                      const usedBatches = Object.values(allValues).reduce((counts, batchNumber) => {
                        if (batchNumber) {
                          counts[batchNumber] = (counts[batchNumber] || 0) + 1;
                        }
                        return counts;
                      }, {});
      
                      // Get available batch quantity from batchData
                      const batchAvailable = batchData[skuCode]?.batches[value];
                      return (
                        batchAvailable && usedBatches[value] <= batchAvailable // Ensure total batch usage <= available quantity
                      );
                    }
                  );
              }
              return acc;
            }, {});
      
            setValidationSchema(Yup.object().shape(schemaFields));
            setModalOpen(true);
          } else {
            toast.error(`Error fetching batch info: ${response.message}`, { autoClose: 2000 });
          }
        } catch (error) {
          console.error("Error fetching batch info:", error);
          toast.error("Failed to fetch batch info.", { autoClose: 2000 });
        }
      };
    
  

    const handleSubmit = async (values) => {
        try {
          // Collect the selected Order IDs
          const processedOrderIDs = selectedOrders;
      
          // Prepare the batches data
          const batchCounts = {};
      
          // Loop through all form values and group by batch number
          Object.entries(values).forEach(([key, batchNumber]) => {
            if (batchNumber) {
              // Increment the count for the batch number
              batchCounts[batchNumber] = (batchCounts[batchNumber] || 0) + 1;
            }
          });
      
          // Prepare the payload
          const payload = {
            selectedOrderID: processedOrderIDs,
            Batches: batchCounts,
          };
      
          console.log("payload", payload);
      
          // Send the request to the server using the outwardFromStorage service
          const response = await engravingOrderServices.outwardFromStorage(payload);
      
          if (response.success) {
            toast.success("Batches submitted successfully!", {
              autoClose: 2000,
              onClose: () => window.location.reload(),
            });
            setModalOpen(false);
          } else {
            toast.error(`Submission failed: ${response.message}`, { autoClose: 2000 });
          }
        } catch (error) {
          console.error("Error submitting batches:", error);
          toast.error("An error occurred while submitting batches.", { autoClose: 2000 });
        }
      };
      
      
    const renderBatchForm = () => (
      <Formik
        initialValues={Object.fromEntries(
          Object.entries(groupedFields).flatMap(([skuCode, totalQuantity]) =>
            Array.from({ length: totalQuantity }, (_, idx) => [`batch_${skuCode}_${idx + 1}`, ""])
          )
        )}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange }) => (
          <Form>
            {Object.entries(groupedFields).map(([skuCode, totalQuantity]) => (
              <div key={skuCode}>
                <h3 className="text-lg font-semibold mb-2">Inward for {skuCode}</h3>
                {Array.from({ length: totalQuantity }, (_, idx) => (
                  <div key={`batch_${skuCode}_${idx + 1}`} className="mb-4">
                    <label>{`Enter code for item# ${idx + 1}`}</label>
                    <Field
                      type="text"
                      name={`batch_${skuCode}_${idx + 1}`}
                      placeholder="Enter batch number"
                      onChange={handleChange}
                      className="border p-2 w-full"
                    />
                    <ErrorMessage
                      name={`batch_${skuCode}_${idx + 1}`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                ))}
              </div>
            ))}
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
          <button onClick={handleOutwardOrders} className="bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg">
            Outward Orders
          </button>
        </div>
  
        <table className="w-full text-sm text-left text-gray-500">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-4 py-2 text-gray-700">Select</th>
      <th className="px-4 py-2 text-gray-700">Order ID</th>
      <th className="px-4 py-2 text-gray-700">Updated At</th>
      <th className="px-4 py-2 text-gray-700">SKU Codes</th>
      <th className="px-4 py-2 text-gray-700">Quantity</th>
    </tr>
  </thead>
  <tbody>
    {currentOrders.map((order) => (
      <tr key={order._id}>
        <td className="px-4 py-2">
          <input type="checkbox" onChange={() => handleCheckboxChange(order._id)} />
        </td>
        <td className="px-4 py-2">{order.orderID}</td>
        <td className="px-4 py-2">{moment(order.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
        <td className="px-4 py-2">{order.listOfProducts.map((p) => p.skuCode).join(", ")}</td>
        <td className="px-4 py-2">{order.listOfProducts[0].quantity}</td>
      </tr>
    ))}
  </tbody>
</table>


        <div className="flex justify-between items-center mt-4">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
    disabled={currentPage === 1}
  >
    Previous
  </button>
  
  <span className="text-sm">
    Page {currentPage} of {totalPages}
  </span>
  
  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>

  
        {modalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="bg-white p-5 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Enter Batch Information</h2>
      {renderBatchForm()}
    </div>
  </div>
)}

      </div>
    );
  };
  
  export default OutwardEngravingOrderRawMaterial;
  