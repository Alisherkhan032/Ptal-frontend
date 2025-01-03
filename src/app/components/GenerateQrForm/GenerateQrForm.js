"use client";

import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import { productServices } from "@/app/services/productService";
import Input from "../Input/Input";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";
import ProductDropdown from "../ProductDropdown/ProductDropdown";
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
import { useDispatch, useSelector } from "react-redux";
import { inventoryPOServices } from "@/app/services/inventoryPO";
import { categoryServices } from "@/app/services/categoryService";
import validationSchema from "@/app/utils/validations/inventoryPoVaiationSchema";
import { QrCodeServices } from "@/app/services/qrGenerate";
import { sfgCategories } from "@/app/constants/categoryConstants";

const GenerateQrForm = () => {
  const { allCategories, selectedCatId } = useSelector(
    (state) => state.category
  );

  const { allProductsByCatId } = useSelector((state) => state.product);
  const { dropDownProductValue } = useSelector((state) => state.dropdown);

  const [formData, setFormData] = useState({
    product_id: null,
    qrQuantity: null,
  });

  const [listInputes, setListInputs] = useState({
    quantity: null,
    batchNumber: null,
  });

  const [listData, setListData] = useState([]);

  console.log("listData==", listData);
  console.log("formData====", formData);
  console.log("listInputes===", listInputes);

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validateField = async (fieldName, value, schema) => {
    try {
      await schema.validateAt(fieldName, { [fieldName]: value });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: undefined,
      }));
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: err.message,
      }));
    }
  };

  const addItemsInListArray = () => {
    console.log("button clicked==");
    // Check if both batchNumber and quantity are filled
    if (listInputes.batchNumber !== null && listInputes.quantity !== null) {
      // Push the formData object into the listData array
      console.log("i am here to clear===");
      setListData([...listData, listInputes]); // Update the state
    } else {
      // Display an error message or handle invalid input
      console.error("Please fill in both batchNumber and quantity.");
    }
  };

  useEffect(() => {
    setFormData({
      product_id: dropDownProductValue,
      qrQuantity: formData.qrQuantity,
    });
  }, [dropDownProductValue]);
  console.log("formData====", formData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value === "" ? null : value,
    });
    if (name === "product_id") {
      validateField(name, value, validationSchema);
      // Remove validation error for product_id when a value is selected
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const handleChangeListData = (event) => {
    const { name, value } = event.target;
    setListInputs({
      ...listInputes,
      [name]: value === "" ? null : value,
    });
  };

  const getAllCategories = async () => {
    try {
      dispatch(getAllCategoryRequest());

      const response = await categoryServices.getAllCategories();
      // Show only fg categories
      const fgCategories = response.data.filter(
        (category) => !sfgCategories.includes(category.category_name)
      );

      if (response.success === true) {
        dispatch(getAllCategorySuccess(fgCategories));
      }
    } catch (err) {
      console.log(err);
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
    }
  };

  const generateQrCode = async () => {
    console.log("formata insie===", listData, formData);

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const response = await QrCodeServices.generateQr({ formData, listData });
      console.log("🚀 ~ generateQrCode ~ listData:", listData);
      console.log("🚀 ~ generateQrCode ~ formData:", formData);

      // Get the product name based on the selected product_id
      const product = await productServices.getProductById(formData.product_id);
      console.log("🚀 ~ generateQrCode ~ product:", product);
      const productName = product.data ? product.data.product_name : "Product";

      // Format today's date
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Construct the file name
      const fileName = `${productName}_${dateStr}.pdf`;

      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();

      // Clean up and remove the link
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log("response qr===", response);
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError") {
        const ValidationError = {};
        err.inner.forEach((error) => {
          ValidationError[error.path] = error.message;
        });
        setErrors(ValidationError);
      }
    }
  };

  useEffect(() => {
    getProductByCatId();
  }, [selectedCatId]);

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div>
      <div className="flex flex-col">
        <label>Category</label>
        <CategoryDropdown bgColor={"#F8F6F2"} options={allCategories} />
      </div>
      <div className="flex flex-col">
        <label>Finished Goods</label>
        <ProductDropdown
          name="product_id"
          bgColor={"#F8F6F2"}
          options={allProductsByCatId}
        />
        {errors.product_id && (
          <p className="text-xs mt-1 ml-1 flex items-start text-start text-red-500">
            {errors.product_id}
          </p>
        )}
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
          name="qrQuantity"
          value={formData.qrQuantity}
          onChange={handleChange}
        />
        {errors.qrQuantity && (
          <p className=" text-xs mt-1 ml-1 flex items-start text-start text-red-500">
            {errors.qrQuantity}
          </p>
        )}
      </div>

      <div className="flex gap-5 mt-5">
        <div>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"number"}
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            placeholder={"Enter batch number"}
            name="batchNumber"
            value={listInputes.batchNumber}
            onChange={handleChangeListData}
          />
        </div>
        <div>
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
            placeholder={"Enter quantity"}
            value={listInputes.quantity}
            onChange={handleChangeListData}
          />
        </div>
        <div onClick={addItemsInListArray}>
          <Button
            title={"+Add"}
            bgColor={"bg-[gray]"}
            radius={"rounded-lg"}
            height={"h-[3vw] min-h-[3vh]"}
            width={"w-[7vw] min-w-[7vw]"}
            padding={"p-[1vw]"}
            color={"text-[#ffff]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
          />
        </div>
        <div onClick={() => generateQrCode()}>
          <Button
            title={"Generate QR"}
            bgColor={"bg-[rgb(79,201,218)]"}
            radius={"rounded-lg"}
            height={"h-[3vw] min-h-[3vh]"}
            width={"w-[15vw] min-w-[15vw]"}
            padding={"p-[1vw]"}
            color={"text-[#ffff]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
          />
        </div>
      </div>
      <div className="w-full h-[31vh] rounded-lg border mt-2 overflow-y-scroll ">
        <ul className="flex p-2 flex-col gap-2">
          {listData.map((item) => (
            <li className="p-5 font-semibold flex gap-5 border rounded shadow-sm bg-[#ffffff] ">
              <span>Batch no : {item.batchNumber}</span>
              <span>Quantity : {item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenerateQrForm;
