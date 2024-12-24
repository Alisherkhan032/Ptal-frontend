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
import { assemblyPOServices } from "@/app/services/assemblyPO";
import { categoryServices } from "@/app/services/categoryService";
import validationSchema from "@/app/utils/validations/productAssemblyPoVaidationSchema";
import { sfgCategories } from "@/app/constants/categoryConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SecondaryButton,
  PrimaryButton,
} from "../ButtonComponent/ButtonComponent";

const RaiseAssemblyFGPoComponent = ({ onCancel }) => {
  const initialFormData = {
    product_id: null,
    quantity: null,
  };

  const { allCategories, selectedCatId } = useSelector(
    (state) => state.category
  );
//   console.log('allCategories===', allCategories);

  const { allProductsByCatId } = useSelector((state) => state.product);
  const { dropDownProductValue, dropDownVendorValue } =
    useSelector((state) => state.dropdown);
  

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [formDisabled, setFormDisabled] = useState(false); // State to disable form interactions

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
    setFormData({
        product_id: dropDownProductValue,
      quantity: formData.quantity,
    });
  }, [dropDownProductValue]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value === "" ? null : value,
    });
    if (name === "product_id") {
      validateField(name, value, validationSchema);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const getAllCategories = async () => {
    try {
      dispatch(getAllCategoryRequest());

      const response = await categoryServices.getAllCategories();
      // Show only sfg categories
      const categoriesToShow = response.data.filter((category) =>
        !sfgCategories.includes(category.category_name)
      );

      if (response.success === true) {
        dispatch(getAllCategorySuccess(categoriesToShow));
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
      console.log('here====')
      if (response.success === true) {
        dispatch(getAllProductByCatIdSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createProductAssemblyPO = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const response = await productServices.createAssembyPOByPoductId(
        formData
      );
      if (response.success === false) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          stockError: response.messages,
        }));
      } else {
        toast.success(`FG Aseembly PO Created Successfully!`, {
          autoClose: 1500,
          onClose: () => window.location.reload(),
        });
        setFormDisabled(true); // Disable form interactions when toaster is shown
        return response.message;
      }
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
    <>
      <div className=" relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <ToastContainer position="bottom-center" />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Raise FG Assembly PO
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
        Create a purchase order for Finished Goods for the storage team to arrange it for you.
        </p>

        <div className="flex flex-col my-6">
          <label className="block text-[#111928] text-sm font-medium mb-1">
            Category
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <CategoryDropdown options={allCategories} />
        </div>

        <div className="flex flex-col mb-6">
          <label className="block text-[#111928] text-sm font-medium mb-1">
            Furnished Goods
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <ProductDropdown options={allProductsByCatId} name="product_id" />
          {errors.product_id && (
            <p className="text-xs mt-1 ml-1 flex items-start text-start text-red-500">
              {errors.product_id}
            </p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <label className="block text-[#111928] text-sm font-medium mb-1">
            Quantity
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <Input
            radius={"rounded-xl"}
            height={"h-10"}
            padding={"p-[1vw]"}
            type={"number"}
            color={"text-[#838481]"}
            textSize={"text-sm"}
            fontWeight={"font-normal"}
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder={"Enter Quantity"}
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
                  <h3 className="mb-5 text-lg font-normal text-[#838481] ">
                    {errors.stockError}
                  </h3>

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
      </div>
      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Cancel" size='full' onClick={onCancel} />
          </div>
          <div className="flex-1">
            <PrimaryButton
              title="Raise PO"
              onClick={createProductAssemblyPO}
            //   disabled={finalFormData.length === 0}  
              size='full'
              bgColor="bg-primary"
            />
          </div>
        </div>
      </div>
      {formDisabled && (
      <div
        className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
        style={{ zIndex: 1000 }}
      />
    )}
    </>
  );
};

export default RaiseAssemblyFGPoComponent;
