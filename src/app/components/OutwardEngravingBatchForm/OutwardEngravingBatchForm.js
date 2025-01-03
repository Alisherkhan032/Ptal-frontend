import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { engravingOrderServices } from "@/app/services/engravingOrderService";

const OutwardEngravingBatchForm = ({
  groupedFields,
  validationSchema,
  selectedOrders,
  onClose,
}) => {
  const handleSubmit = async (values) => {
    try {
      const batchCounts = {};
      Object.entries(values).forEach(([, batchNumber]) => {
        if (batchNumber) {
          batchCounts[batchNumber] = (batchCounts[batchNumber] || 0) + 1;
        }
      });

      const payload = {
        selectedOrderID: selectedOrders,
        Batches: batchCounts,
      };

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

  return (
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
                  <label className="mb-2">{`Enter code for item# ${idx + 1}`}</label>
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
              onClick={onClose}
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
};

export default OutwardEngravingBatchForm;