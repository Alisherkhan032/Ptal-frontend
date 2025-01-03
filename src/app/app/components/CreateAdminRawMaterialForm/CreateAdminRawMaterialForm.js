"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Input from "../Input/Input";
import {
  getAllCategorySuccess,
  getAllCategoryRequest,
  getAllCategoryFailure,
} from "../../Actions/categoryActions";
import ProductDropdown from "../ProductDropdown/ProductDropdown";
import Button from "../Button/Button";
import { rawMaterialServices } from "@/app/services/rawMaterialService";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";
import { categoryServices } from "@/app/services/categoryService";
import { sfgCategories } from "@/app/constants/categoryConstants";
import { productServices } from "@/app/services/productService";
import {
  getAllProductByCatIdRequest,
  getAllProductByCatIdSuccess,
  getAllProductByCatIdFailure,
} from "../../Actions/productActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "../Select/Select";
import {
  PrimaryButton,
  SecondaryButton,
} from "../ButtonComponent/ButtonComponent";

const CreateAdminRawMaterialForm = ({ onCancel }) => {
  const { allCategories, selectedCatId } = useSelector(
    (state) => state.category
  );
  const [errors, setErrors] = useState({});
  const authUser = useSelector((state) => state.auth);
  const warehouse_id = authUser.userInfo.warehouseId;
  const { allProductsByCatId } = useSelector((state) => state.product);

  const units = ["kilograms", "litres", "units"];

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    material_name: "",
    material_description: "",
    material_category_id: "",
    unit_of_measure: "",
    current_stock: null,
    warehouse_id: warehouse_id,
    sku_code: "",
    unit_price: null,
    lower_threshold: null,
    upper_threshold: null,
    zoho_item_id: "",
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
    if (!formData.material_name)
      newErrors.material_name = "Material name is required.";
    if (!formData.sku_code) newErrors.sku_code = "SKU code is required";
    if (!formData.current_stock)
      newErrors.current_stock = "Current Stock is required";
    if (!formData.material_category_id)
      newErrors.material_category_id = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFormSubmit = async () => {
    if (!validateForm()) return;
    try {
      const response = await rawMaterialServices.createRawMaterial(formData);
      if (response.success === true) {
        toast.success(`Your Vendor PO was raised successfully`, {
          autoClose: 1500,
          onClose: () => {
            onCancel(); // Close the sidebar
            window.location.reload(); // Refresh the page after the toast is shown
          },
          disableClick: true,
          className:
            "bg-green-light-6 text-green-dark p-4 rounded-lg shadow-lg text-sm",
        });
        setFormDisabled(true); // Disable form interactions when toaster is shown
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllCategories = async () => {
    try {
      dispatch(getAllCategoryRequest());
      const response = await categoryServices.getAllCategories();
      const categoriesToShow = response.data.filter((category) =>
        sfgCategories.includes(category.category_name)
      );
      if (response.success === true) {
        dispatch(getAllCategorySuccess(categoriesToShow));
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      material_category_id: selectedCatId,
    }));
  }, [selectedCatId]);

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <>
      <div className=" relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <ToastContainer position="bottom-center" />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Create Raw Material
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Add details of the following categories to add a material in the
          system
        </p>

        <div className="flex flex-col my-6">
          <label className="block text-[#111928] text-sm font-medium mb-1">
            Select Category
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <CategoryDropdown options={allCategories} />
          {errors.material_category_id && (
            <p className="text-red-500 text-xs">
              {errors.material_category_id}
            </p>
          )}
        </div>

        <div className="flex flex-col my-6">
          <label className="block text-[#111928] text-sm font-medium mb-1">
            Material Name
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <Input
            type={"text"}
            placeholder="Enter Material Name"
            name="material_name"
            value={formData.material_name}
            onChange={handleChange}
          />
          {errors.material_name && (
            <p className="text-red-500 text-xs">{errors.material_name}</p>
          )}
        </div>

        <div className="flex flex-col my-6">
          <label className="block text-[#111928] text-sm font-medium mb-1">
            Material Description
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <Input
            type={"text"}
            placeholder="Enter Material Description"
            name="material_description"
            value={formData.material_description}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-x-4 mb-6">
          {/* Unit of measure Field */}
          <div className="flex flex-col w-[47.5%]">
            <label className="block text-[#111928] text-sm font-medium mb-1">
              Unit of Measure
              <span className="text-[#9CA3AF] ml-[2px]">*</span>
            </label>
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
            <label className="block text-[#111928] text-sm font-medium mb-1">
              SKU Code
              <span className="text-[#9CA3AF] ml-[2px]">*</span>
            </label>
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
            <label className="block text-[#111928] text-sm font-medium mb-1">
              Unit Price
              <span className="text-[#9CA3AF] ml-[2px]">*</span>
            </label>
            <Input
              type={"text"}
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              placeholder={"Enter Unit Price"}
            />
          </div>

          {/* Current Stock Field */}
          <div className="flex flex-col w-[47.5%]">
            <label className="block text-[#111928] text-sm font-medium mb-1">
              Current Stock
              <span className="text-[#9CA3AF] ml-[2px]">*</span>
            </label>
            <Input
              type={"text"}
              name="current_stock"
              value={formData.current_stock}
              onChange={handleChange}
              placeholder={"Enter Current Stock"}
            />
            {errors.current_stock && (
              <p className="text-red-500 text-xs">{errors.current_stock}</p>
            )}
          </div>
        </div>

        <div className="flex gap-x-4 mb-6">
          {/* Lower Threshold Field */}
          <div className="flex flex-col w-[47.5%]">
            <label className="block text-[#111928] text-sm font-medium mb-1">
              Lower Threshold
              <span className="text-[#9CA3AF] ml-[2px]">*</span>
            </label>
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
            <label className="block text-[#111928] text-sm font-medium mb-1">
              Upper Threshold
              <span className="text-[#9CA3AF] ml-[2px]">*</span>
            </label>
            <Input
              type={"text"}
              name="upper_threshold"
              value={formData.upper_threshold}
              onChange={handleChange}
              placeholder={"Enter Upper Threshold"}
            />
          </div>
        </div>

        <div className="flex flex-col my-6">
          <label className="block text-[#111928] text-sm font-medium mb-1">
            Zoho Item Id
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <Input
            type={"text"}
            placeholder="Enter Zoho Item Id"
            name="zoho_item_id"
            value={formData.zoho_item_id}
            onChange={handleChange}
          />
        </div>

        {/* <div className="flex flex-row gap-5">
          <div className="mt-2" onClick={onFormSubmit}>
            <Button
              title={"Create Raw Material"}
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
              title="Create Raw Material"
              onClick={onFormSubmit}
              disabled={formData.length === 0}
              size="full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAdminRawMaterialForm;
