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

const CreateProductForm = () => {
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
    product_category_id:"",
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
        itemName:dropDownMatName
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
          <label>Select Category</label>
          <CategoryDropdown bgColor={"#F8F6F2"} options={allCategories} />
        </div>
        {errors.product_category_id && (
          <p className="text-red-500 text-xs">{errors.product_category_id}</p>
        )}
        <div className="flex flex-col">
          <label>Product Name</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
          />
          {errors.product_name && (
            <p className="text-red-500 text-xs">{errors.product_name}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label>Product Description</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="product_description"
            value={formData.product_description}
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

          <label>Unit of Measure</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="unit_of_measure"
            value={formData.unit_of_measure}
            onChange={handleChange}
          />

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

          <label>SKU code</label>
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

          <label>Amazon SKU code</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="amazon_sku_code"
            value={formData.amazon_sku_code}
            onChange={handleChange}
          />

          <label>Shopify SKU code</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="shopify_sku_code"
            value={formData.shopify_sku_code}
            onChange={handleChange}
          />
        </div>

        <label>List Of Raw Materials</label>
        <div className="flex flex-col p-4 border-2 border-[#F8F6F2] rounded-lg bg-white">
          <div className="flex flex-col">
            <label>Select Raw Material</label>
            <RawMateialDropDown
              name="rawmaterial_id"
              bgColor={"#F8F6F2"}
              options={allMaterials}
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
              value={rawMaterialQuantity}
              onChange={(e) => setRawMaterialQuantity(e.target.value)}
            />
          </div>

          <div onClick={handleAddItem} className="mt-2">
            <Button
              title={"Add Raw Material"}
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
          {errors.items && (
            <p className="text-red-500 text-xs">{errors.items}</p>
          )}

          <div className="mt-2">
            {formData.items.length > 0 && <label>Raw Materials :</label>}

            <ul className="flex flex-row gap-4">
              {formData.items.map((item, index) => (
                <li
                  key={index}
                  className="awb-number border bg-[#F8F6F2] text-black rounded-lg p-2  text-sm text-start"
                  onClick={() => handleRemoveItemFromList(index)}
                >
                  <span className="remove-text text-xs font-semibold">
                    Remove
                  </span>
                  <div className="flex flex-col">
                    <span className="number px-3 text-black">
                      Material Name: {item?.itemName}
                    </span>
                    <span className="number px-3 text-black">
                       Quantity: {item?.quantity}
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
        </div>
      </div>
    </div>
  );
};

export default CreateProductForm;
