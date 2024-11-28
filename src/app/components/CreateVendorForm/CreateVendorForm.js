import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { vendorServices } from "@/app/services/vendorService";

const CreateVendorForm = () => {
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
    if(!formData.vendor_phone) newErrors.vendor_phone="Vendor Phone is required"

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFormSubmit = async () => {
    if (!validateForm()) return;
    try {
      const response = await vendorServices.createNewVendor(formData);
      if (response.success === true) {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <div className="h-[78vh] min-h-[78vh] max-h-[78vh] overflow-y-scroll">
        <div className="flex flex-col">
          <label>Vendor Name</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="vendor_name"
            value={formData.vendor_name}
            onChange={handleChange}
          />
          {errors.vendor_name && (
            <p className="text-red-500 text-xs">{errors.vendor_name}</p>
          )}
          <label>Vendor Address</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="vendor_address"
            value={formData.vendor_address}
            onChange={handleChange}
          />
          <label>Vendor Phone </label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="vendor_phone"
            value={formData.vendor_phone}
            onChange={handleChange}
          />
          {errors.vendor_phone && (
            <p className="text-red-500 text-xs">{errors.vendor_phone}</p>
          )}
          <label>Email </label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="vendor_email"
            value={formData.vendor_email}
            onChange={handleChange}
          />
          <label>Vendor Website</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="vendor_website"
            value={formData.vendor_website}
            onChange={handleChange}
          />
          <label>Zoho Contact Id</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="vendor_zoho_contact_id"
            value={formData.vendor_zoho_contact_id}
            onChange={handleChange}
          />
          <label>GST Identification Number</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="vendor_gst_identification_number"
            value={formData.vendor_gst_identification_number}
            onChange={handleChange}
          />

          <label>Point of Contact</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="vendor_point_of_contact"
            value={formData.vendor_point_of_contact}
            onChange={handleChange}
          />

          <label>Point of Contact Number</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="vendor_point_of_contact_phone"
            value={formData.vendor_point_of_contact_phone}
            onChange={handleChange}
          />

          <div className="flex flex-row gap-5">
            <div className="mt-2" onClick={onFormSubmit}>
              <Button
                title={"Create Vendor"}
                bgColor={"bg-[rgb(79,201,218)]"}
                radius={"rounded-lg"}
                height={"h-[3vw] min-h-[3vh]"}
                padding={"p-[1vw]"}
                color={"text-[#ffff]"}
                textSize={"text-[1vw]"}
                fontWeight={"font-medium"}
                width={"w-[14vw]"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVendorForm;
