import React from "react";
import { SecondaryButton } from "../ButtonComponent/ButtonComponent";

const AssemblyPoBatches = ({ po, handleCancel }) => {
  return (
    <>
      <div className=" relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <h2 className="text-base font-semibold text-[#111928] mb-6">
          Batch Information
        </h2>
        <div className="scrollbar-none text-center w-full">
          <div className="overflow-y-scroll scrollbar-none">
            <ul className="bg-gray-2 w-full rounded-lg p-4">
              {po?.batchData?.length > 0 ? (
                po.batchData.map((item) => (
                  <li
                    key={item.batchNumber}
                    className="flex justify-between text-sm font-semibold rounded-md mb-4 bg-[#ffffff] p-4 px-4"
                  >
                    <span>Batch no: {item.batchNumber}</span>
                    <span>Quantity: {item.quantity}</span>
                  </li>
                  
                ))
              ) : (
                <li className="font-semibold text-red-500 text-center">
                  Items not available !
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Close" height="h-12" onClick={handleCancel} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AssemblyPoBatches;
