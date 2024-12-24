"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { engravingOrderServices } from "@/app/services/engravingOrderService";
import { batchServices } from "@/app/services/batchService";
import { PrimaryButton } from "../ButtonComponent/ButtonComponent";
import RightSidebar from "../RaisePoFormSideBar/RaisePoFormSideBar";
import OutwardEngravingForm from "../OutwardEngravingForm/OutwardEngravingForm";

Yup.addMethod(
  Yup.string,
  "validateBatch",
  function (message, availableBatches) {
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
  }
);

const OutwardEngravingOrderRawMaterial = () => {
  const { allEngravingOrders } = useSelector((state) => state.engravingOrder);

  const filteredOrders = allEngravingOrders
    .filter(
      (order) => order.status === "pending" && order.type === "rawMaterial"
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const [selectedOrders, setSelectedOrders] = useState([]);

  const [validationSchema, setValidationSchema] = useState(Yup.object());
  const [batchInfo, setBatchInfo] = useState([]);
  const [groupedFields, setGroupedFields] = useState({});

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOutwardSidebarOpen, setIsOutwardSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 50; // Adjust this as needed

  const indexOfLastRow = currentPage * ordersPerPage;
  const indexOfFirstRow = indexOfLastRow - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);

  // Total pages calculation
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Handle previous page
  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    setCurrentPage((prevPage) => (prevPage > totalPages ? 1 : prevPage));
  }, [filteredOrders, totalPages]);

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

    setIsOutwardSidebarOpen(true);

    try {
      const aggregatedSKUs = selectedOrders.flatMap((_id) => {
        const order = filteredOrders.find((order) => order._id === _id);
        return order.listOfProducts.map((product) => ({
          skuCode: product.skuCode,
          quantity: product.quantity,
        }));
      });

      // Group SKUs by total quantity
      const groupedSKUs = aggregatedSKUs.reduce(
        (acc, { skuCode, quantity }) => {
          acc[skuCode] = (acc[skuCode] || 0) + quantity;
          return acc;
        },
        {}
      );

      // Fetch batch information
      const response = await batchServices.getBatchInfoBySKUCode({
        skuCodes: Object.keys(groupedSKUs),
      });

      if (response.success) {
        const batchData = response.data;
        setBatchInfo(batchData);
        setGroupedFields(groupedSKUs);

        // Build validation schema with batch usage tracking
        const schemaFields = Object.entries(groupedSKUs).reduce(
          (acc, [skuCode, totalQuantity]) => {
            for (let i = 0; i < totalQuantity; i++) {
              const fieldName = `batch_${skuCode}_${i + 1}`;
              acc[fieldName] = Yup.string()
                .required("Batch is required")
                .test(
                  "validateBatch",
                  "Invalid batch or exceeds available quantity",
                  function (value, context) {
                    const allValues = context.parent; // This contains all field values
                    const usedBatches = Object.values(allValues).reduce(
                      (counts, batchNumber) => {
                        if (batchNumber) {
                          counts[batchNumber] = (counts[batchNumber] || 0) + 1;
                        }
                        return counts;
                      },
                      {}
                    );

                    // Get available batch quantity from batchData
                    const batchAvailable = batchData[skuCode]?.batches[value];
                    return (
                      batchAvailable && usedBatches[value] <= batchAvailable // Ensure total batch usage <= available quantity
                    );
                  }
                );
            }
            return acc;
          },
          {}
        );

        setValidationSchema(Yup.object().shape(schemaFields));
      } else {
        toast.error(`Error fetching batch info: ${response.message}`, {
          autoClose: 2000,
        });
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
      } else {
        toast.error(`Submission failed: ${response.message}`, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting batches:", error);
      toast.error("An error occurred while submitting batches.", {
        autoClose: 2000,
      });
    }
  };

  const renderBatchForm = () => (
    <Formik
      initialValues={Object.fromEntries(
        Object.entries(groupedFields).flatMap(([skuCode, totalQuantity]) =>
          Array.from({ length: totalQuantity }, (_, idx) => [
            `batch_${skuCode}_${idx + 1}`,
            "",
          ])
        )
      )}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange }) => (
        <Form>
          {Object.entries(groupedFields).map(([skuCode, totalQuantity]) => (
            <div key={skuCode} className="bg-gray-1 p-2 my-2 rounded-e-lg">
              <h3 className="block text-[#111928] text-base font-medium my-6">
                Inward for {skuCode}
              </h3>
              {Array.from({ length: totalQuantity }, (_, idx) => (
                <div
                  key={`batch_${skuCode}_${idx + 1}`}
                  className="block text-[#111928] text-sm font-medium mb-4"
                >
                  <label className="mb-2">{`Enter code for item# ${
                    idx + 1
                  }`}</label>
                  <Field
                    type="text"
                    name={`batch_${skuCode}_${idx + 1}`}
                    placeholder="Enter batch number"
                    onChange={handleChange}
                    className="border rounded-xl p-4 h-10 text-sm font-normal w-full text-[#838481]"
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
          <div className="flex justify-between space-x-4 mt-4">
            <button
              type="button"
              onClick={() => setIsOutwardSidebarOpen(false)}
              className="bg-purple-light-5 text-primary px-4 py-2 rounded-lg flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg flex-1"
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );

  return (
    <div className="relative overflow-x-scroll scrollbar-none">
      <ToastContainer />
      <div className="flex justify-end   mb-4">
        <PrimaryButton
          width="w-[15%]"
          // onClick={() => setIsOutwardSidebarOpen(true)}
          onClick={handleOutwardOrders}
          title="Fulfil"
          height="h-10 "
          bgColor="bg-primary"
        />
        {/* <button
          onClick={handleOutwardOrders}
          className="bg-green-500 text-dark px-4 py-2 text-sm font-semibold rounded-lg"
        >
          Outward Orders
        </button> */}
      </div>

      <div className="relative overflow-x-auto rounded-2xl border-[1.2px] border-stroke scrollbar-none">
        <table className="w-full text-sm text-dark font-medium">
          <thead className="text-sm text-dark-4 bg-gray-2 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium text-left whitespace-nowrap">
                Select
              </th>
              <th className="px-6 py-3 font-medium text-left whitespace-nowrap">
                Order ID
              </th>
              <th className="px-6 py-3 font-medium text-left whitespace-nowrap">
                Updated At
              </th>
              <th className="px-6 py-3 font-medium text-left whitespace-nowrap">
                SKU Codes
              </th>
              <th className="px-6 py-3 font-medium text-left whitespace-nowrap">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentOrders.map((order) => (
              <tr key={order._id} className={`border-b border-stroke`}>
                <td className="px-6 py-4 max-w-lg whitespace-nowrap">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(order._id)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-6 py-4 max-w-lg whitespace-nowrap">
                  {order.orderID}
                </td>
                <td className="px-6 py-4 max-w-lg whitespace-nowrap">
                  {moment(order.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td className="px-6 py-4 max-w-lg whitespace-nowrap">
                  {order.listOfProducts.map((p) => p.skuCode).join(", ")}
                </td>
                <td className="px-6 py-4 max-w-lg whitespace-nowrap">
                  {order.listOfProducts[0].quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav className="flex justify-center items-center bg-gray-1 mt-4">
          <div className="min-w-36 text-sm border border-stroke rounded-2xl flex justify-center items-center ">
            <div className="flex justify-center items-center min-h-8 min-w-36 rounded-l-2xl text-dark-4 bg-gray-2 border-stroke border-r-2">
              <div>
                <span className="text-dark font-bold mr-2">{currentPage}</span>
                <span>of {totalPages}</span>
              </div>
            </div>

            <div className="flex justify-center items-center min-h-8 min-w-36 text-dark-4 bg-white border-stroke border-r-2">
              <div className="flex justify-center gap-x-2 items-center text-dark-4 ">
                <svg
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.82495 13.3249C6.67495 13.3249 6.52495 13.2749 6.42495 13.1499L0.774951 7.3999C0.549951 7.1749 0.549951 6.8249 0.774951 6.5999L6.42495 0.849902C6.64995 0.624902 6.99995 0.624902 7.22495 0.849902C7.44995 1.0749 7.44995 1.4249 7.22495 1.6499L1.97495 6.9999L7.24995 12.3499C7.47495 12.5749 7.47495 12.9249 7.24995 13.1499C7.09995 13.2499 6.97495 13.3249 6.82495 13.3249Z"
                    fill="#9CA3AF"
                  />
                </svg>

                <button onClick={prePage} disabled={currentPage === 1}>
                  Previous
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center min-h-8   min-w-36 rounded-r-2xl text-dark-4 bg-white">
              <div className="flex justify-center gap-x-2 items-center text-dark-4 ">
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <svg
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.17495 13.3249C1.02495 13.3249 0.899951 13.2749 0.774951 13.1749C0.549951 12.9499 0.549951 12.5999 0.774951 12.3749L6.02495 6.9999L0.774951 1.6499C0.549951 1.4249 0.549951 1.0749 0.774951 0.849902C0.999951 0.624902 1.34995 0.624902 1.57495 0.849902L7.22495 6.5999C7.44995 6.8249 7.44995 7.1749 7.22495 7.3999L1.57495 13.1499C1.47495 13.2499 1.32495 13.3249 1.17495 13.3249Z"
                    fill="#9CA3AF"
                  />
                </svg>
              </div>
            </div>
          </div>
        </nav>

        <RightSidebar
          isOpen={isOutwardSidebarOpen}
          onClose={() => setIsOutwardSidebarOpen(false)}
        >
          <div className=" relative overflow-y-scroll scrollbar-none pb-10 text-black">
            <ToastContainer position="bottom-center" />
            <h2 className="text-base font-semibold text-[#111928] mb-1">
              Outward Bulk Form
            </h2>
            <p className="text-sm font-normal text-[#4B5563] mb-6">
              Add items to be outwarded
            </p>
            {/* {renderBatchForm()} */}
            <Formik
              initialValues={Object.fromEntries(
                Object.entries(groupedFields).flatMap(
                  ([skuCode, totalQuantity]) =>
                    Array.from({ length: totalQuantity }, (_, idx) => [
                      `batch_${skuCode}_${idx + 1}`,
                      "",
                    ])
                )
              )}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange }) => (
                <Form>
                  {Object.entries(groupedFields).map(
                    ([skuCode, totalQuantity]) => (
                      <div
                        key={skuCode}
                        className="bg-gray-1 p-2 my-2 rounded-e-lg"
                      >
                        <h3 className="block text-[#111928] text-base font-medium my-6">
                          Inward for {skuCode}
                        </h3>
                        {Array.from({ length: totalQuantity }, (_, idx) => (
                          <div
                            key={`batch_${skuCode}_${idx + 1}`}
                            className="block text-[#111928] text-sm font-medium mb-4"
                          >
                            <label className="mb-2">{`Enter code for item# ${
                              idx + 1
                            }`}</label>
                            <Field
                              type="text"
                              name={`batch_${skuCode}_${idx + 1}`}
                              placeholder="Enter batch number"
                              onChange={handleChange}
                              className="border rounded-xl p-4 h-10 text-sm font-normal w-full text-[#838481]"
                            />
                            <ErrorMessage
                              name={`batch_${skuCode}_${idx + 1}`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    )
                  )}
                  <div className="flex justify-between space-x-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsOutwardSidebarOpen(false)}
                      className="bg-purple-light-5 text-primary px-4 py-2 rounded-lg flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded-lg flex-1"
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          {/* <OutwardEngravingForm renderBatchForm={renderBatchForm} /> */}
        </RightSidebar>
      </div>
    </div>
  );
};

export default OutwardEngravingOrderRawMaterial;
