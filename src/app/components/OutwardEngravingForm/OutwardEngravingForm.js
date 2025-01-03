import React, {useState} from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { batchServices } from "@/app/services/batchService";

const OutwardEngravingForm = ({ renderBatchForm }) => {
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [groupedFields, setGroupedFields] = useState({});
    const [validationSchema, setValidationSchema] = useState(Yup.object());

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
            setModalOpen(true);
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
            setModalOpen(false);
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
  return (
    <div>
      OutwardEngravingForm
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
            <div key={skuCode}>
              <h3 className="text-lg font-semibold mb-2">
                Inward for {skuCode}
              </h3>
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
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-dark px-4 py-2 rounded-lg"
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
    </div>
  );
};

export default OutwardEngravingForm;
