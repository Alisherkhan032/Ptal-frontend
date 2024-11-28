import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import VendorDropDown from "../VendorDropDown/VendorDropDown";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";
import Input from "../Input/Input";
import RawMateialDropDown from "../RawMateialDropDown/RawMateialDropDown";
import Button from "../Button/Button";
import { vendorServices } from "@/app/services/vendorService";
import { categoryServices } from "@/app/services/categoryService";
import { rawMaterialServices } from "@/app/services/rawMaterialService";
import { poServices } from "../../services/poService";
import {
  getAllVendorRequest,
  getAllVendorFailure,
  getAllVendorSuccess,
} from "../../Actions/vendorActions";
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
import validationSchema from "@/app/utils/validations/raisePoFormValidation";
import { sfgCategories } from "@/app/constants/categoryConstants";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RaisePoForm = () => {
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
  const { dropDownMatValue, dropDownVendorValue, dropDownMatName } = useSelector(
    (state) => state.dropdown
  );
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
      console.log('response =========',response);
      if (response.success === true) {
        toast.success(`PO Created Successfully!`, {
          autoClose: 1500,
          onClose: () => router.push("/procurement/raise_vendor_po"),
          disableClick: true
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
    <div className="h-[78vh]  min-h-[78vh] max-h-[78vh] overflow-y-scroll">
      <ToastContainer />
      <div className="flex flex-col">
        <label>Vendor</label>
        <VendorDropDown
          name="vendor_id"
          bgColor={"#F8F6F2"}
          options={allVendors}
          disabled={finalFormData.length > 0 || formDisabled} // Disable if form is submitted or toaster shown
        />
        {errors.vendor_id && (
          <p className="text-xs mt-1 ml-1 flex items-start text-start text-red-500">
            {errors.vendor_id}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <label>Category</label>
        <CategoryDropdown bgColor={"#F8F6F2"} options={allCategories} />
      </div>
      <div className="flex flex-col">
        <label>Product</label>
        <RawMateialDropDown
          name="raw_material_id"
          bgColor={"#F8F6F2"}
          options={allMaterialsByCatId}
          disabled={formDisabled} // Disable if form is submitted or toaster shown
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
          disabled={formDisabled} // Disable if form is submitted or toaster shown
        />
        {errors.quantity && (
          <p className           =" text-xs mt-1 ml-1 flex items-start text-start text-red-500">
          {errors.quantity}
        </p>
      )}
    </div>
    <div className="flex flex-col">
      <label>Weight (in kgs)</label>
      <Input
        bgColor={"bg-[#F8F6F2]"}
        radius={"rounded-lg"}
        height={"h-[3.5vw] min-h-[3.5vh]"}
        padding={"p-[1vw]"}
        type={"number"}
        color={"text-[#838481]"}
        textSize={"text-[1vw]"}
        fontWeight={"font-medium"}
        name="weight"
        value={formData.weight}
        onChange={handleChange}
        disabled={formDisabled} // Disable if form is submitted or toaster shown
      />
      {errors.weight && (
        <p className=" text-xs mt-1 ml-1 flex items-start text-start text-red-500">
          {errors.weight}
        </p>
      )}
      <div className="flex flex-col">
          <label>Bill Number</label>
          <Input
            bgColor={"bg-[#F8F6F2]"}
            radius={"rounded-lg"}
            height={"h-[3.5vw] min-h-[3.5vh]"}
            padding={"p-[1vw]"}
            type={"text"} // Assuming Bill Number is a text field
            color={"text-[#838481]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            name="bill_number"
            value={formData.bill_number}
            onChange={handleChange}
            disabled={formDisabled} // Disable if form is submitted or toaster shown
          />
          {errors.bill_number && (
            <p className="text-xs mt-1 ml-1 flex items-start text-start text-red-500">
              {errors.bill_number}
            </p>
          )}
        </div>

    </div>
    <div className="flex flex-row gap-5">
      <div className="mt-2" onClick={addMultipleRawMaterials}>
        <Button
          title={"Add Rawmaterial"}
          bgColor={"bg-[rgb(79,201,218)]"}
          radius={"rounded-lg"}
          height={"h-[3vw] min-h-[3vh]"}
          padding={"p-[1vw] px-[2vw] py-[2vw]"}
          color={"text-[#ffff]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          width={"w-[10vw]"}
          disabled={formDisabled} // Disable if form is submitted or toaster shown
        />
      </div>
      {finalFormData.length !== 0 && (
        <div className="mt-2" onClick={createNewPO}>
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
            disabled={formDisabled} // Disable if form is submitted or toaster shown
          />
        </div>
      )}
    </div>
    <div className="mt-2 h-auto ">
      <ul className=" p-2 rounded">
        {finalFormData.map((data, idx) => (
          <li
            className="flex gap-5 border shadow bg-[#ffffff] mb-2 p-2 rounded flex-row"
            key={idx}
          >
            <div className="gap-2">
              <span>Name : </span>
              <span>{data.raw_material_name}</span>
            </div>
            <div className="gap-2">
              <span>Quantity : </span>
              <span>{data.quantity}</span>
            </div>
            <div className="gap-2">
              <span>Weight : </span>
              <span>{data.weight}</span>
            </div>
            <div className="gap-2">
              <span>Bill Number: </span>
              <span>{data.bill_number}</span>
            </div>
            <button
              className="bg-red-500 text-white rounded px-2"
              onClick={() => removeRawMaterial(idx)}
              disabled={formDisabled} // Disable if form is submitted or toaster shown
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

export default RaisePoForm;

