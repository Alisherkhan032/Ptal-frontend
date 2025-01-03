"use client";
import React, { useEffect, useState } from "react";
import Input from "../Input/Input";
import Label from "../Label/Label";
import Button from "../Button/Button";
import { productServices } from "@/app/services/productService";
import { rawMaterialServices } from "@/app/services/rawMaterialService";
import {
  getAllProductByCatIdRequest,
  getAllProductByCatIdSuccess,
  getAllProductByCatIdFailure,
} from "../../Actions/productActions";
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
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";
import ProductDropdown from "../ProductDropdown/ProductDropdown";
import RawMateialDropDown from "../RawMateialDropDown/RawMateialDropDown";
import { useDispatch, useSelector } from "react-redux";
import { categoryServices } from "@/app/services/categoryService";
import { engravingOrderServices } from "@/app/services/engravingOrderService";
import { sfgCategories } from "@/app/constants/categoryConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ICONS } from "@/app/utils/icons";
import {
  PrimaryButton,
  SecondaryButton,
} from "../ButtonComponent/ButtonComponent";

const ToggleButton = ({ mode, setMode }) => {
  const options = [
    {
      id: "rawMaterial",
      name: "Raw Material",
      iconKey: "rawMaterial",
    },
    {
      id: "product",
      name: "Products",
      iconKey: "packaging",
    },
  ];

  return (
    <div className="flex items-center">
      {options.map((option, index) => (
        <button
          key={option.id}
          className={`h-10 ${
            mode === option.id
              ? "bg-gray-100 text-primary border border-primary"
              : "bg-white text-[#111928] border border-stroke"
          } flex-1 font-medium px-6 py-2 text-sm cursor-pointer
          ${index === 0 ? "rounded-l-lg" : ""}
          ${index === options.length - 1 ? "rounded-r-lg" : ""}
          ${index !== 0 && index !== options.length - 1 ? "border-l-0" : ""}`}
          onClick={() => setMode(option.id)}
        >
          <div className="flex items-center justify-center space-x-2">
            <span
              className={mode === option.id ? "text-primary" : "text-[#111928]"}
            >
              {React.cloneElement(ICONS[option.iconKey], {
                width: 20,
                height: 20,
              })}
            </span>
            <span className="text-sm">{option.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

const CreateEngravingOrderPoComponent = ({ onCancel }) => {
  const { allCategories, selectedCatId } = useSelector(
    (state) => state.category
  );
  const { allProductsByCatId } = useSelector((state) => state.product);
  const { allMaterialsByCatId } = useSelector((state) => state.material);
  const {
    dropDownProductValue,
    dropdownProductName,
    dropDownMatValue,
    dropDownMatName,
  } = useSelector((state) => state.dropdown);

  const [formDisabled, setFormDisabled] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [engravingContent, setEngravingContent] = useState("");
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState("product"); // "product" or "rawMaterial"

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        dispatch(getAllCategoryRequest());
        const response = await categoryServices.getAllCategories();
        const filteredCategories =
          mode === "product"
            ? response.data.filter(
                (category) => !sfgCategories.includes(category.category_name)
              )
            : response.data.filter((category) =>
                sfgCategories.includes(category.category_name)
              );
        dispatch(getAllCategorySuccess(filteredCategories));
      } catch (err) {
        dispatch(getAllCategoryFailure());
        console.log(err);
      }
    };
    fetchCategories();
  }, [mode]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedCatId) return;
      try {
        if (mode === "product") {
          dispatch(getAllProductByCatIdRequest());
          const response = await productServices.getAllProductsByCatId(
            selectedCatId
          );
          dispatch(getAllProductByCatIdSuccess(response.data));
        } else {
          dispatch(getAllMaterialByCatIdRequest());
          const response = await rawMaterialServices.getAllRawMaterialsByCatId(
            selectedCatId
          );
          dispatch(getAllMaterialByCatIdSuccess(response.data));
        }
      } catch (err) {
        dispatch(
          mode === "product"
            ? getAllProductByCatIdFailure()
            : getAllMaterialByCatIdFailure()
        );
        console.log(err);
      }
    };
    fetchItems();
  }, [selectedCatId, mode]);

  const handleRemoveOrderFromList = (index) => {
    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
  };

  const handleAddOrder = () => {
    if (
      orderId &&
      quantity &&
      (mode === "product" ? dropDownProductValue : dropDownMatValue) &&
      engravingContent
    ) {
      const newOrder = {
        orderId: orderId,
        itemId: mode === "product" ? dropDownProductValue : dropDownMatValue,
        itemName: mode === "product" ? dropdownProductName : dropDownMatName,
        quantity: quantity,
        engravingContent: engravingContent,
        mode: mode,
      };
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      setOrderId("");
      setQuantity("");
      setEngravingContent("");
      setErrors({});
    } else {
      setErrors({ listOfOrders: "Please fill all required fields." });
    }
  };

  const onFormSubmit = async () => {
    if (!orders.length) {
      setErrors({ listOfOrders: "At least one order must be added." });
      return;
    }

    console.log(orders);

    try {
      const response = await engravingOrderServices.createEngravingOrder(
        orders
      );
      if (response?.success) {
        toast.success("Orders created successfully", {
          autoClose: 1500,
          onClose: () => window.location.reload(),
        });
        setFormDisabled(true);
        setOrders([]);
      } else {
        toast.error(`Failed to create orders: ${response?.message}`);
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <>
      <div className=" relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <ToastContainer position="bottom-center" />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Raise Engraving Order PO
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Create an Engraving purchase order
        </p>

        <div className="mt-3 bg-gray-1 p-3 rounded-lg">
          <div className="flex flex-col mb-6 ">
            <Label text="Category" />
            <ToggleButton mode={mode} setMode={setMode} ICONS={ICONS} />
          </div>

          <div className="flex flex-col mb-6 ">
            <Label text="Order ID" isRequired="true" />
            <Input
              type={"text"}
              name="orderId"
              placeholder="Enter Order ID here"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>

          <div className="flex flex-col mb-6 ">
            <Label text="Select Category" isRequired="true" />
            <CategoryDropdown bgColor={"#F8F6F2"} options={allCategories} />
          </div>

          <div className="flex flex-col mb-6 ">
            <Label
              text={`Select ${mode === "product" ? "Product" : "Raw Material"}`}
              isRequired="true"
            />
            {mode === "product" ? (
              <ProductDropdown
                name="product_id"
                bgColor={"#F8F6F2"}
                options={allProductsByCatId}
              />
            ) : (
              <RawMateialDropDown
                name="material_id"
                bgColor={"#F8F6F2"}
                options={allMaterialsByCatId}
              />
            )}
          </div>

          <div className="flex flex-col mb-6 ">
            <Label text="Quantity" isRequired="true" />
            <Input
              type={"number"}
              name="quantity"
              placeholder="Enter Quantity here"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="flex flex-col mb-6 ">
            <Label text="Engraving Content" isRequired="true" />
            <Input
              type={"text"}
              name="engravingContent"
              placeholder="Enter Engraving Content here"
              value={engravingContent}
              onChange={(e) => setEngravingContent(e.target.value)}
            />
          </div>
          {errors.listOfOrders && (
            <p className="text-red-500 text-xs">{errors.listOfOrders}</p>
          )}
        </div>

        <div className="my-2">
          <SecondaryButton
            title="+ Add Order"
            size="full"
            onClick={handleAddOrder}
          />
        </div>

        <div className="mt-4 h-auto w-full mb-8">
          <ul>
            {orders.length > 0 && (
              <h2 className="text-base font-semibold text-dark mb-2">
                Orders: {orders.length}
              </h2>
            )}

            {orders.map((data, idx) => (
              <li
                key={idx}
                className="shadow-sm rounded-lg py-3 bg-white flex items-center justify-between space-x-4 px-4"
              >
                <div className="flex-grow min-w-0 py-2 px-1 rounded-lg bg-gray-1">
                  <div className="flex justify-between items-center mb-2 ">
                    <span className="text-dark font-medium text-sm">
                      {data.orderId}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between  overflow-hidden">
                    <div className="flex gap-x-2">
                      <span className="font-normal text-sm text-dark-4">
                        Name:
                      </span>
                      <span className="font-normal text-sm text-dark-4">
                        {data?.itemName}
                      </span>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="font-normal text-sm text-dark-4">
                        Quantity:
                      </span>
                      <span className="font-normal text-sm text-dark-4">
                        {data?.quantity}
                      </span>
                    </div>
                    <div className="flex gap-x-2">
                      <span className="font-normal text-sm text-dark-4">
                        Engraving Content:
                      </span>
                      <span className="font-normal text-sm text-dark-4">
                        {data?.engravingContent}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="flex-shrink-0 ml-4"
                  onClick={() => handleRemoveOrderFromList(idx)}
                  disabled={formDisabled}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>

        {formDisabled && (
          <div className="overlay fixed inset-0 bg-gray-500 opacity-50 z-50"></div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Cancel" size="full" onClick={onCancel} />
          </div>
          <div className="flex-1">
            <PrimaryButton
              title="Create Orders"
              onClick={onFormSubmit}
              size="full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEngravingOrderPoComponent;
