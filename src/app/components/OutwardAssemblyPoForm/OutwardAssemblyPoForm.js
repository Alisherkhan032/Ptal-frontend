"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Input from "@/app/components/Input/Input";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { assemblyPOServices } from "@/app/services/assemblyPO";
import {
  getAssemblyPoByIdFailure,
  getAssemblyPoByIdRequest,
  getAssemblyPoByIdSuccess,
} from '@/app/Actions/assemblyPoActions';
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { batchServices } from "@/app/services/batchService";
import {
  PrimaryButton,
  SecondaryButton,
} from "../ButtonComponent/ButtonComponent";

// Custom method to validate batch number existence and quantity
Yup.addMethod(Yup.string, "validBatchNumber", function (batchData, message) {
  return this.test(
    "valid-batch",
    message || "Invalid batch number",
    function (value, context) {
      const { path, createError, parent } = this;
      const enteredBatches = Object.values(parent);
      const batchCount = enteredBatches.reduce((acc, batchNumber) => {
        if (batchNumber === value) {
          acc++;
        }
        return acc;
      }, 0);

      // Check if the batch number exists in batchData
      if (!Object.keys(batchData).includes(value)) {
        return createError({
          path,
          message: "This batch number doesn't exist for this raw material.",
        });
      }

      // Check if the entered batch number exceeds the available quantity
      if (batchCount > batchData[value]) {
        return createError({
          path,
          message: `The available quantity for batch number ${value} is ${batchData[value]}, and you have exceeded it.`,
        });
      }

      return true;
    }
  );
});

const OutwardForm = ({ poId, handleCancel }) => {
  const { assemblyPOByID } = useSelector((state) => state.assemblyPO);
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({});
  const [formDisabled, setFormDisabled] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [batchData, setBatchData] = useState({});

  // Fetch PO details by ID
  const getAssemblyPoById = async () => {
    try {
      dispatch(getAssemblyPoByIdRequest());
      const response = await assemblyPOServices.getAssemblyPoById(
        poId
      );
      if (response.success === true) {
        dispatch(getAssemblyPoByIdSuccess(response.data));

        const initialValues = {};
        const assemblyQuantity = response.data.quantity;

        if (assemblyQuantity) {
          for (let i = 0; i < assemblyQuantity; i++) {
            initialValues[`assembly-${response.data.skuCode}-${i}`] = "";
          }
        }

        setInitialValues(initialValues);
        setDataLoaded(true);
      }
    } catch (err) {
      dispatch(getAssemblyPoByIdFailure(err));
    }
  };

  // Fetch batch models by raw material ID
  const getBatchModelsByRawMaterialId = async () => {
    try {
      const response = await batchServices.getBatchTransformedData(
        assemblyPOByID.raw_material_id._id
      );
      if (response.success) {
        setBatchData(response.data);
      }
    } catch (error) {
      console.log(
        "error from getBatchModelsByRawMaterialId service=====",
        error
      );
    }
  };

  useEffect(() => {
    getAssemblyPoById();
  }, [poId]);

  useEffect(() => {
    if (dataLoaded) {
      getBatchModelsByRawMaterialId();
    }
  }, [dataLoaded]);

  // Validation schema using the custom Yup method
  const validationSchema = Yup.object().shape(
    Object.keys(initialValues).reduce((acc, fieldName) => {
      acc[fieldName] = Yup.string()
        .required("This field is required")
        .validBatchNumber(
          batchData,
          "This batch number doesn't exist for this raw material"
        );
      return acc;
    }, {})
  );

  // To transform the values in key value pairs of batch number and quantity
  const transformBatchData = (values) => {
    const batchCount = {};

    Object.values(values).forEach((batchNumber) => {
      if (batchNumber) {
        // Ensure batchNumber is not empty
        if (!batchCount[batchNumber]) {
          batchCount[batchNumber] = 0;
        }
        batchCount[batchNumber] += 1;
      }
    });

    return batchCount;
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    const transformedBatchData = transformBatchData(values);
    try {
      const response = await assemblyPOServices.updateAssemblyPo(poId, {
        status: "fulfilled",
        listData: transformedBatchData,
      }); // Update PO
      if (response.success === true) {
        toast.success(`PO Successfully Fulfilled!`, {
          // Success message
          autoClose: 1500,
          onClose: () => window.location.reload(),
        });
        setFormDisabled(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Handle key down to focus next input
  const handleKeyDown = (e, inputs) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currentIndex = inputs.findIndex(
        (input) => input.name === e.target.name
      );
      const nextIndex = currentIndex + 1;

      if (nextIndex < inputs.length) {
        inputs[nextIndex].focus();
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      
      {({ handleChange, submitForm }) => (
        <>
          <div className="relative overflow-y-scroll scrollbar-none pb-10 text-black">
            <ToastContainer position="bottom-center" />
            <h2 className="text-base font-semibold text-[#111928] mb-1">
              Outward Assembly PO
            </h2>
            <p className="text-sm font-normal text-[#4B5563] mb-6">
              {/* Scan and add the QC approved materials to the Storage section */}
            </p>

            <div className="block text-dark-6 text-sm font-medium mb-4">
            Outward Assembly PO: <span className="ml-2 text-dark">{assemblyPOByID._id} </span>
            </div>

            <Form>
              {assemblyPOByID && (
                <div className="flex flex-col gap-2 mb-7">
                 <span className="text-dark-6 text-sm font-medium mb-4">
                        Enter {assemblyPOByID.raw_material_id?.material_name} barcodes for -{' '}
                        <span className="text-dark">{assemblyPOByID.quantity} quantity</span>
                      </span>
                    {[...Array(assemblyPOByID.quantity)].map((_, i) => (
                      <div key={i} className="flex flex-col gap-1 items-left">
                        <Field
                          as={Input}
                          radius={"rounded-2xl"}
                          height={"h-[3.5vw] min-h-[3.5vh]"}
                          width={"w-[30vw] min-w-[30vw]"}
                          padding={"p-[1vw]"}
                          type={"text"}
                          color={"text-[#838481]"}
                          textSize={"text-[1vw]"}
                          fontWeight={"font-medium"}
                          name={`assembly-${assemblyPOByID.skuCode}-${i}`} // Field name
                          placeholder={`Enter barcode for ${assemblyPOByID.raw_material_id?.sku_code} ${i + 1}`}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            const inputNodes =
                              document.querySelectorAll('input[type="text"]');
                            const inputs = Array.from(inputNodes);

                            handleKeyDown(e, inputs);
                          }}
                        />
                        <ErrorMessage
                         name={`assembly-${assemblyPOByID.skuCode}-${i}`} // Field name
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}
            </Form>
          </div>
          <div className="absolute bottom-0 left-0 w-full border border-t-stroke bg-white p-2">
            <div className="flex gap-x-2">
              <div className="flex-1">
                <SecondaryButton
                  title="Cancel"
                  height="h-12"
                  onClick={handleCancel}
                  size='full'
                />
              </div>
              <div className="flex-1">
                <PrimaryButton
                  title="Fulfil"
                  type="submit"
                  size='full'
                  onClick={submitForm}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};

export default OutwardForm;