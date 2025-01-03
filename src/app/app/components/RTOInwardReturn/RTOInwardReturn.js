import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";
import Input from "../Input/Input";
import RawMateialDropDown from "../RawMateialDropDown/RawMateialDropDown";
import Button from "../Button/Button";
import { vendorServices } from "@/app/services/vendorService";
import { categoryServices } from "@/app/services/categoryService";
import { rawMaterialServices } from "@/app/services/rawMaterialService";
import { poServices } from "../../services/poService";
import {
  getAllCategorySuccess,
  getAllCategoryRequest,
  getAllCategoryFailure,
} from "../../Actions/categoryActions";
import {
  getAllMaterialByCatIdRequest,
  getAllMaterialByCatIdSuccess,
  getAllMaterialByCatIdFailure,
} from "../../Actions/materialActions";
import validationSchema from "@/app/utils/validations/inwardRTOOrderValidation";
import { sfgCategories } from "@/app/constants/categoryConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MaterialCategoryFilter from "../MaterialCategoryFilter/MaterialCategoryFilter";
import {
  SecondaryButton,
  PrimaryButton,
} from "@/app/components/ButtonComponent/ButtonComponent";

const RTOInwardReturn = ({ onCancel }) => {
  const initialFormData = {
    warehouse_id: null,
    raw_material_id: null,
    quantity: null,
    weight: null,
    order_id: "",
    source_platform: "",
    awb_number: "",
    logistic_partner: "",
  };

  const { allCategories, selectedCatId } = useSelector(
    (state) => state.category
  );
  const { allMaterialsByCatId } = useSelector((state) => state.material);
  const { dropDownMatValue, dropDownMatName } = useSelector(
    (state) => state.dropdown
  );
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [finalFormData, setFinalFormData] = useState([]);
  const [formDisabled, setFormDisabled] = useState(false);
  const [receivedWrongItems, setReceivedWrongItems] = useState(false);
  const [incompleteOrder, setIncompleteOrder] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageError, setImageError] = useState(null);

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
    // Update formData when dropDownMatValue changes
    setFormData({
      raw_material_id: dropDownMatValue,
      raw_material_name: dropDownMatName,
      quantity: formData.quantity,
      weight: formData.weight,
      order_id: formData.order_id,
      source_platform: formData.source_platform,
      awb_number: formData.awb_number,
      logistic_partner: formData.logistic_partner,
    });
  }, [dropDownMatValue]);

  const handleChange = (event) => {
    const { name, value } = event.target;
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

  const addMultipleRawMaterials = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setFinalFormData((prevFinalFormData) => [...prevFinalFormData, formData]);
      setErrors({});
    } catch (err) {
      if (err.name === "ValidationError") {
        const ValidationError = {};
        err.inner.forEach((error) => {
          ValidationError[error.path] = error.message;
        });
        setErrors(ValidationError);
      }
    }
  };

  const createNewPO = async () => {
    // Ensure at least one image is uploaded if wrong items are received
    if (receivedWrongItems && uploadedImages.length === 0) {
      setImageError("Please upload at least one image.");
      return; // Stop execution if no image is uploaded.
    }

    try {
      // Validate form data, whether it is raw materials or other fields
      await validationSchema.validate(formData, { abortEarly: false });

      // Add raw materials to finalFormData if not wrong items
      // todo => check if this is needed
      if (!receivedWrongItems) {
        setFinalFormData((prevFinalFormData) => [
          ...prevFinalFormData,
          formData,
        ]);
      }

      // Prepare the payload based on whether wrong items are received or not
      const payload = {
        formData: { ...formData }, // Include the current form fields
        uploadedImages: receivedWrongItems ? uploadedImages : [], // Include images if wrong items are marked
        rawMaterials: !receivedWrongItems ? finalFormData : [], // Include raw materials if not wrong items
      };

      console.log("Submitting Payload:", payload);

      // Call the service with the built payload
      const response = await poServices.createPOFromRTOOrder(payload);

      if (response.success === true) {
        toast.success(`RTO Inwarded Successfully`, {
          autoClose: 1500,
          onClose: () => window.location.reload(),
          disableClick: true,
        });
        setFormDisabled(true);
      }
      return response;
    } catch (err) {
      console.error(err);

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

  const removeRawMaterial = (index) => {
    setFinalFormData((prevFinalFormData) => {
      const updatedFinalFormData = [...prevFinalFormData];
      updatedFinalFormData.splice(index, 1);
      return updatedFinalFormData;
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages(files);

    // Clear any previous image upload errors
    if (files.length > 0) {
      setImageError(null);
    }
  };

  return (
    <>
      <div className=" relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <ToastContainer position="bottom-center" />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Inward RTO Orders
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Update the purchase order to be made to vendor to procure new raw or
          packaging materials.
        </p>

        <div className="flex flex-row gap-5 mb-6">
          <div className="flex flex-col">
            <label className="block text-[#111928] text-sm font-medium mb-1">
              Order Id
              <span className="text-[#9CA3AF] ml-[2px]">*</span>
            </label>
            <Input
              placeholder="Enter Order ID"
              type={"text"}
              size={"medium"}
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              disabled={formDisabled}
            />
            {errors.order_id && (
              <p className="text-xs mt-1 ml-1 text-red-500">
                {errors.order_id}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="block text-[#111928] text-sm font-medium mb-1">
              Source Platform
              <span className="text-[#9CA3AF] ml-[2px]">*</span>
            </label>
            <Input
              type={"text"}
              placeholder="Enter Source Platform"
              size={"medium"}
              name="source_platform"
              value={formData.source_platform}
              onChange={handleChange}
              disabled={formDisabled}
            />
            {errors.source_platform && (
              <p className="text-xs mt-1 ml-1 text-red-500">
                {errors.source_platform}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-row gap-5 mb-6">
          <div className="flex flex-col">
            <label className="block text-[#111928] text-sm font-medium mb-1">
              AWB Number
              <span className="text-[#9CA3AF] ml-[2px]">*</span>
            </label>
            <Input
              placeholder="Enter AWB Number"
              type={"text"}
              size={"medium"}
              name="awb_number"
              value={formData.awb_number}
              onChange={handleChange}
              disabled={formDisabled}
            />
            {errors.awb_number && (
              <p className="text-xs mt-1 ml-1 text-red-500">
                {errors.awb_number}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="block text-[#111928] text-sm font-medium mb-1">
              Logistic Partner
              <span className="text-[#9CA3AF] ml-[2px]">*</span>
            </label>
            <Input
              type={"text"}
              placeholder="Enter Logistic Partner"
              size={"medium"}
              name="logistic_partner"
              value={formData.logistic_partner}
              onChange={handleChange}
              disabled={formDisabled}
            />
            {errors.logistic_partner && (
              <p className="text-xs mt-1 ml-1 text-red-500">
                {errors.logistic_partner}
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#111928] mb-1">
            Confgure PO items -{" "}
          </h2>
          <div className="mt-3 bg-gray-1 p-3 rounded-xl">
            {/* Checkbox to show/hide fields */}
            <div className="flex flex-row items-center gap-2 mb-6">
              <input
                type="checkbox"
                id="receivedWrongItems"
                checked={receivedWrongItems}
                className="w-4 h-4"
                onChange={(e) => setReceivedWrongItems(e.target.checked)}
              />
              <label className="text-sm" htmlFor="receivedWrongItems">
                Received Wrong Items
              </label>
            </div>

            {!receivedWrongItems ? (
              <>
                <div className="flex flex-col mb-6">
                  <label className="block text-[#111928] text-sm font-medium mb-1">
                    Category
                    <span className="text-[#9CA3AF] ml-[2px]">*</span>
                  </label>
                  <MaterialCategoryFilter
                    name="Category"
                    bgColor={"#F8F6F2"}
                    options={allCategories}
                  />
                </div>

                <div className="flex flex-col mb-6">
                  <label className="block text-[#111928] text-sm font-medium mb-1">
                    Product
                    <span className="text-[#9CA3AF] ml-[2px]">*</span>
                  </label>
                  <RawMateialDropDown
                    name="raw_material_id"
                    options={allMaterialsByCatId}
                    disabled={formDisabled}
                  />
                  {errors.raw_material_id && (
                    <p className="text-xs mt-1 ml-1 flex items-start text-start text-red-500">
                      {errors.raw_material_id}
                    </p>
                  )}
                </div>

                <div className="flex gap-x-4 mb-6">
                  {/* Quantity Field */}
                  <div className="flex flex-col w-[47.5%]">
                    <label className="block text-[#111928] text-sm font-medium mb-1">
                      Quantity
                      <span className="text-[#9CA3AF] ml-[2px]">*</span>
                    </label>
                    <Input
                      type={"number"}
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      disabled={formDisabled}
                      placeholder={"Enter Quantity"}
                    />
                    {errors.quantity && (
                      <p className="text-xs mt-1 ml-1 flex items-start text-start text-red-500">
                        {errors.quantity}
                      </p>
                    )}
                  </div>

                  {/* Weight Field */}
                  <div className="flex flex-col w-[47.5%]">
                    <label className="block text-[#111928] text-sm font-medium mb-1">
                      Weight (in kgs)
                      <span className="text-[#9CA3AF] ml-[2px]">*</span>
                    </label>
                    <Input
                      type={"number"}
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      disabled={formDisabled}
                      placeholder={"Enter Weight"}
                    />
                    {errors.weight && (
                      <p className="text-xs mt-1 ml-1 flex items-start text-start text-red-500">
                        {errors.weight}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col">
                <label className="block text-[#111928] text-sm font-medium mb-1">Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-gray-2 text-sm p-2 rounded-lg text-primary"
                />
                {imageError && (
                  <p className="text-xs mt-1 ml-1 text-red-500">{imageError}</p>
                )}
              </div>
            )}
          </div>
        </div>
        { !receivedWrongItems && 
          <div className="mt-2">
            <SecondaryButton
              title="+ Add items"
              size="full"
              onClick={addMultipleRawMaterials}
              disabled={formDisabled}
            />
          </div>
        }

        {/* Conditionally Render Fields or Image Upload */}

        <div className="flex flex-row gap-5">
          {/* Mark as Incomplete Order */}
          <div className="flex flex-row items-center gap-2 mt-5">
            <input
              type="checkbox"
              id="incompleteOrder"
              checked={incompleteOrder}
              onChange={(e) => setIncompleteOrder(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="incompleteOrder" className="block text-[#111928] text-sm ">Mark as Incomplete Order</label>
          </div>
        </div>

        <div className="mt-4 h-auto w-full mb-8">
          <ul>
            {finalFormData.length > 0 && (
              <h2 className="text-base font-semibold text-dark mb-2">
                Selected Items: {finalFormData.length}
              </h2>
            )}

            {finalFormData.map((data, idx) => (
              <li
                key={idx}
                className="shadow-sm rounded-lg py-3 bg-white flex items-center justify-between space-x-4 px-4"
              >
                <div className="flex-grow min-w-0 py-2 px-1 rounded-lg bg-gray-1">
                  <div className="flex justify-between items-center mb-2 ">
                    <span className="text-dark font-medium text-sm">
                      {data.raw_material_name}
                    </span>
                  </div>

                  {/* Quantity, Weight in One Row */}
                  <div className="flex  gap-6 overflow-hidden">
                    <div className="flex gap-x-2">
                      <span className="font-normal text-sm text-dark-4">
                        Quantity:
                      </span>
                      <span className="font-normal text-sm text-dark-4">
                        {data.quantity}
                      </span>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="font-normal text-sm text-dark-4">
                        Weight:
                      </span>
                      <span className="font-normal text-sm text-dark-4">
                        {data.weight}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="flex-shrink-0 ml-4"
                  onClick={() => removeRawMaterial(idx)}
                  disabled={formDisabled}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>

        {formDisabled && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50" />
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          {
            <div className="flex-1">
              <SecondaryButton title="Cancel" size="full" onClick={onCancel} />
            </div>
          }
          <div className="flex-1">
            <PrimaryButton
              title="Inward RTO Order"
              onClick={createNewPO}
              disabled={
                formDisabled ||
                !(receivedWrongItems || finalFormData.length > 0) ||
                (receivedWrongItems && uploadedImages.length === 0)
              }
              size="full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RTOInwardReturn;
