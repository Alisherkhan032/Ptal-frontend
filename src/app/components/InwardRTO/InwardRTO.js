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
import 'react-toastify/dist/ReactToastify.css';

const InwardRTO = () => {
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

  // const createNewPO = async () => {
   
  //   if (receivedWrongItems && uploadedImages.length === 0) {
  //     setImageError("Please upload at least one image.");
  //     return; // Stop further execution if no image is uploaded.
  //   }
  //   try {

  //     await validationSchema.validate(formData, { abortEarly: false });
  //     setFinalFormData((prevFinalFormData) => [...prevFinalFormData, formData]);
  //     setErrors({});

  //     console.log("finalFormData", finalFormData);
      
  //     const response = await poServices.createPOFromRTOOrder({
  //       formData: finalFormData,
  //     });
       
  //     if (response.success === true) {
  //       toast.success("RTO Inwarded Successfull", {
  //         autoClose: 1500,
  //         onClose: () => window.location.reload(),
  //         disableClick: true
  //       });
  //       setFormDisabled(true);
  //     }
  //     return response;
  //   } catch (err) {
  //     console.log(err);
  //     if (err.name === "ValidationError") {
  //       const ValidationError = {};
  //       err.inner.forEach((error) => {
  //         ValidationError[error.path] = error.message;
  //       });
  //       setErrors(ValidationError);
  //     }
  //   }
  // };

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
      if (!receivedWrongItems) {
        setFinalFormData((prevFinalFormData) => [...prevFinalFormData, formData]);
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
    <div className="h-[78vh] min-h-[78vh] max-h-[78vh] overflow-y-scroll">
      <ToastContainer />
      <div className="flex flex-col">
        <label>Order ID</label>
        <Input
          bgColor={"bg-[#F8F6F2]"}
          radius={"rounded-lg"}
          height={"h-[3.5vw] min-h-[3.5vh]"}
          padding={"p-[1vw]"}
          type={"text"}
          color={"text-[#838481]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          name="order_id"
          value={formData.order_id}
          onChange={handleChange}
          disabled={formDisabled}
        />
        {errors.order_id && (
          <p className="text-xs mt-1 ml-1 text-red-500">{errors.order_id}</p>
        )}
      </div>
  
      <div className="flex flex-col">
        <label>Source Platform</label>
        <Input
          bgColor={"bg-[#F8F6F2]"}
          radius={"rounded-lg"}
          height={"h-[3.5vw] min-h-[3.5vh]"}
          padding={"p-[1vw]"}
          type={"text"}
          color={"text-[#838481]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          name="source_platform"
          value={formData.source_platform}
          onChange={handleChange}
          disabled={formDisabled}
        />
        {errors.source_platform && (
          <p className="text-xs mt-1 ml-1 text-red-500">{errors.source_platform}</p>
        )}
      </div>
  
      <div className="flex flex-col">
        <label>AWB Number</label>
        <Input
          bgColor={"bg-[#F8F6F2]"}
          radius={"rounded-lg"}
          height={"h-[3.5vw] min-h-[3.5vh]"}
          padding={"p-[1vw]"}
          type={"text"}
          color={"text-[#838481]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
          name="awb_number"
          value={formData.awb_number}
          onChange={handleChange}
          disabled={formDisabled}
        />
        {errors.awb_number && (
          <p className="text-xs mt-1 ml-1 text-red-500">{errors.awb_number}</p>
        )}
      </div>
  
      <div className="flex flex-col">
        <label>Logistic Partner</label>
        <Input
          bgColor={"bg-[#F8F6F2]"}
          radius={"rounded-lg"}
          height={"h-[3.5vw] min-h-[3.5vh]"}
          padding={"p-[1vw]"}
          type={"text"}
          color={"text-[#838481]"}
          textSize={"text-[1vw]"}
          fontWeight={"font-medium"}
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
  
      {/* Checkbox to show/hide fields */}
      <div className="flex flex-row items-center gap-2">
        <input
          type="checkbox"
          id="receivedWrongItems"
          checked={receivedWrongItems}
          onChange={(e) => setReceivedWrongItems(e.target.checked)}
        />
        <label htmlFor="receivedWrongItems">Received Wrong Items</label>
      </div>
  
      {/* Conditionally Render Fields or Image Upload */}
      {!receivedWrongItems ? (
        <>
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
              disabled={formDisabled}
            />
            {errors.raw_material_id && (
              <p className="text-xs mt-1 ml-1 text-red-500">
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
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              disabled={formDisabled}
            />
            {errors.quantity && (
              <p className="text-xs mt-1 ml-1 text-red-500">{errors.quantity}</p>
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
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              disabled={formDisabled}
            />
            {errors.weight && (
              <p className="text-xs mt-1 ml-1 text-red-500">{errors.weight}</p>
            )}
          </div>
          <div className="mt-2" onClick={addMultipleRawMaterials}>
          <Button
            title={"Add Raw Material"}
            bgColor={"bg-[rgb(79,201,218)]"}
            radius={"rounded-lg"}
            height={"h-[3vw] min-h-[3vh]"}
            padding={"p-[1vw] px-[2vw] py-[2vw]"}
            color={"text-[#ffff]"}
            textSize={"text-[1vw]"}
            fontWeight={"font-medium"}
            width={"w-[10vw]"}
            disabled={formDisabled}
          />
        </div>
        </>
      ) : (
        <div className="flex flex-col">
        <label>Upload Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
        {imageError && <p className="text-xs mt-1 ml-1 text-red-500">{imageError}</p>}
      </div>
      )}

      <div className="flex flex-row gap-5">

        {/* Mark as Incomplete Order */}
        <div className="flex flex-row items-center gap-2 mt-5">
        <input
          type="checkbox"
          id="incompleteOrder"
          checked={incompleteOrder}
          onChange={(e) => setIncompleteOrder(e.target.checked)}
        />
        <label htmlFor="incompleteOrder">Mark as Incomplete Order</label>
      </div>
       
  
      {(receivedWrongItems || finalFormData.length > 0) && (
          <div className="mt-2" onClick={createNewPO}>
            <Button
              title={"Inward RTO Order"}
              bgColor={"bg-[rgb(79,201,218)]"}
              radius={"rounded-lg"}
              height={"h-[3vw] min-h-[3vh]"}
              padding={"p-[1vw] px-[2vw] py-[2vw]"}
              color={"text-[#ffff]"}
              textSize={"text-[1vw]"}
              fontWeight={"font-medium"}
              width={"w-[10vw]"}
              disabled={formDisabled || (receivedWrongItems && uploadedImages.length === 0)}
            />
          </div>
        )}
      </div>
  
      <div className="mt-2">
        <ul className="p-2 rounded">
          {finalFormData.map((data, idx) => (
            <li
              key={idx}
              className="flex gap-5 border shadow bg-[#ffffff] mb-2 p-2 rounded"
            >
              <div>Name: {data.raw_material_name}</div>
              <div>Quantity: {data.quantity}</div>
              <div>Weight: {data.weight}</div>
              <button
                className="bg-red-500 text-white rounded px-2"
                onClick={() => removeRawMaterial(idx)}
                disabled={formDisabled}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
  
    
  
      {formDisabled && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50" />
      )}
    </div>
  );

  
  
};

export default InwardRTO;
