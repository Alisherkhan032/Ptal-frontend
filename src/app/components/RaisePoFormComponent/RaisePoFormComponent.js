import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import VendorDropDown from "../VendorDropDown/VendorDropDown";
import CategoryDropdown from "@/app/components/CategoryDropdown/CategoryDropdown";
import Input from "../Input/Input";
import RawMateialDropDown from "../RawMateialDropDown/RawMateialDropDown";
import Button from "../Button/Button";
import { vendorServices } from "@/app/services/vendorService";
import { categoryServices } from "@/app/services/categoryService";
import { rawMaterialServices } from "@/app/services/rawMaterialService";
import { poServices } from "../../services/poService";
import {
  getAllVendorRequest,
  getAllVendorSuccess,
} from "../../Actions/vendorActions";
import {
  getAllCategorySuccess,
  getAllCategoryRequest,
} from "../../Actions/categoryActions";
import {
  getAllMaterialByCatIdRequest,
  getAllMaterialByCatIdSuccess,
} from "../../Actions/materialActions";
import validationSchema from "@/app/utils/validations/raisePoFormValidation";
import { sfgCategories } from "@/app/constants/categoryConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MaterialCategoryFilter from "../MaterialCategoryFilter/MaterialCategoryFilter";
import {
  SecondaryButton,
  PrimaryButton,
} from "../ButtonComponent/ButtonComponent";

const RaisePoFormComponent = ({ onCancel }) => {
  const initialFormData = {
    warehouse_id: null,
    vendor_id: null,
    raw_material_id: null,
    quantity: null,
    weight: null,
    bill_number: null,
  };

  const { allVendors } = useSelector((state) => state.vendor);
  const { allCategories, selectedCatId } = useSelector(
    (state) => state.category
  );
  const { allMaterialsByCatId } = useSelector((state) => state.material);
  const { dropDownMatValue, dropDownVendorValue, dropDownMatName } =
    useSelector((state) => state.dropdown);
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [finalFormData, setFinalFormData] = useState([]);
  const [vendorId, setVendorId] = useState("");
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
    // Update formData when dropDownMatValue or dropDownVendorValue changes
    setFormData({
      raw_material_id: dropDownMatValue,
      raw_material_name: dropDownMatName,
      vendor_id: dropDownVendorValue,
      quantity: formData.quantity,
      weight: formData.weight,
    });
    setVendorId(dropDownVendorValue);
  }, [dropDownMatValue, dropDownVendorValue]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value === "" ? null : value,
    });
    if (name === "vendor_id" || name === "raw_material_id") {
      validateField(name, value, validationSchema);
    }
  };

  const getAllVendorData = async () => {
    try {
      dispatch(getAllVendorRequest());
      const response = await vendorServices.getAllVendors();
      if (response.success === true) {
        dispatch(getAllVendorSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
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

  const addMultipleRawMaterials = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      setFinalFormData((prevFinalFormData) => {
        const updatedFinalFormData = [...prevFinalFormData, formData];
        return updatedFinalFormData;
      });

      setErrors({}); // Clear any existing errors
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
    try {
      const response = await poServices.createPO({
        formData: finalFormData,
        vendor_id: vendorId,
      });
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
      return response;
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
    getAllVendorData();
    getAllCategories();
  }, []);

  const removeRawMaterial = (index) => {
    setFinalFormData((prevFinalFormData) => {
      const updatedFinalFormData = [...prevFinalFormData];
      updatedFinalFormData.splice(index, 1);
      return updatedFinalFormData;
    });
  };

  return (
    <>
      <div className=" relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <ToastContainer position="bottom-center" />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Raise Vendor PO
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Update the purchase order to be made to the vendor to procure new raw
          or packaging materials.
        </p>

        <div className="flex flex-col mb-6">
          <label className="block text-[#111928] text-sm font-medium mb-1">
            Vendor Name
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <VendorDropDown
            name="vendor_id"
            options={allVendors}
            disabled={finalFormData.length > 0 || formDisabled}
          />
          {errors.vendor_id && (
            <p className="text-xs mt-1 ml-1 flex items-start text-start text-red-500">
              {errors.vendor_id}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#111928] mb-1">
            Confgure PO items -{" "}
          </h2>
          <div className="mt-3 bg-gray-1 p-3 rounded-lg">
            <div className="flex flex-col mb-6 ">
              <MaterialCategoryFilter
                bgColor={"#F8F6F2"}
                name="Category"
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
                  radius={"rounded-xl"}
                  height={"h-10"}
                  padding={"px-4 py-4"}
                  type={"number"}
                  color={"text-[#838481]"}
                  textSize={"text-sm"}
                  fontWeight={"font-normal"}
                  borderColor={"border-[#DFE4EA]"}
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
                  radius={"rounded-xl"}
                  height={"h-10"}
                  padding={"px-4 py-4"}
                  borderColor={"border-[#DFE4EA]"}
                  type={"number"}
                  color={"text-[#838481]"}
                  textSize={"text-sm"}
                  fontWeight={"font-normal"}
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

            <div className="flex flex-col">
              <label className="block text-[#111928] text-sm font-medium mb-1">
                Bill Number
                <span className="text-[#9CA3AF] ml-[2px]">*</span>
              </label>
              <Input
                radius={"rounded-xl"}
                height={"h-10"}
                padding={"p-[1vw]"}
                type={"text"}
                color={"text-[#838481]"}
                textSize={"text-sm"}
                fontWeight={"font-normal"}
                name="bill_number"
                value={formData.bill_number}
                onChange={handleChange}
                disabled={formDisabled}
                placeholder={"Enter Bill Number"}
              />
              {errors.bill_number && (
                <p className="text-xs mt-1 ml-1 flex items-start text-start text-red-500">
                  {errors.bill_number}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2">
          <SecondaryButton
            title="+ Add items"
            onClick={addMultipleRawMaterials}
          />
        </div>
        <div className="mt-4 h-auto w-full mb-8">
          <ul>
            {finalFormData.length > 0 && (
              <h2 className="text-base font-semibold text-dark mb-2">
                Selected PO Items: {finalFormData.length}
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
                    <div className="flex gap-x-2">
                      <span className="font-normal text-sm text-dark-4">
                        Weight:
                      </span>
                      <span className="font-normal text-sm text-dark-4">
                        {data.weight}
                      </span>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="font-normal text-sm text-dark-4">
                        Bill Number:
                      </span>
                      <span className="font-normal text-sm text-dark-4">
                        {data.bill_number}
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

        {/* Overlay when form is disabled */}
        {formDisabled && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
            style={{ zIndex: 1000 }}
          />
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Cancel" width='w-full' onClick={onCancel} />
          </div>
          <div className="flex-1">
            <PrimaryButton
              title="Raise PO"
              onClick={createNewPO}
              disabled={finalFormData.length === 0}
              width="w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RaisePoFormComponent;
