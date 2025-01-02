"use client";
import React, { useEffect, useState } from "react";
import Input from "../Input/Input";
import Label from "../Label/Label";
import Select from "../Select/Select";
import {
  PrimaryButton,
  SecondaryButton,
} from "../ButtonComponent/ButtonComponent";
import Button from "../Button/Button";
import CustomDatePicker from "../DatePicker/DatePicker";
import dayjs from "dayjs";
import { productServices } from "@/app/services/productService";
import {
  getAllProductByCatIdRequest,
  getAllProductByCatIdSuccess,
  getAllProductByCatIdFailure,
} from "../../Actions/productActions";

import {
  getAllCategorySuccess,
  getAllCategoryRequest,
  getAllCategoryFailure,
} from "../../Actions/categoryActions";

import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";
import ProductDropdown from "../ProductDropdown/ProductDropdown";
import { useDispatch, useSelector } from "react-redux";
import { categoryServices } from "@/app/services/categoryService";
import "./CreateCustomOrderForm.css";
import { orderServices } from "@/app/services/oderService";
import { sfgCategories } from "@/app/constants/categoryConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCustomOrderForm = ({ onCancel }) => {
  const { allCategories, selectedCatId } = useSelector(
    (state) => state.category
  );

  const { allProductsByCatId } = useSelector((state) => state.product);
  const { dropDownProductValue, dropdownProductName } = useSelector(
    (state) => state.dropdown
  );

  const [selectedDate, setSelectedDate] = useState();

  const [scheduledDispatchDate, setScheduledDispatchDate] = useState();
  const [formDisabled, setFormDisabled] = useState(false);

  const [formData, setFormData] = useState({
    orderDate: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    scheduledDispatchDate: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    platform: "",
    orderId: "",
    awbNumbers: [],
    orderTitle: "",
    retailer: "",
    location: "",
    trackingNumber: "",
    remarks: "",
    subOrderNumber: "",
    listOfProducts: [],
  });
  const [productQuantity, setProductQuantity] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const dispatch = useDispatch();

  const handleDateChange = (newDate) => {
    const adjustedDate = newDate.clone().startOf("day");
    const formattedDate = adjustedDate.format("YYYY-MM-DD HH:mm:ss");
    setSelectedDate(formattedDate);
    setFormData((prevFormData) => ({
      ...prevFormData,
      orderDate: formattedDate,
    }));
  };

  const handleScheduledDispatchDateChange = (newDate) => {
    const adjustedDate = newDate.clone().startOf("day");
    const formattedDate = adjustedDate.format("YYYY-MM-DD HH:mm:ss");
    setScheduledDispatchDate(formattedDate);
    setFormData((prevFormData) => ({
      ...prevFormData,
      scheduledDispatchDate: formattedDate,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handlePlatformChange = (e) => {
    const platform = e.target.value;
    setSelectedPlatform(platform);
    setFormData((prevFormData) => ({
      ...prevFormData,
      platform: platform,
    }));
  };

  const handleRemoveProductsFromList = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      listOfProducts: prevFormData.listOfProducts.filter((_, i) => i !== index),
    }));
  };

  const handleAddProduct = () => {
    if (dropDownProductValue && productQuantity) {
      const newProduct = {
        skuCode: dropDownProductValue,
        quantity: productQuantity,
        productName: dropdownProductName,
      };
      setFormData((prevFormData) => ({
        ...prevFormData,
        listOfProducts: [...prevFormData.listOfProducts, newProduct],
      }));
      setProductQuantity("");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        listOfProducts: "Please select a product and enter quantity.",
      }));
    }
  };

  const getAllCategories = async () => {
    try {
      dispatch(getAllCategoryRequest());

      const response = await categoryServices.getAllCategories();
      const fgCategories = response.data.filter(
        (category) => !sfgCategories.includes(category.category_name)
      );

      if (response.success === true) {
        dispatch(getAllCategorySuccess(fgCategories));
      }
    } catch (err) {
      console.log(err);
      dispatch(getAllCategoryFailure());
    }
  };

  const getProductByCatId = async () => {
    try {
      dispatch(getAllProductByCatIdRequest());
      const response = await productServices.getAllProductsByCatId(
        selectedCatId
      );
      if (response.success === true) {
        dispatch(getAllProductByCatIdSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
      dispatch(getAllProductByCatIdFailure());
    }
  };

  useEffect(() => {
    getProductByCatId();
  }, [selectedCatId]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.orderDate) newErrors.orderDate = "Order date is required.";
    if (!formData.scheduledDispatchDate)
      newErrors.scheduledDispatchDate = "Scheduled dispatch date is required.";
    if (!formData.orderId) newErrors.orderId = "Order ID is required.";
    if (!formData.orderTitle) newErrors.orderTitle = "Order title is required.";
    if (!formData.platform)
      newErrors.platform = "Platform selection is required.";
    if (formData.listOfProducts.length === 0)
      newErrors.listOfProducts = "At least one product must be added.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFormSubmit = async () => {
    console.log("Form submitted"); // Check if this logs
    if (!validateForm()) return;
    try {
      const response = await orderServices.createOrder(formData);
      if (response && response.success) {
        toast.success("Custom B2B Order Created Successfully", {
          autoClose: 1500,
          onClose: () => window.location.reload(),
        });
        setFormDisabled(true);
      } else {
        toast.error(
          "Failed to create order: " + (response?.message || "Unknown error"),
          {
            autoClose: 5000,
            onClose: () => window.location.reload(),
          }
        );
        setFormDisabled(true);
      }
    } catch (err) {
      toast.error("Failed to create order: " + err, { autoClose: 3000 });
      window.location.reload();
    }
  };

  return (
    <>
      <div className=" relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <ToastContainer position="bottom-center" />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Create Custom Order
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Create the purchase order to be made.
        </p>
        {/* Order date */}
        <div className="flex flex-col mb-6">
          <CustomDatePicker
            onDateChange={handleDateChange}
            label="Order date"
          />
          {errors.orderDate && (
            <p className="text-red-500 text-xs">{errors.orderDate}</p>
          )}
        </div>

        {/* Scheduled Dispatch Date Picker */}
        <div className="flex flex-col mb-6">
          <CustomDatePicker
            onDateChange={handleScheduledDispatchDateChange} // New change handler
            label="Scheduled Dispatch Date" // New label
          />
          {errors.scheduledDispatchDate && (
            <p className="text-red-500 text-xs">
              {errors.scheduledDispatchDate}
            </p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Order Id" />
          <Input
            type={"text"}
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            placeholder="Enter Order Id"
          />
          {errors.orderId && (
            <p className="text-red-500 text-xs">{errors.orderId}</p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Order Title" />
          <Input
            type={"text"}
            name="orderTitle"
            value={formData.orderTitle}
            onChange={handleChange}
            placeholder="Enter Order Title"
          />
          {errors.orderTitle && (
            <p className="text-red-500 text-xs">{errors.orderTitle}</p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Platform mode" />
          <select
            className="bg-white rounded-xl h-10 px-4 py-2 text-[#838481] text-sm border border-[#DFE4EA] font-normal"
            value={selectedPlatform}
            onChange={handlePlatformChange}
          >
            <option value="">Select Platform</option>
            <option value="B2B">B2B</option>
            <option value="Custom">Custom</option>
            <option value="Custom-Amazon">Custom-Amazon</option>
            <option value="Custom-Easyecom">Custom-Easyecom</option>
          </select>
          {errors.platform && (
            <p className="text-red-500 text-xs">{errors.platform}</p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Retailer" />
          <Input
            type={"text"}
            name="retailer"
            value={formData.retailer}
            onChange={handleChange}
            placeholder="Enter Retailer"
          />
        </div>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Location" />
          <Input
            placeholder="Enter Location"
            type={"text"}
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Tracking Number" />
          <Input
            type={"text"}
            placeholder="Enter Tracking number"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Remarks" />
          <Input
            type={"text"}
            placeholder="Enter Remarksx"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#111928] mb-1">
            List Of Products -{" "}
          </h2>

          <div className="mt-3 bg-gray-1 p-3 rounded-lg">
            <div className="flex flex-col mb-6 ">
              <Label isRequired={true} text="Select Category" />
              <CategoryDropdown bgColor={"#F8F6F2"} options={allCategories} />
            </div>

            <div className="flex flex-col mb-6">
              <Label isRequired={true} text="Select Product" />
              <ProductDropdown
                name="product_id"
                bgColor={"#F8F6F2"}
                options={allProductsByCatId}
              />
            </div>

            <div className="flex flex-col mb-6">
              <Label isRequired={true} text="Quantity" />
              <Input
                type={"number"}
                name="quantity"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
                placeholder={"Enter Quantity"}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 mt-2">
          <SecondaryButton
            title="Add Products"
            size="full"
            onClick={handleAddProduct}
          />
        </div>

        <div className="mt-4 h-auto w-full mb-8">
          <ul>
            {formData.listOfProducts.length > 0 && (
              <h2 className="text-base font-semibold text-dark mb-2">
                Selected Items: {formData.listOfProducts.length}
              </h2>
            )}

            {formData.listOfProducts.map((data, idx) => (
              <li
                key={idx}
                className="shadow-sm rounded-lg py-3 bg-white flex items-center justify-between space-x-4 px-4"
              >
                <div className="flex-grow min-w-0 py-2 px-1 rounded-lg bg-gray-1">
                  <div className="flex justify-between items-center mb-2 ">
                    <span className="text-dark font-medium text-sm">
                      {data.productName}
                    </span>
                  </div>

                  {/* Quantity, Weight, and Bill Number in One Row */}
                  <div className="flex justify-between gap-6 overflow-hidden">
                    <div className="flex gap-x-2">
                      <span className="font-normal text-sm text-dark-4">
                        Quantity:
                      </span>
                      <span className="font-normal text-sm text-dark-4">
                        {data.quantity}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="flex-shrink-0 ml-4"
                  onClick={() => handleRemoveProductsFromList(idx)}
                  disabled={formDisabled}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>

        {formDisabled && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
            style={{ zIndex: 1000 }}
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Cancel" size="full" onClick={onCancel} />
          </div>
          <div className="flex-1">
            <PrimaryButton
              title="Create Order"
              onClick={onFormSubmit}
              // disabled={finalFormData.length === 0}
              size="full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCustomOrderForm;
