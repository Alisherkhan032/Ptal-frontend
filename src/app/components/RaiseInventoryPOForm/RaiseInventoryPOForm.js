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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllCategorySuccess,
  getAllCategoryRequest,
  getAllCategoryFailure,
} from "../../Actions/categoryActions";
import { useDispatch, useSelector } from "react-redux";
import { inventoryPOServices } from "@/app/services/inventoryPO";
import { categoryServices } from "@/app/services/categoryService";
import validationSchema from "@/app/utils/validations/inventoryPoVaiationSchema2";
import { sfgCategories } from "@/app/constants/categoryConstants";
import "react-toastify/dist/ReactToastify.css";

const RaiseInventoryPOForm = () => {
  const { allCategories, selectedCatId } = useSelector(
    (state) => state.category
  );

  const [formDisabled, setFormDisabled] = useState(false); // State to disable form interactions
  const { allProductsByCatId } = useSelector((state) => state.product);
  const { dropDownProductValue, dropdownProductName } = useSelector(
    (state) => state.dropdown
  );

  const [formData, setFormData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    product_id: null,
    quantity: null,
  });

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

  useEffect(() => {
    setSelectedProduct({
      ...selectedProduct,
      product_id: dropDownProductValue,
      product_name: dropdownProductName,
    });
  }, [dropDownProductValue]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSelectedProduct({
      ...selectedProduct,
      [name]: value === "" ? null : value,
    });
    if (name === "product_id") {
      validateField(name, value, validationSchema);
      // Remove validation error for product_id when a value is selected
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
      console.log("i am errors", errors);
    }
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

  const createInventoryPOfunction = async () => {
    try {
      const response = await inventoryPOServices.createInventoryPO(formData);
      if (response.success === false) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          stockError: response.messages,
        }));
      } else {
        toast.success(`Inventory PO Created Successfully!`, {
          autoClose: 1500,
          onClose: () => window.location.reload(),
        });
        setFormDisabled(true); // Disable form interactions when toaster is shown
        return response.message;
      }
    } catch (err) {
      console.log(err.inner);
      if (err.name === "ValidationError") {
        const ValidationError = {};
        err.inner.forEach((error) => {
          ValidationError[error.path] = error.message;
        });
        setErrors(ValidationError);
      }
    }
  };
  const addMultipleProducts = async () => {
    const { product_id, quantity } = selectedProduct;
    const dataToValidate = { category_id: selectedCatId, product_id, quantity };
    try {
      await validationSchema.validate(dataToValidate, { abortEarly: false });
      setFormData((prevFormData) => [...prevFormData, selectedProduct]);

      setErrors({}); // Clear any existing errors
    } catch (err) {
      console.log("Validation failed:", err.inner);
      if (err.name === "ValidationError") {
        const ValidationError = {};
        err.inner.forEach((error) => {
          ValidationError[error.path] = error.message;
        });
        setErrors(ValidationError);
      }
    }
  };

  const removeProduct = (indexToRemove) => {
    const updatedFormData = formData.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData(updatedFormData);
  };

  useEffect(() => {
    getProductByCatId();
  }, [selectedCatId]);

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-col">
        <ToastContainer />
        <label>Category</label>
        <CategoryDropdown bgColor={"#F8F6F2"} options={allCategories} />
      </div>
      {errors.category_id && (
        <p className=" text-xs mt-1 ml-1 flex items-start text-start text-red-500">
          {errors.category_id}
        </p>
      )}
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
          name="quantity"
          value={selectedProduct.quantity}
          onChange={handleChange}
        />
        {errors.quantity && (
          <p className=" text-xs mt-1 ml-1 flex items-start text-start text-red-500">
            {errors.quantity}
          </p>
        )}
      </div>

      {errors.stockError && (
        <div
          id="popup-modal"
          tabIndex="-1"
          className=" flex  overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-[#F8F6F2] text-[#838481] rounded-lg shadow ">
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-[#838481] w-12 h-12 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                {errors.stockError.map((errMessage) => (
                  <h3 className="mb-5 text-lg font-normal text-[#838481] ">
                    {errMessage.message}
                  </h3>
                ))}

                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={() =>
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      stockError: null,
                    }))
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row gap-5">
        <div className="mt-2" onClick={addMultipleProducts}>
          <Button
            title={"Add Product"}
            bgColor={"bg-[rgb(79,201,218)]"}
            radius={"rounded-lg"}
            height={"h-[3vw] min-h-[3vh]"}
            padding={"p-[1vw] px-[2vw] py-[2vw]"}
            color={"text-[#ffff]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            width={"w-[7vw]"}
          />
        </div>
        {formData.length !== 0 && (
          <div className="mt-2" onClick={createInventoryPOfunction}>
            <Button
              title={"Raise Po"}
              bgColor={"bg-[rgb(79,201,218)]"}
              radius={"rounded-lg"}
              height={"h-[3vw] min-h-[3vh]"}
              padding={"p-[1vw] px-[2vw] py-[2vw]"}
              color={"text-[#ffff]"}
              textSize={"text-[1vw]"}
              fontWeight={"font-medium"}
              width={"w-[7vw]"}
            />
          </div>
        )}
      </div>
      <div className="mt-2 h-auto ">
        <ul className=" p-2 rounded">
          {formData.map((data, idx) => (
            <li
              className="flex gap-5 border shadow bg-[#ffffff] mb-2 p-2 rounded flex-row"
              key={idx}
            >
              <div className="gap-2">
                <span>Name : </span>
                <span>{data.product_name}</span>
              </div>
              <div className="gap-2">
                <span>Quantity : </span>
                <span>{data.quantity}</span>
              </div>
              <button
                className="bg-red-500 text-white rounded px-2"
                onClick={() => removeProduct(idx)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Overlay to prevent user interaction */}
      {formDisabled && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
          style={{ zIndex: 1000 }}
        />
      )}
    </div>
  );
};

export default RaiseInventoryPOForm;
