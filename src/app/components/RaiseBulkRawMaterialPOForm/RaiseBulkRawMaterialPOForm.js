"use client";
import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import { rawMaterialServices } from "@/app/services/rawMaterialService";
import Input from "../Input/Input";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";
import RawMateialDropDown from "../RawMateialDropDown/RawMateialDropDown";
import {
  getAllMaterialByCatIdRequest,
  getAllMaterialByCatIdSuccess,
  getAllMaterialByCatIdFailure,
} from "../../Actions/materialActions";
import {
  getAllCategorySuccess,
  getAllCategoryRequest,
  getAllCategoryFailure,
} from "../../Actions/categoryActions";
import { useDispatch, useSelector } from "react-redux";
import { bulkRawMaterialPOServices } from "@/app/services/bulkRawMaterialPOService";
import { categoryServices } from "@/app/services/categoryService";
import validationSchema from "@/app/utils/validations/assemblyPoValidationSchema";
import { sfgCategories } from "@/app/constants/categoryConstants";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const RaiseBulkRawMaterialPOForm = () => {
  const { allCategories, selectedCatId } = useSelector(
    (state) => state.category
  );

  const { allMaterialsByCatId } = useSelector((state) => state.material);
  const { dropDownMatValue, dropDownVendorValue } = useSelector(
    (state) => state.dropdown
  );

  const [formDisabled, setFormDisabled] = useState(false); // State to disable form interactions
  const [bulkOrderReference, setbulkOrderReference] = useState("");

  const [formData, setFormData] = useState({
    raw_material_id: null,
    quantity: null,
    bulkOrderReference: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  console.log("errors====", errors);

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
    // Update formData when dropDownMatValue or dropDownVendorValue changes
    setFormData({
      raw_material_id: dropDownMatValue,
      quantity: formData.quantity,
    });
  }, [dropDownMatValue]);
  console.log("formData====", formData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "bulkOrderReference") {
      setbulkOrderReference(value); // Update b2bOrderReference state
    }
    setFormData({
      ...formData,
      [name]: value === "" ? null : value,
    });
    if (name === "raw_material_id") {
      validateField(name, value, validationSchema);
    }
  };
  

  const getAllCategories = async () => {
    try {
      dispatch(getAllCategoryRequest());

      const response = await categoryServices.getAllCategories();
      // Show only sfg categories
      const categoriesToShow = response.data.filter((category) =>
        sfgCategories.includes(category.category_name)
      );
      if (response.success === true) {
        dispatch(getAllCategorySuccess(categoriesToShow));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getRawMaterialByCatId = async () => {
    try {
      dispatch(getAllMaterialByCatIdRequest());
      const response = await rawMaterialServices.getAllRawMaterialsByCatId(
        selectedCatId
      );
      if (response.success === true) {
        dispatch(getAllMaterialByCatIdSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createNewB2BPO = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const checkRawMaterial = await rawMaterialServices.checkRawMaterialStock(
        formData
      );

      if (checkRawMaterial.success === true) {
        

        const response = await bulkRawMaterialPOServices.createBulkRawMaterialPO(formData);
        if (response.success === true) {
          toast.success(`Bulk Order PO Created Successfully!`, {
            autoClose: 1500,
            onClose: () => window.location.reload(),
          });
          setFormDisabled(true); // Disable form interactions when toaster is shown
        }
        return response;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          stockError: checkRawMaterial.message,
        }));
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
    getRawMaterialByCatId();
  }, [selectedCatId]);

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div>
      <div className="flex flex-col">
      <ToastContainer />
        <label>Category</label>
        <CategoryDropdown bgColor={"#F8F6F2"} options={allCategories} />
      </div>
      <div className="flex flex-col">
        <label>Semi-Finished Goods</label>
        <RawMateialDropDown
          name="raw_material_id"
          bgColor={"#F8F6F2"}
          options={allMaterialsByCatId}
        />
        {errors.raw_material_id && (
          <p className="text-xs mt-1 ml-1 flex items-start text-start text-red-500">
            {errors.raw_material_id}
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
          value={formData.quantity}
          onChange={handleChange}
        />
        {errors.quantity && (
          <p className=" text-xs mt-1 ml-1 flex items-start text-start text-red-500">
            {errors.quantity}
          </p>
        )}
      </div>
      <div className="flex flex-col">
  <label>Bulk Order Reference </label>
  <Input
    bgColor={"bg-[#F8F6F2]"}
    radius={"rounded-lg"}
    height={"h-[3.5vw] min-h-[3.5vh]"}
    padding={"p-[1vw]"}
    type={"text"}
    color={"text-[#838481]"}
    textSize={"text-[1vw]"}
    fontWeight={"font-medium"}
    name="bulkOrderReference"
    value={bulkOrderReference}
    onChange={handleChange}
  />
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
      <div className="mt-2" onClick={createNewB2BPO}>
        <Button
          title={"Raise Po"}
          bgColor={"bg-[rgb(79,201,218)]"}
          radius={"rounded-lg"}
          height={"h-[3vw] min-h-[3vh]"}
          padding={"p-[1vw]"}
          color={"text-[#ffff]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          width={"w-[7vw]"}
          disabled={formDisabled} // Disable if form is submitted or toaster shown
        />
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

export default RaiseBulkRawMaterialPOForm;
