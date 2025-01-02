"use client";
import React, { useState, useEffect } from "react";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";
import {
  getAllCategorySuccess,
  getAllCategoryRequest,
  getAllCategoryFailure,
} from "../../Actions/categoryActions";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { productServices } from "@/app/services/productService";
import { sfgCategories } from "@/app/constants/categoryConstants";
import {
  getAllMaterialFailure,
  getAllMaterialSuccess,
  getAllMaterialRequest,
} from "@/app/Actions/materialActions";
import { useDispatch, useSelector } from "react-redux";
import { categoryServices } from "@/app/services/categoryService";
import { rawMaterialServices } from "@/app/services/rawMaterialService";
import RawMateialDropDown from "../RawMateialDropDown/RawMateialDropDown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PrimaryButton,
  SecondaryButton,
} from "../ButtonComponent/ButtonComponent";
import Label from "../Label/Label";
import Select from "../Select/Select";

const CreateAdminProductForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const { allCategories, selectedCatId } = useSelector(
    (state) => state.category
  );
  const [rawMaterialQuantity, setRawMaterialQuantity] = useState(null);
  const { dropDownMatValue, dropDownMatName } = useSelector(
    (state) => state.dropdown
  );
  const allMaterials = useSelector((state) => state.material.allMaterials);

  const [errors, setErrors] = useState({});

  const warehouse_id = useSelector((state) => state.auth.userInfo.warehouseId);
  const units = ["kilograms", "litres", "units"];

  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    product_category_id: "",
    unit_of_measure: null,
    current_stock: null,
    current_count: null,
    lower_threshold: null,
    upper_threshold: null,
    warehouse_id: warehouse_id,
    sku_code: "",
    amazon_sku_code: "",
    shopify_sku_code: "",
    items: [],
  });

  const handleRemoveItemFromList = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: prevFormData.items.filter((_, i) => i !== index),
    }));
  };

  const handleAddItem = () => {
    if (dropDownMatValue && rawMaterialQuantity) {
      const newItem = {
        rawmaterial_id: dropDownMatValue,
        quantity: rawMaterialQuantity,
        itemName: dropDownMatName,
      };
      setFormData((prevFormData) => ({
        ...prevFormData,
        items: [...prevFormData.items, newItem],
      }));
      setRawMaterialQuantity("");
      setErrors({});
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        items: "Please select a product and enter quantity.",
      }));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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

  const getAllMaterials = async () => {
    try {
      dispatch(getAllMaterialRequest());
      const response = await rawMaterialServices.getAllRawMaterials();
      if (response.success === true) {
        dispatch(getAllMaterialSuccess(response.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(getAllMaterialFailure());
    }
  };

  useEffect(() => {
    getAllMaterials();
    setFormData((prevFormData) => {
      return { ...prevFormData, product_category_id: selectedCatId };
    });
  }, [selectedCatId]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_name)
      newErrors.product_name = "Product name is required.";
    if (!formData.sku_code) newErrors.sku_code = "SKU code is required.";
    if (!formData.product_category_id)
      newErrors.product_category_id = "Category is required";
    if (formData.items.length === 0)
      newErrors.items = "At least one product must be added.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFormSubmit = async () => {
    if (!validateForm()) return;
    try {
      const response = await productServices.createNewProduct(formData);
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
          Create Product
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Add details of the following categories to add a material in the
          system
        </p>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Select Category" />
          <CategoryDropdown options={allCategories} />
          {errors.product_category_id && (
            <p className="text-red-500 text-xs">{errors.product_category_id}</p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Product Name" />
          <Input
            type={"text"}
            size="medium"
            name="product_name"
            placeholder="Enter Product Name"
            value={formData.product_name}
            onChange={handleChange}
          />
          {errors.product_name && (
            <p className="text-red-500 text-xs">{errors.product_name}</p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <Label isRequired={true} text="Product Description" />
          <Input
            type={"text"}
            size="medium"
            name="product_description"
            placeholder="Enter Product Description"
            value={formData.product_description}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-x-4 mb-6">
          {/* Unit of measure Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Unit of Measure" />
            <Select
              name="unit_of_measure"
              value={formData.unit_of_measure}
              onChange={handleChange}
              options={units}
              placeholder="Select Unit of Measure"
              size="medium"
            />
          </div>

          {/* SKU code Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="SKU Code" />
            <Input
              type={"text"}
              name="sku_code"
              value={formData.sku_code}
              onChange={handleChange}
              placeholder={"Enter SKU Code"}
            />
            {errors.sku_code && (
              <p className="text-red-500 text-xs">{errors.sku_code}</p>
            )}
          </div>
        </div>

        <div className="flex gap-x-4 mb-6">
          {/* Unit Price Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Unit of Measure" />
            <Input
              type={"text"}
              name="unit_price"
              value={formData.unit_of_measure}
              onChange={handleChange}
              placeholder={"Enter Unit of Measure"}
            />
          </div>

          {/* Current Stock Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Current Stock" />
            <Input
              type={"text"}
              name="current_stock"
              value={formData.current_stock}
              onChange={handleChange}
              placeholder={"Enter Current Stock"}
            />
          </div>
        </div>

        <div className="flex gap-x-4 mb-6">
          {/* Lower Threshold Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Lower Threshold" />
            <Input
              type={"text"}
              name="lower_threshold"
              value={formData.lower_threshold}
              onChange={handleChange}
              placeholder={"Enter Lower Threshold"}
            />
          </div>

          {/* Upper Threshold Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Upper Threshold" />
            <Input
              type={"text"}
              name="upper_threshold"
              value={formData.upper_threshold}
              onChange={handleChange}
              placeholder={"Enter Upper Threshold"}
            />
          </div>
        </div>

        <div className="flex gap-x-4 mb-6">
          {/* Amazon SKU code Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Amazon SKU Code" />
            <Input
              type={"text"}
              name="amazon_sku_code"
              value={formData.amazon_sku_code}
              onChange={handleChange}
              placeholder={"Enter Amazon SKU Code"}
            />
          </div>

          {/* Upper Threshold Field */}
          <div className="flex flex-col w-[47.5%]">
            <Label isRequired={true} text="Shopify SKU code" />
            <Input
              type={"text"}
              name="shopify_sku_code"
              value={formData.shopify_sku_code}
              onChange={handleChange}
              placeholder={"Enter Shopify SKU code"}
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#111928] mb-1">
            Configure Raw Material Details: -{" "}
          </h2>
          <div className="mt-3 bg-gray-1 p-3 rounded-lg">
            <div className="flex flex-col mb-6 ">
              <Label isRequired={true} text="Select Raw Material" />
              <RawMateialDropDown
                bgColor={"#F8F6F2"}
                name="Category"
                options={allMaterials}
              />
            </div>

            <div className="flex flex-col mb-6">
              <Label isRequired={true} text="Quantity" />
              <Input
                type={"number"}
                size="medium"
                name="quantity"
                placeholder={"Enter Quantity here"}
                value={rawMaterialQuantity}
                onChange={(e) => setRawMaterialQuantity(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-2">
          <SecondaryButton
            title="+ Add Raw Material"
            size="full"
            onClick={handleAddItem}
          />
        </div>
        {errors.items && <p className="text-red-500 text-xs">{errors.items}</p>}

        <div className="mt-4 h-auto w-full mb-8">
          <ul>
            {formData.items.length > 0 && (
              <h2 className="text-base font-semibold text-dark mb-2">
                Selected PO Items: {formData.items.length}
              </h2>
            )}

            {formData.items.map((data, idx) => (
              <li
                key={idx}
                className="shadow-sm rounded-lg py-3 bg-white flex items-center justify-between space-x-4 px-4"
              >
                <div className="flex-grow min-w-0 py-2 px-1 rounded-lg bg-gray-1">
                  <div className="flex justify-between items-center mb-2 ">
                    <span className="text-dark font-medium text-sm">
                      {data.itemName}
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
                  onClick={() => handleRemoveItemFromList(idx)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* <div className="flex flex-row gap-5">
          <div className="mt-2" onClick={onFormSubmit}>
            <Button
              title={"Create Product"}
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
        </div> */}
      </div>

      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Cancel" size="full" onClick={onCancel} />
          </div>
          <div className="flex-1">
            <PrimaryButton
              title="Create Product"
              onClick={onFormSubmit}
              disabled={formData.items.length === 0}
              size="full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAdminProductForm;
