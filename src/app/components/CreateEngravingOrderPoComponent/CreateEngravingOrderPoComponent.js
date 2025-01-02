"use client";
import React, { useEffect, useState } from "react";
import Input from "../Input/Input";
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

const CreateEngravingOrderPoComponent = () => {
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
        <ToastContainer />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Raise Engraving Order PO
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Create an Engraving purchase order 
        </p>
        
        <div className="flex flex-row items-center justify-start gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              mode === "product"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => setMode("product")}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              mode === "rawMaterial"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => setMode("rawMaterial")}
          >
            Raw Materials
          </button>
        </div>

        <div className="flex flex-col p-4 border-2 border-[#F8F6F2] rounded-lg bg-white">
          <div className="flex flex-col">
            <label>Order ID</label>
            <Input
              bgColor={"bg-[#F8F6F2]"}
              radius={"rounded-lg"}
              height={"h-[3.5vw] min-h-[3.5vh]"}
              padding={"p-[1vw]"}
              type={"text"}
              name="orderId"
              placeholder="Enter Order ID here"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label>Select Category</label>
            <CategoryDropdown bgColor={"#F8F6F2"} options={allCategories} />
          </div>
          <div className="flex flex-col">
            <label>
              Select {mode === "product" ? "Product" : "Raw Material"}
            </label>
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
          <div className="flex flex-col">
            <label>Quantity</label>
            <Input
              bgColor={"bg-[#F8F6F2]"}
              radius={"rounded-lg"}
              height={"h-[3.5vw] min-h-[3.5vh]"}
              padding={"p-[1vw]"}
              type={"number"}
              name="quantity"
              placeholder="Enter Quantity here"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Engraving Content</label>
            <Input
              bgColor={"bg-[#F8F6F2]"}
              radius={"rounded-lg"}
              height={"h-[3.5vw] min-h-[3.5vh]"}
              padding={"p-[1vw]"}
              type={"text"}
              name="engravingContent"
              placeholder="Enter Engraving Content here"
              value={engravingContent}
              onChange={(e) => setEngravingContent(e.target.value)}
            />
          </div>

          <div onClick={handleAddOrder} className="mt-2">
            <Button
              title="Add Order"
              bgColor={"bg-[rgb(79,201,218)]"}
              radius={"rounded-lg"}
              height={"h-[3vw] min-h-[3vh]"}
              padding={"p-[1vw]"}
              color={"text-[#ffff]"}
              textSize={"text-[1vw]"}
              fontWeight={"font-medium"}
              width={"w-[10vw]"}
            />
          </div>
          {errors.listOfOrders && (
            <p className="text-red-500 text-xs">{errors.listOfOrders}</p>
          )}
        </div>
        <div className="mt-4">
          <div className="flex flex-row justify-between">
            <label>Orders :-</label>
          </div>
          {orders.length > 0 && (
            <ul className="flex flex-col gap-2">
              {orders.map((order, index) => (
                <li
                  key={index}
                  className="order-item border bg-[#F8F6F2] text-black rounded-lg p-2 text-sm text-start"
                >
                  <div className="flex flex-col">
                    <button
                      className="remove-button text-[0.8rem] font-semibold bg-red-500 text-white px-1.5 py-0.5 rounded-md mb-1 hover:bg-red-600"
                      onClick={() => handleRemoveOrderFromList(index)}
                    >
                      Remove
                    </button>
                    <span className="number px-3 text-black">
                      <strong>Order ID:</strong> {order?.orderId}
                    </span>
                    <span className="number px-3 text-black">
                      <strong> Name:</strong> {order?.itemName}
                    </span>
                    <span className="number px-3 text-black">
                      <strong>Quantity:</strong> {order?.quantity}
                    </span>

                    <span className="number px-3 text-black">
                      <strong>Engraving Content:</strong>{" "}
                      {order?.engravingContent}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-row gap-5 mt-4">
          <div onClick={onFormSubmit}>
            <Button
              title={"Create Orders"}
              bgColor={"bg-[rgb(79,201,218)]"}
              radius={"rounded-lg"}
              height={"h-[3vw] min-h-[3vh]"}
              padding={"p-[1vw]"}
              color={"text-[#ffff]"}
              textSize={"text-[1vw]"}
              fontWeight={"font-medium"}
              width={"w-[10vw]"}
              disabled={formDisabled}
            />
          </div>
        </div>

        {formDisabled && (
          <div className="overlay fixed inset-0 bg-gray-500 opacity-50 z-50"></div>
        )}
      </div>
    </>
  );
};

export default CreateEngravingOrderPoComponent;
