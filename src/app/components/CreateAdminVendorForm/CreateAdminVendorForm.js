import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { vendorServices } from "@/app/services/vendorService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Label from "../Label/Label";
import {
  PrimaryButton,
  SecondaryButton,
} from "../ButtonComponent/ButtonComponent";

const CreateAdminVendorForm = ({ onCancel }) => {
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    vendor_name: "",
    vendor_address: "",
    vendor_phone: "",
    vendor_email: "",
    vendor_website: "",
    vendor_zoho_contact_id: "",
    vendor_gst_identification_number: "",
    vendor_point_of_contact: "",
    vendor_point_of_contact_phone: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vendor_name)
      newErrors.vendor_name = "Vendor name is required.";
    if (!formData.vendor_phone)
      newErrors.vendor_phone = "Vendor Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFormSubmit = async () => {
    if (!validateForm()) return;
    try {
      const response = await vendorServices.createNewVendor(formData);
      if (response.success === true) {
        toast.success(`Created Product successfully`, {
          autoClose: 1500,
          onClose: () => {
            onCancel(); // Close the sidebar
            window.location.reload(); // Refresh the page after the toast is shown
          },
          disableClick: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className=" relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <ToastContainer position="bottom-center" />

        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Create Vendor
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Add details of the following categories to add a vendor in the system
        </p>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Vendor Name" />
          <Input
            type={"text"}
            size="medium"
            placeholder="Enter Product Name"
            name="vendor_name"
            value={formData.vendor_name}
            onChange={handleChange}
          />
          {errors.vendor_name && (
            <p className="text-red-500 text-xs">{errors.vendor_name}</p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Vendor Address" />
          <Input
            type={"text"}
            size="medium"
            placeholder="Enter Product Name"
            name="vendor_address"
            value={formData.vendor_address}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-x-4 mb-6">
          {/* Vendor Phone Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Vendor Phone" />
            <Input
              type={"text"}
              name="vendor_phone"
              value={formData.vendor_phone}
              onChange={handleChange}
              placeholder={"Enter Vendor Phone"}
            />
            {errors.vendor_phone && (
              <p className="text-red-500 text-xs">{errors.vendor_phone}</p>
            )}
          </div>

          {/* Vendor Email Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Vendor Email" />
            <Input
              type={"text"}
              name="vendor_email"
              value={formData.vendor_email}
              onChange={handleChange}
              placeholder={"Enter Vendor Email"}
            />
          </div>
        </div>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Vendor Website" />
          <Input
            type={"text"}
            size="medium"
            placeholder="Enter Product Name"
            name="vendor_website"
            value={formData.vendor_website}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-x-4 mb-6">
          {/* Zoho Contact Id Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Zoho Contact Id" />
            <Input
              type={"text"}
              name="vendor_zoho_contact_id"
              value={formData.vendor_zoho_contact_id}
              onChange={handleChange}
              placeholder={"Enter Zoho Contact Id"}
            />
          </div>

          {/* GST ID number Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="GST Id Number" />
            <Input
              type={"text"}
              name="vendor_gst_identification_number"
              value={formData.vendor_gst_identification_number}
              onChange={handleChange}
              placeholder={"Enter GST Number"}
            />
          </div>
        </div>

        <div className="flex gap-x-4 mb-6">
          {/* Point of contact Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Point of Contact" />
            <Input
              type={"text"}
              name="vendor_point_of_contact"
              value={formData.vendor_point_of_contact}
              onChange={handleChange}
              placeholder={"Enter POC Name"}
            />
          </div>

          {/* Point of Contact number Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Point of Contact Number" />
            <Input
              type={"text"}
              name="vendor_point_of_contact_phone"
              value={formData.vendor_point_of_contact_phone}
              onChange={handleChange}
              placeholder={"Enter POC Number"}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Cancel" size="full" onClick={onCancel} />
          </div>
          <div className="flex-1">
            <PrimaryButton
              title="Create Vendor"
              onClick={onFormSubmit}
              size="full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAdminVendorForm;
