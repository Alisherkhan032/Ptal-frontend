"use client";
import React, { useState } from "react";
import { amazonOrderService } from "@/app/services/amazonOrderService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Label from "../Label/Label";
import { ICONS } from "@/app/utils/icons";
import { PrimaryButton, SecondaryButton } from "@/app/components/ButtonComponent/ButtonComponent";

const InwardAmazonCSV = ({onCancel}) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose File");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);

    const file = event.target.files[0];
    setFileName(file ? file.name : "Choose File");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please upload a CSV file", { autoClose: 3000 });
      return;
    }

    try {
      const response = await amazonOrderService.uploadAmazonCSV(file);

      if (response.success) {
        toast.success("File uploaded successfully", {
          autoClose: 3000,
          onClose: () => window.location.reload(),
        });
      } else {
        toast.error("Failed to upload file", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "An error occurred while uploading the file: " + error.message,
        { autoClose: 3000 }
      );
    }
  };

  return (
    <>
      <div className=" relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <ToastContainer />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Inward Amazon Order CSV
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Upload the CSV to inward the Amazon orders
        </p>

        <div className="flex flex-col mb-6 gap-y-2">
          <Label text="Uploaded CSV to inward Amazon Orders" />
          <form onSubmit={handleSubmit} id="myForm">
            <input
              type="file"
              accept=".csv"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex  bg-purple-light-5 px-4 py-2 rounded-lg text-primary "
            >
              <span className="inline-block pt-1">{ICONS.outwardPo}</span>
              <span>{fileName}</span>
            </label>
          </form>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Cancel" size="full" onClick={onCancel} />
          </div>
          <label className="flex-1">
            <PrimaryButton
              title="Inward Orders"
              type="submit"
              size="full"
              form="myForm"
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default InwardAmazonCSV;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "50px auto",
  },
  header: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  fileInput: {
    marginBottom: "15px",
    padding: "8px",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

styles.button[":hover"] = {
  backgroundColor: "#45a049",
};
