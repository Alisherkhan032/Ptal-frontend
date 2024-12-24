import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  PrimaryButton,
  SecondaryButton,
} from "../ButtonComponent/ButtonComponent";

const OutwardEngravingForm = ({
  selectedOrders,
  filteredData,
  allQrCodeRecords,
  validationSchema,
  handleSubmit,
  handleCheckboxChange,
  setIsSidebarOpen,
}) => {
  const initialValues = Object.fromEntries(
    selectedOrders.flatMap((orderID) => {
      const order = filteredData.find((order) => order.orderID === orderID);
      return order.listOfProducts.flatMap((product) =>
        Array.from({ length: product.quantity }, (_, idx) => [
          `qr_${orderID}_${product.skuCode}_${idx + 1}`,
          "",
        ])
      );
    })
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, values, errors }) => (
        <Form>
          <h2 className="text-base font-semibold text-[#111928] mb-2">
            Outward to Engraving
          </h2>
          <p className="text-sm font-normal text-[#4B5563] mb-6">
            Add details about the items to be sent to engraving team
          </p>

          <div className="space-y-4 pb-20 overflow-y-auto scrollbar-none pr-2">
            {selectedOrders.map((orderID) => {
              const order = filteredData.find(
                (order) => order.orderID === orderID
              );
              return (
                <div key={orderID} className="mb-6 bg-gray-2 p-4 rounded-lg">
                  {/* Order ID */}
                  <label className="block text-dark text-sm font-medium mb-1">
                    {`Order ID: ${orderID}`}
                  </label>
                  {/* Quantity and SKU Code */}
                  {order.listOfProducts.map((product) => (
                    <div key={`${orderID}_${product.skuCode}`} className="mb-4">
                      <div className="text-dark-4 flex gap-x-4 text-sm  mb-2">
                        <div>Quantity: {product.quantity}</div>
                        <div>SKU Code: {product.skuCode}</div>
                      </div>
                      {/* Input fields for each quantity */}
                      {Array.from({ length: product.quantity }, (_, idx) => {
                        const fieldName = `qr_${orderID}_${product.skuCode}_${
                          idx + 1
                        }`;
                        return (
                          <div key={fieldName} className="mb-2">
                            <Field
                              type="text"
                              placeholder={`Enter Inventory QR Code for item ${
                                idx + 1
                              }`}
                              name={fieldName}
                              className="w-full border rounded-xl h-10 text-sm p-4"
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name={fieldName}
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-0 w-full border border-t-stroke bg-white p-2">
            <div className="flex gap-x-2">
              <div className="flex-1">
                <SecondaryButton
                  title="Cancel"
                  onClick={() => setIsSidebarOpen(false)}
                  size="full"
                />
              </div>
              <div className="flex-1">
                <PrimaryButton title="Submit" type="submit" size="full" />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default OutwardEngravingForm;
