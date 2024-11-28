import React, { useState, useEffect } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { qrCodeRecordsServices } from "@/app/services/qrCodeRecordsService";

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

const OutwardProductsToDispatch = () => {
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
        const exists = prevRecords.find(record => record.qr_code === newRecord.qr_code);
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

      const response = await qrCodeRecordsServices.updateQRCodeStatuses(qrCodes);

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
    <div>
      <ToastContainer />
      <label style={{ display: "block", marginBottom: "8px", marginTop: "10px" }}>
        Enter amount of products you want to outward to dispatch :-
      </label>
      <div className="flex items-center gap-2 mb-2">
        <Input
          bgColor={"bg-[#F8F6F2]"}
          radius={"rounded-lg"}
          height={"h-[3.5vw] min-h-[3.5vh]"}
          padding={"p-[1vw]"}
          type={"number"}
          color={"text-[#838481]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          name="quantity"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <div className="mt-2" onClick={handleButtonClick}>
        <Button
          title={"Outward Products"}
          bgColor={"bg-[rgb(79,201,218)]"}
          radius={"rounded-lg"}
          height={"h-[3vw] min-h-[3vh]"}
          padding={"p-[1vw] px-[2vw] py-[2vw]"}
          color={"text-[#ffff]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          width={"w-[7vw]"}
        />
      </div>
      {formVisible && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleChange }) => (
            <Form style={{ marginTop: "10px" }}>
              {numberOfTextFields > 0 &&
                [...Array(numberOfTextFields)].map((_, id) => (
                  <div key={id}>
                    <label style={{ display: "block" }}>Product {id + 1}</label>
                    <Field
                      as={Input}
                      bgColor={"bg-[#F8F6F2]"}
                      radius={"rounded-lg"}
                      height={"h-[3.5vw] min-h-[3.5vh]"}
                      padding={"p-[1vw]"}
                      type={"text"}
                      color={"text-[#838481]"}
                      textSize={"text-[1vw]"}
                      fontWeight={"font-medium"}
                      name={`text-field-${id}`}
                      placeholder={`Enter QR code for Product ${id + 1}`}
                      onChange={handleChange}
                      onKeyDown={(e) => handleKeyDown(e, id)}
                      width={"w-[35vw] min-w-[35vw]"}
                    />
                    <ErrorMessage
                      name={`text-field-${id}`}
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>
                ))}
              {isFulfillButtonVisible && (
                <div className="mt-2">
                  <Button
                    title={"Fulfill"}
                    bgColor={"bg-[rgb(79,201,218)]"}
                    radius={"rounded-lg"}
                    height={"h-[3vw] min-h-[3vh]"}
                    padding={"p-[1vw] px-[2vw] py-[2vw]"}
                    color={"text-[#ffff]"}
                    textSize={"text-[1vw]"}
                    fontWeight={"font-medium"}
                    width={"w-[7vw]"}
                    type="submit"
                    disabled={loading} // Disable button if loading
                  />
                </div>
              )}
            </Form>
          )}
        </Formik>
      )}
    {loading && (
      <div
        className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
        style={{ zIndex: 1000 }}
      />
    )}
  </div>
  );
};

export default OutwardProductsToDispatch;
