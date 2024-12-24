import React, { useState, useEffect } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { qrCodeRecordsServices } from "@/app/services/qrCodeRecordsService";
import {
  SecondaryButton,
  PrimaryButton,
} from "../ButtonComponent/ButtonComponent";

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

const OutwardProductToDispatchForm = ({onCancel}) => {
  const [numberOfTextFields, setNumberOfTextFields] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [allQrCodeRecords, setAllQrCodeRecords] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [isFulfillButtonVisible, setIsFulfillButtonVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Add a loading state
  const [validationSchema, setValidationSchema] = useState(Yup.object());

  useEffect(() => {
    const handleData = (newRecord) => {
      setAllQrCodeRecords((prevRecords) => {
        const exists = prevRecords.find(
          (record) => record.qr_code === newRecord.qr_code
        );
        if (!exists) {
          return [newRecord, ...prevRecords];
        }
        return prevRecords;
      });
    };

    qrCodeRecordsServices.streamQrCodeRecords(handleData);

    return () => {
      // Cleanup logic if necessary
    };
  }, []);

  useEffect(() => {
    const schema = Yup.object().shape(
      Object.keys(initialValues).reduce((acc, fieldName) => {
        acc[fieldName] = Yup.string()
          .required("This field is required")
          .unique("This value must be unique")
          .checkQRCodeStatus("QR Code", allQrCodeRecords);
        return acc;
      }, {})
    );

    setValidationSchema(schema); // Set the new validation schema
  }, [initialValues, allQrCodeRecords]); // Dependencies for useEffect

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    const numFields = parseInt(inputValue, 10) || 0;
    setNumberOfTextFields(numFields);
    const initial = {};
    for (let i = 0; i < numFields; i++) {
      initial[`text-field-${i}`] = "";
    }
    setInitialValues(initial);
    setFormVisible(true);
    if (inputValue) {
      setIsFulfillButtonVisible(true);
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const inputNodes = document.querySelectorAll('input[type="text"]');
      const inputs = Array.from(inputNodes);

      const currentIndex = inputs.findIndex(
        (input) => input.name === `text-field-${id}`
      );
      const nextIndex = currentIndex + 1;

      if (nextIndex < inputs.length) {
        inputs[nextIndex].focus();
      }
    }
  };

  const handleSubmit = async (values, actions) => {
    if (loading) return; // Prevent submission if already loading

    setLoading(true); // Set loading state to true

    try {
      const qrCodes = {};
      Object.keys(values).forEach((key) => {
        qrCodes[key] = values[key];
      });

      const response = await qrCodeRecordsServices.updateQRCodeStatuses(
        qrCodes
      );

      console.log("QR code statuses updated:", response);

      toast.success("Products Outwarded Successfully!", { autoClose: 1500 });

      // Reload the page after showing the success toast
      setTimeout(() => {
        window.location.reload();
      }, 1500); // Adjust the timeout as needed
    } catch (error) {
      console.error("Error updating QR code statuses:", error.message);
      toast.error("Failed to submit form. Please try again.");
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
          <ToastContainer position="bottom-center" />
          <h2 className="text-base font-semibold text-[#111928] mb-1">
            Outward to Dispatch
          </h2>
          <p className="text-sm font-normal text-[#4B5563] mb-6">
            Enter amount of products you want to outward to dispatch :-
          </p>

          <div className="flex flex-col  gap-2 mb-2">
            <label className="block text-[#111928] text-sm font-medium mb-1">
              Quantity
              <span className="text-[#9CA3AF] ml-[2px]">*</span>
            </label>
            <Input
              type={"number"}
              placeholder={"Enter quantity"}
              name="quantity"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-2" onClick={handleButtonClick}>
            <SecondaryButton
              title="Outward Products"
              size="medium"
              onClick={handleButtonClick}
            />
          </div>

          <Form className="mt-4 bg-gray-1 p-3 rounded-lg">
            {numberOfTextFields > 0 &&
              [...Array(numberOfTextFields)].map((_, id) => (
                <div key={id} className="mb-3">
                  <label className="block text-[#111928] text-sm font-medium mb-1">
                    Product {id + 1}
                    <span className="text-[#9CA3AF] ml-[2px]">*</span>
                  </label>
                  <Field
                    as={Input}
                    radius={"rounded-lg"}
                    type={"text"}
                    color={"text-[#838481]"}
                    textSize={"text-[1vw]"}
                    name={`text-field-${id}`}
                    placeholder={`Enter QR code for Product ${id + 1}`}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, id)}
                  />
                  <ErrorMessage
                    name={`text-field-${id}`}
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
              ))}
          </Form>
          {loading && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
              style={{ zIndex: 1000 }}
            />
          )}

          <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
            <div className="flex gap-x-2">
              <div className="flex-1">
                <SecondaryButton
                  title="Cancel"
                  width="w-full"
                  onClick={onCancel}
                />
              </div>
              <div className="flex-1">
                <PrimaryButton
                  title="Fulfil"
                  onClick={submitForm}
                  disabled={[...Array(numberOfTextFields)].length === 0}
                  width="w-full"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};

export default OutwardProductToDispatchForm;
