import React from "react";
import { SecondaryButton } from "../ButtonComponent/ButtonComponent";

const ViewOutwardedProductsList = ({ po, handleCancel}) => {
  return (
    <>
      <div className="relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <h2 className="text-base font-semibold text-[#111928] mb-4">
          View Outward Product List
        </h2>
        <div className="space-y-4">
          {po?.products?.map((product, idx) => (
            <div
              key={idx}
              className="flex-grow min-w-0 py-2 px-4 rounded-lg bg-gray-1 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Product Name */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-dark font-medium text-sm">
                  {product.product_name}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex gap-x-2 mb-2">
                <span className="font-normal text-sm text-dark-4">
                  Quantity:
                </span>
                <span className="font-normal text-sm text-dark-4">
                  {product.quantity}
                </span>
              </div>

              {/* SKU Codes */}
              <div className="flex gap-x-2">
                <span className="font-normal text-sm text-dark-4">
                  SKU Codes:
                </span>
                <span className="font-normal text-sm text-dark-4">
                  {product.sku_codes.join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Cancel" width="w-full" onClick={handleCancel} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewOutwardedProductsList;
