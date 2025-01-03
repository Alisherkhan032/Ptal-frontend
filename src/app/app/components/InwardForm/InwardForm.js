"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Input from "@/app/components/Input/Input";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { poServices } from "@/app/services/poService";
import {
  getPoByIdRequest,
  getPoByIdSuccess,
  getPoByIdFailure,
} from "@/app/Actions/poActions";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { batchServices } from "@/app/services/batchService";
import {
  PrimaryButton,
  SecondaryButton,
} from "../ButtonComponent/ButtonComponent";

Yup.addMethod(
  Yup.string,
  "startsWithBatchNumber",
  function (batchNumber, message) {
    return this.test("starts-with-batch-number", message, function (value) {
      const { path, createError } = this;
      return value
        ? value.startsWith(batchNumber)
        : true || createError({ path, message });
    });
  }
);

const InwardForm = ({ poId, handleCancel }) => {
  const { poById } = useSelector((state) => state.po);
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({});
  const [formDisabled, setFormDisabled] = useState(false);
  const [batchNumber, setBatchNumber] = useState("");

  // Fetch PO details by ID
  const getPoById = async () => {
    try {
      dispatch(getPoByIdRequest());
      const response = await poServices.getPoById(poId);
      if (response.success === true) {
        dispatch(getPoByIdSuccess(response.data));
        const initialValues = {};
        const qcData = response.data.qcData;
        if (qcData && qcData.passedQcInfo) {
          for (let i = 0; i < qcData.passedQcInfo; i++) {
            initialValues[`qc-${qcData.skuCode}-${i}`] = "";
          }
        }
        setInitialValues(initialValues);
      }
    } catch (err) {
      dispatch(getPoByIdFailure(err));
    }
  };

  // Fetch batch number by PO ID
  const getBatchNumberByPoId = async () => {
    try {
      const response = await batchServices.getBatchNumberByPoId(poId);
      if (response.success === true) {
        setBatchNumber(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPoById();
    getBatchNumberByPoId();
  }, [poId]);

  // Validation schema
  const validationSchema = Yup.object().shape(
    Object.keys(initialValues).reduce((acc, fieldName) => {
      acc[fieldName] = Yup.string()
        .required("This field is required")
        .startsWithBatchNumber(
          batchNumber,
          `Barcode should start with batch number ${batchNumber}`
        );
      return acc;
    }, {})
  );

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await poServices.updatePoStatus(poId);
      if (response.success === true) {
        toast.success(`PO Successfully Fulfilled!`, {
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
              Fulfil PO
            </h2>
            <p className="text-sm font-normal text-[#4B5563] mb-6">
              Scan and add the QC approved materials to the Storage section
            </p>

            <div className="block text-dark-6 text-sm font-medium mb-4">
              Inward PO: <span className="ml-2 text-dark">{poById.po_number} </span>
            </div>

            <Form>
              {poById?.qcData && (
                <div className="flex flex-col gap-2 mb-7">
                  <span className="text-dark-6 text-sm font-medium mb-4">
                    Enter {poById.raw_material_id.material_name} barcodes for -{" "}
                    <span className="text-dark">
                      {poById.qcData.passedQcInfo} quantity
                    </span>
                  </span>
                  {[...Array(poById.qcData.passedQcInfo)].map((_, i) => (
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
                        name={`qc-${poById.qcData.skuCode}-${i}`}
                        placeholder={`Enter barcode for ${
                          poById.raw_material_id.sku_code
                        } ${i + 1}`}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          const inputNodes =
                            document.querySelectorAll('input[type="text"]');
                          const inputs = Array.from(inputNodes);

                          handleKeyDown(e, inputs);
                        }}
                      />
                      <ErrorMessage
                        name={`qc-${poById.qcData.skuCode}-${i}`}
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
                  size='full'
                  onClick={handleCancel}
                  textSize={"text-sm"}
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

export default InwardForm;