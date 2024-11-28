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

const CreateRawMaterialForm = () => {
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
    if(!formData.material_category_id)
      newErrors.material_category_id="Category is required"
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFormSubmit = async () => {
    if (!validateForm()) return;
    try {
      const response = await rawMaterialServices.createRawMaterial(formData);
      if (response.success === true) {
        window.location.reload();
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
    <div>
      <div className="h-[78vh] min-h-[78vh] max-h-[78vh] overflow-y-scroll">
        <div className="flex flex-col">
          <div className="flex flex-col">
            <label>Select Category</label>
            <CategoryDropdown bgColor={"#F8F6F2"} options={allCategories} />
          </div>
          {errors.material_category_id && (
            <p className="text-red-500 text-xs">{errors.material_category_id}</p>
          )}
          <label>Material Name</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="material_name"
            value={formData.material_name}
            onChange={handleChange}
          />
          {errors.material_name && (
            <p className="text-red-500 text-xs">{errors.material_name}</p>
          )}

          <label>Material Description</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="material_description"
            value={formData.material_description}
            onChange={handleChange}
          />

          <label>Unit of Measure</label>
          <select
            className="w-full text-[#838481] font-medium px-4 py-[1vw] rounded-lg leading-tight focus:outline-none "
            style={{ backgroundColor: "#F8F6F2" }}
            name="unit_of_measure"
            value={formData.unit_of_measure}
            onChange={handleChange}
          >
            <option value="">Select Unit of Measure</option>
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>

          <label>Current Stock</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="current_stock"
            value={formData.current_stock}
            onChange={handleChange}
          />
          {errors.current_stock && (
            <p className="text-red-500 text-xs">{errors.current_stock}</p>
          )}

          <label>SKU Code</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="sku_code"
            value={formData.sku_code}
            onChange={handleChange}
          />
          {errors.sku_code && (
            <p className="text-red-500 text-xs">{errors.sku_code}</p>
          )}

          <label>Unit Price</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
          />

          <label>Lower Threshold</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="lower_threshold"
            value={formData.lower_threshold}
            onChange={handleChange}
          />

          <label>Upper Threshold</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="upper_threshold"
            value={formData.upper_threshold}
            onChange={handleChange}
          />

          <label>Zoho Item Id</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="zoho_item_id"
            value={formData.zoho_item_id}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row gap-5">
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
        </div>
      </div>
    </div>
  );
};

export default CreateRawMaterialForm;
