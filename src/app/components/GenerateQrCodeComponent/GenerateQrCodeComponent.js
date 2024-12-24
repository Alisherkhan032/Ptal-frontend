import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import { useRouter } from "next/navigation";
import VendorDropDown from "../VendorDropDown/VendorDropDown";
import CategoryDropdown from "@/app/components/CategoryDropdown/CategoryDropdown";
import ProductDropdown from "../ProductDropdown/ProductDropdown";
import Input from "../Input/Input";
import RawMateialDropDown from "../RawMateialDropDown/RawMateialDropDown";
import { productServices } from "@/app/services/productService";
import { assemblyPOServices } from "@/app/services/assemblyPO";
import { categoryServices } from "@/app/services/categoryService";
import {
  getAllCategorySuccess,
  getAllCategoryRequest,
} from "../../Actions/categoryActions";
import {
  getAllProductByCatIdRequest,
  getAllProductByCatIdSuccess,
  getAllProductByCatIdFailure,
} from "../../Actions/productActions";
import validationSchema from "@/app/utils/validations/inventoryPoVaiationSchema";
import { sfgCategories } from "@/app/constants/categoryConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SecondaryButton,
  PrimaryButton,
} from "../ButtonComponent/ButtonComponent";
import { QrCodeServices } from "@/app/services/qrGenerate";

const GenerateQrCodeComponent = ({ onCancel }) => {
  const initialFormData = {
    product_id: null,
    qrQuantity: null,
  };

  const { allCategories, selectedCatId } = useSelector(
    (state) => state.category
  );

  const { allProductsByCatId } = useSelector((state) => state.product);
  // console.log('allProductsByCatId===', allProductsByCatId);
  const { dropDownProductValue } = useSelector((state) => state.dropdown);

  const [formData, setFormData] = useState(initialFormData);
  const [listInputes, setListInputs] = useState({
    quantity: null,
    batchNumber: null,
  });
  console.log("listInputes===", listInputes);
  const [listData, setListData] = useState([]);
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
    // Update formData when dropDownMatValue or dropDownVendorValue changes
    setFormData({
      product_id: dropDownProductValue,
      qrQuantity: formData.qrQuantity,
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
    <>
      <div className="relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <ToastContainer position="bottom-center" />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Generate QR Code
        </h2>
        {/* <p className="text-sm font-normal text-[#4B5563] mb-6">
          Update the purchase order to be made to the vendor to procure new raw
          or packaging materials.
        </p> */}

        <div className="flex flex-col my-6">
          <label className="text-[#111928] text-sm font-medium mb-1">
            Category Name
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <CategoryDropdown options={allCategories} />
        </div>

        <div className="flex flex-col mb-6">
          <label className="block text-[#111928] text-sm font-medium mb-1">
            Finished Goods
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <ProductDropdown name="product_id" options={allProductsByCatId} />
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
            name="qrQuantity"
            value={formData.qrQuantity}
            onChange={handleChange}
            placeholder={"Enter Quantity"}
          />
          {errors.qrQuantity && (
            <p className=" text-xs mt-1 ml-1 flex items-start text-start text-red-500">
              {errors.qrQuantity}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#111928] mb-1">
            Confgure PO items -{" "}
          </h2>
          <div className="mt-3 flex gap-x-4 bg-gray-1 p-3 rounded-lg">
            <div className="flex flex-col w-[47.5%]">
              <label className="block text-[#111928] text-sm font-medium mb-1">
                Enter Batch Number
                <span className="text-[#9CA3AF] ml-[2px]">*</span>
              </label>
              <Input
                type={"number"}
                placeholder={"Enter batch number"}
                name="batchNumber"
                value={listInputes.batchNumber}
                onChange={handleChangeListData}
              />
            </div>
            <div className="flex flex-col w-[47.5%]">
              <label className="block text-[#111928] text-sm font-medium mb-1">
                Quantity
                <span className="text-[#9CA3AF] ml-[2px]">*</span>
              </label>
              <Input
                type={"number"}
                name="quantity"
                placeholder={"Enter quantity"}
                value={listInputes.quantity}
                onChange={handleChangeListData}
              />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <SecondaryButton title="+ Add items" onClick={addItemsInListArray} />
        </div>
        <div className="mt-4 h-auto w-full mb-8">
          <ul className="flex p-2 flex-col gap-2">
            {listData.length > 0 && (
              <h2 className="text-base font-semibold text-dark mb-2">
                Selected Items: {listData.length}
              </h2>
            )}
            {listData.map((item, idx) => (
              <li
                key={idx}
                className="shadow-sm rounded-lg py-3 bg-white flex items-center justify-between"
              >
                <div className="flex justify-between w-full py-2 px-4 rounded-lg bg-gray-1">
                  <div className="flex justify-between gap-6 overflow-hidden">
                    <div className="flex gap-x-2">
                      <span className="text-sm text-dark-4 font-medium">
                        Batch no :
                      </span>
                      <span className="font-normal text-sm text-dark-4">
                        {item.batchNumber}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between gap-6 overflow-hidden">
                    <div className="flex gap-x-2">
                      <span className="font-normal text-sm text-dark-4">
                        Quantity :
                      </span>
                      <span className="font-normal text-sm text-dark-4">
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
                {/* <span>Batch no : {item.batchNumber}</span>
                <span>Quantity : {item.quantity}</span> */}
              </li>
            ))}
          </ul>
        </div>

        {/* {errors.stockError && (
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
        )} */}
      </div>
      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Cancel" width='w-full' onClick={onCancel} />
          </div>
          <div className="flex-1">
            <PrimaryButton
              title="Generate QR"
              onClick={() => generateQrCode()}
              disabled={listData.length === 0}
              width="w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateQrCodeComponent;
