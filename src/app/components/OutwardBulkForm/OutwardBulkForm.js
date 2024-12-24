import React, { useState } from "react";
import Button from "../Button/Button";
import BatchNumbeDropdown from "../BatchNumbeDropdown/BatchNumbeDropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../Input/Input";
import {
  PrimaryButton,
  SecondaryButton,
} from "../ButtonComponent/ButtonComponent";

const OutwardBulkForm = ({
  po,
  addItemsInListArray,
  formData,
  handleChange,
  batchesToShow,
  handleDelete,
  errors,
  listData,
  upatePoStatus,
  formDisabled,
  handleCancel,
}) => {
  return (
    <>
      <div className="relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <ToastContainer position="bottom-center" />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          OutwardBulkForm
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Add items to be outwarded
        </p>
        <div className="flex mb-6">
          <span className="block text-dark-6 text-sm font-medium mb-1">
            Total Quantity : &nbsp;
          </span>

          <span className="block text-[#111928] text-sm font-medium mb-1">
            {po?.quantity}
          </span>
        </div>

        <div className="flex flex-col mb-6">
          <label className="block text-[#111928] text-sm font-medium mb-1">
            Select Batch Number
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <BatchNumbeDropdown
            fontSize="text-sm"
            name="batchNumber"
            options={batchesToShow}
          />
        </div>

        <div className="flex flex-col mb-6">
          <label className="block text-[#111928] text-sm font-medium mb-1">
            Enter Quantity
            <span className="text-[#9CA3AF] ml-[2px]">*</span>
          </label>
          <Input
            radius={"rounded-xl"}
            height={"h-10"}
            padding={"px-4 py-4 "}
            type={"number"}
            color={"text-[#838481]"}
            textSize={"text-sm"}
            fontWeight={"font-normal"}
            name="quantity"
            placeholder="Enter quantity"
            value={formData.quantity || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mt-2">
          <SecondaryButton
            title="+ Add items"
            onClick={addItemsInListArray}
            height="h-10"
          />
        </div>
        {errors.totalQuantity && (
          <p className="w-[20vw] mt-2 text-[1vw] mb-4 ml-1 flex items-start text-center text-red-400">
            {errors.totalQuantity}
          </p>
        )}
        {errors.batchQuantity && (
          <p className="w-[30vw] mt-2 text-[1vw] mb-4 ml-1 flex items-start text-center text-red-400">
            {errors.batchQuantity}
          </p>
        )}

        <div className="mt-4 h-auto w-full mb-8">
          <ul>
            {listData.length > 0 && (
              <h2 className="text-base font-semibold text-dark mb-2">
                Selected Items: {listData.length}
              </h2>
            )}
            {listData.map((item, index) => (
              <li
                key={index}
                className="shadow-sm rounded-lg p-3 gap-x-2 bg-white flex justify-between relative"
              >
                <div className="flex-grow min-w-0 py-2 px-1 rounded-lg bg-gray-1">
                  <div className="flex justify-between items-center mb-2 whitespace-nowrap">
                    <span className="text-dark font-medium text-sm">
                      Batch no: {item.batchNumber}
                    </span>
                  </div>

                  {/* Quantity and other details in a row */}
                  <div className="flex justify-between gap-6">
                    <div className="flex gap-x-2">
                      <span className="font-normal text-sm text-dark-4">
                        Quantity:
                      </span>
                      <span className="font-normal text-sm text-dark-4">
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>

                <button onClick={() => handleDelete(index)}>🗑️</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Cancel" height="h-12" onClick={handleCancel} />
          </div>
          <div className="flex-1">
            <PrimaryButton
              title="Fulfil"
              onClick={() => upatePoStatus(po?._id, listData, po?.quantity)}
              disabled={listData.length === 0}
              height="h-12"
              bgColor="bg-primary"
            />
          </div>
        </div>
      </div>

      {/* <div className="relative w-[50vw] h-[30vw] flex items-center justify-center bg-[#F8F6F2] text-[#838481] rounded-lg shadow">
        <div className="relative w-[80vw] sm:w-[50vw] md:w-[70vw] lg:w-[80vw] xl:w-[80vw] h-[60vw] sm:h-[70vw] md:h-[50vw] lg:h-[40vw] xl:h-[35vw] flex items-center justify-center bg-[#F8F6F2] text-[#838481] rounded-lg shadow">
          <div className="p-6 md:p-6 text-center ">
            <div className="flex justify-end items-center mb-4 mt-0">
              <div className="mr-20">
                <span className="font-semibold text-xl sm:text-xl md:text-1.5xl lg:text-2xl">
                  Total Quantity : &nbsp;
                </span>

                <span className="font-semibold text-[rgb(79,201,218)] text-xl sm:text-xl md:text-1.5xl lg:text-2xl">
                  {po?.quantity}
                </span>
              </div>
              <div onClick={addItemsInListArray}>
                <Button
                  title={"+Add"}
                  bgColor={"bg-[gray]"}
                  radius={"rounded-lg"}
                  padding={"lg:py-3 px-7 md:py-2 md:px-5"}
                  color={"text-[#ffff]"}
                  textSize={"text-[1.2vw]"}
                  fontWeight={"font-medium"}
                  width={"w-[8vw]"}
                  disabled={formDisabled}
                />
              </div>
            </div>
            <div className="flex flex-col mt-5">
              <div className="flex flex-row gap-5">
                <div class="">
                  <BatchNumbeDropdown
                    name="batchNumber"
                    options={batchesToShow}
                  />
                </div>
                <div class="">
                  <Input
                    bgColor={"bg-[#ffffff]"}
                    radius={"rounded-lg"}
                    padding={"px-3 py-3 "}
                    type={"number"}
                    color={"text-[#838481] text-gray-800"}
                    textSize={"text-[1.5vw] sm:text-[2vw] md:text-[1.2vw]"}
                    fontWeight={"font-medium"}
                    name="quantity"
                    placeholder="Enter quantity"
                    value={formData.quantity || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {errors.totalQuantity && (
                <p className="w-[20vw] mt-2 text-[1vw] mb-4 ml-1 flex items-start text-center text-red-400">
                  {errors.totalQuantity}
                </p>
              )}
              {errors.batchQuantity && (
                <p className="w-[30vw] mt-2 text-[1vw] mb-4 ml-1 flex items-start text-center text-red-400">
                  {errors.batchQuantity}
                </p>
              )}
            </div>
            <div className="flex mt-5 gap-4 justify-end">
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="py-1 px-3 sm:py-2 sm:px-5 md:py-2 md:px-5 lg:py-3 lg:px-7 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 "
                onClick={() => closeModal()}
              >
                Close
              </button>
              <div
                onClick={() => upatePoStatus(po?._id, listData, po?.quantity)}
              >
                <Button
                  title={"Fulfill"}
                  bgColor={"bg-[rgb(79,201,218)]"}
                  radius={"rounded-lg"}
                  padding={
                    "py-1 px-3 sm:py-2 sm:px-5 md:py-2 md:px-5 lg:py-3 lg:px-7"
                  }
                  color={"text-white"}
                  textSize={"text-sm"}
                  fontWeight={"font-medium"}
                  disabled={formDisabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default OutwardBulkForm;
