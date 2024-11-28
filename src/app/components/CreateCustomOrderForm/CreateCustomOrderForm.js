'use client'
import React, { useEffect, useState } from "react";
import Input from "../Input/Input";
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const CreateCustomOrderForm = () => {
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
    if (!formData.scheduledDispatchDate) newErrors.scheduledDispatchDate = "Scheduled dispatch date is required."; 
    if (!formData.orderId) newErrors.orderId = "Order ID is required.";
    if (!formData.orderTitle) newErrors.orderTitle = "Order title is required.";
    if (!formData.platform) newErrors.platform = "Platform selection is required.";
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
        toast.success('Custom B2B Order Created Successfully', {
          autoClose: 1500,
          onClose: () => window.location.reload(),
        });
        setFormDisabled(true);
      } else {
        toast.error('Failed to create order: ' + (response?.message || 'Unknown error'), {
          autoClose: 5000,
          onClose: () => window.location.reload(),
        });
        setFormDisabled(true);
      }
    } catch (err) {
      toast.error('Failed to create order: ' + err, { autoClose: 3000 }
      );
      window.location.reload();
    }
  };
  

  return (
    <div className="h-[78vh] min-h-[78vh] max-h-[78vh] overflow-y-scroll">
      <div className="flex flex-col mt-3">
      <ToastContainer />
        <CustomDatePicker onDateChange={handleDateChange} label="Order date" />
        {errors.orderDate && (
          <p className="text-red-500 text-xs">{errors.orderDate}</p>
        )}
      </div>
    
    {/* Scheduled Dispatch Date Picker */}
    <div className="flex flex-col mt-3">
      <CustomDatePicker
        onDateChange={handleScheduledDispatchDateChange} // New change handler
        label="Scheduled Dispatch Date" // New label
      />
      {errors.scheduledDispatchDate && (
        <p className="text-red-500 text-xs">{errors.scheduledDispatchDate}
        </p>
      )}
    </div>

      <div className="flex flex-col">
        <label>Order Id</label>
        <Input
          bgColor={"bg-[#F8F6F2]"}
          radius={"rounded-lg"}
          height={"h-[3.5vw] min-h-[3.5vh]"}
          padding={"p-[1vw]"}
          type={"text"}
          color={"text-[#838481]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          name="orderId"
          value={formData.orderId}
          onChange={handleChange}
        />
        {errors.orderId && (
          <p className="text-red-500 text-xs">{errors.orderId}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label>Order Title</label>
        <Input
          bgColor={"bg-[#F8F6F2]"}
          radius={"rounded-lg"}
          height={"h-[3.5vw] min-h-[3.5vh]"}
          padding={"p-[1vw]"}
          type={"text"}
          color={"text-[#838481]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          name="orderTitle"
          value={formData.orderTitle}
          onChange={handleChange}
        />
        {errors.orderTitle && (
          <p className="text-red-500 text-xs">{errors.orderTitle}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label>Platform/Mode</label>
        <select
          className="bg-[#F8F6F2] rounded-lg h-[3.5vw] min-h-[3.5vh] p-[1vw] text-[#838481] text-[1vw] font-medium"
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

      <div className="flex flex-col">
        <label>Retailer</label>
        <Input
          bgColor={"bg-[#F8F6F2]"}
          radius={"rounded-lg"}
          height={"h-[3.5vw] min-h-[3.5vh]"}
          padding={"p-[1vw]"}
          type={"text"}
          color={"text-[#838481]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          name="retailer"
          value={formData.retailer}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label>Location</label>
        <Input
          bgColor={"bg-[#F8F6F2]"}
          radius={"rounded-lg"}
          height={"h-[3.5vw] min-h-[3.5vh]"}
          padding={"p-[1vw]"}
          type={"text"}
          color={"text-[#838481]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label>Tracking Number</label>
        <Input
          bgColor={"bg-[#F8F6F2]"}
          radius={"rounded-lg"}
          height={"h-[3.5vw] min-h-[3.5vh]"}
          padding={"p-[1vw]"}
          type={"text"}
          color={"text-[#838481]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          name="trackingNumber"
          value={formData.trackingNumber}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label>Remarks</label>
        <Input
          bgColor={"bg-[#F8F6F2]"}
          radius={"rounded-lg"}
          height={"h-[3.5vw] min-h-[3.5vh]"}
          padding={"p-[1vw]"}
          type={"text"}
          color={"text-[#838481]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
        />
      </div>

      <label>List Of Products</label>
      <div className="flex flex-col p-4 border-2 border-[#F8F6F2] rounded-lg bg-white">
        <div className="flex flex-col">
          <label>Select Category</label>
          <CategoryDropdown bgColor={"#F8F6F2"} options={allCategories} />
        </div>
        <div className="flex flex-col">
          <label>Select Product</label>
          <ProductDropdown
            name="product_id"
            bgColor={"#F8F6F2"}
            options={allProductsByCatId}
          />
        </div>
        <div className="flex flex-col">
          <label>Quantity</label>
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
            placeholder={"Enter Quantity here"}
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
          />
        </div>

        <div onClick={handleAddProduct} className="mt-2">
          <Button
            title={"Add Product"}
            bgColor={"bg-[rgb(79,201,218)]"}
            radius={"rounded-lg"}
            height={"h-[3vw] min-h-[3vh]"}
            padding={"p-[1vw]"}
            color={"text-[#ffff]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            width={"w-[10vw]"}
          />
        </div>
        {errors.listOfProducts && (
          <p className="text-red-500 text-xs">{errors.listOfProducts}</p>
        )}

        <div className="mt-2">
          {formData.listOfProducts.length > 0 && <label>Products :</label>}

          <ul className="flex flex-row gap-4">
            {formData.listOfProducts.map((product, index) => (
              <li
                key={index}
                className="awb-number border bg-[#F8F6F2] text-black rounded-lg p-2  text-sm text-start"
                onClick={() => handleRemoveProductsFromList(index)}
              >
                <span className="remove-text text-xs font-semibold">
                  Remove
                </span>
                <div className="flex flex-col">
                  <span className="number px-3 text-black">
                    Product Name: {product?.productName}
                  </span>
                  <span className="number px-3 text-black">
                    Product Quantity: {product?.quantity}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-row gap-5">
        <div className="mt-2" onClick={onFormSubmit}>
          <Button
            title={"Create Order"}
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

      {formDisabled && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
          style={{ zIndex: 1000 }}
        />
      )}
      
    </div>
  );
};

export default CreateCustomOrderForm;

