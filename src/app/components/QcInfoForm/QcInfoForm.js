import React from "react";
import { ToastContainer } from "react-toastify";
import Input from "../Input/Input";
import {
  SecondaryButton,
  PrimaryButton,
} from "../ButtonComponent/ButtonComponent";
import "react-toastify/dist/ReactToastify.css";

const QcInfoForm = ({
  po,
  formData,
  errors,
  handleChange,
  handleCancel,
  handleSubmit,
}) => {
  return (
    <>
      <div className="relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <ToastContainer position="bottom-center" />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Fulfil PO
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Add the QC status detail of the items
        </p>

        <div className="block text-[#111928] text-sm font-medium mb-6">
          Total Quantity: <span className="ml-2">{po?.quantity}</span>
        </div>

        <div className="flex flex-col mb-6">
          <label className="block text-[#111928] text-sm font-medium mb-2">
            How many items got passed in QC?{" "}
            <span className="text-[#9CA3AF]">*</span>
          </label>
          <Input
            bgColor="bg-[#ffffff]"
            height="h-10"
            radius="rounded-lg"
            padding="px-4 py-4"
            type="number"
            color="text-[#838481]"
            textSize="text-[1vw]"
            fontWeight="font-medium"
            name="passedQcInfo"
            placeholder="Enter QC passed quantity"
            value={formData.passedQcInfo}
            onChange={handleChange}
          />
          {errors.passedQcInfo && (
            <p className="text-[0.9vw] mt-1 ml-1 flex items-start text-start text-red-500">
              {errors.passedQcInfo}
            </p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <label className="block text-[#111928] text-sm font-medium mb-2">
            How many items got Failed in QC?{" "}
            <span className="text-[#9CA3AF]">*</span>
          </label>
          <Input
            bgColor="bg-[#ffffff]"
            height="h-10"
            radius="rounded-lg"
            padding="px-4 py-4"
            type="number"
            color="text-[#838481]"
            textSize="text-[1vw]"
            fontWeight="font-medium"
            name="failedQcInfo"
            placeholder="Enter QC failed quantity"
            value={formData.failedQcInfo}
            onChange={handleChange}
          />
          {errors.failedQcInfo && (
            <p className="text-[0.9vw] mt-1 ml-1 flex items-start text-start text-red-500">
              {errors.failedQcInfo}
            </p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <label className="block text-[#111928] text-sm font-medium mb-2">
            Comment <span className="text-[#9CA3AF]">*</span>
          </label>
          <Input
            bgColor="bg-[#ffffff]"
            height="h-10"
            radius="rounded-lg"
            padding="px-4 py-4"
            type="text"
            color="text-[#838481]"
            textSize="text-[1vw]"
            fontWeight="font-medium"
            name="comment"
            placeholder="Enter comments"
            value={formData.comment}
            onChange={handleChange}
          />
          {errors.comment && (
            <p className="text-[0.9vw] mt-1 ml-1 flex items-start text-start text-red-500">
              {errors.comment}
            </p>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full border border-t-stroke bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton
              title="Cancel"
              onClick={handleCancel}
              size='full'
            />
          </div>
          <div className="flex-1">
            <PrimaryButton
              title="Fulfil"
              onClick={handleSubmit}
              size='full'
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QcInfoForm;
