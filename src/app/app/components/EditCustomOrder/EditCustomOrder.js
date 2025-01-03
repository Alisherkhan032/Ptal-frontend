import React, { useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
  PendingRed,
} from "../ButtonComponent/ButtonComponent";
import { orderServices } from "@/app/services/oderService";
import Input from "../Input/Input";
import Label from "../Label/Label";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCustomOrder = ({ po, onCancel }) => {
  const [editOrderData, setEditOrderData] = useState({
    orderInternalId: po._id,
    orderId: po.orderId,
    orderTitle: po.orderTitle,
    trackingNumber: po.trackingNumber,
    remarks: po.remarks,
    status: po.status,
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    const result = await orderServices.editOrderByOrderInternalId(
      editOrderData
    );
    if (result.success) {
      toast.success(`Order Updated successfully`, {
        autoClose: 1500,
        onClose: () => {
          onCancel(); // Close the sidebar
          window.location.reload(); // Refresh the page after the toast is shown
        },
        disableClick: true,
      });
    } else {
      alert("Failed to update order: " + result.error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this order? This action is irreversible."
      )
    ) {
      try {
        const result = await orderServices.deleteOrderByOrderId(orderId);
        if (result.success) {
          toast.success(`Order Deleted successfully`, {
            autoClose: 1500,
            onClose: () => {
              onCancel(); // Close the sidebar
              window.location.reload(); // Refresh the page after the toast is shown
            },
            disableClick: true,
          });
        } else {
          alert("Failed to delete order: " + result.error);
        }
      } catch (error) {
        alert("An error occurred: " + error.message);
      }
    }
  };

  return (
    <>
      <div className=" relative overflow-y-scroll scrollbar-none pb-20 text-black">
        <ToastContainer position="bottom-center" />
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Edit Order
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6">
          Edit the order details below.
        </p>

        <div className="mb-4">
          <Label text="Order ID" isRequired={true} />
          <Input
            type="text"
            name="orderId"
            value={editOrderData.orderId}
            onChange={handleEditChange}
          />
        </div>

        <div className="mb-4">
          <Label text="Order Title" isRequired={true} />
          <Input
            type="text"
            name="orderTitle"
            value={editOrderData.orderTitle}
            onChange={handleEditChange}
          />
        </div>

        <div className="mb-4">
          <Label text="Tracking Number" isRequired={true} />
          <Input
            type="text"
            name="trackingNumber"
            value={editOrderData.trackingNumber}
            onChange={handleEditChange}
          />
        </div>

        <div className="mb-4">
          <Label text="Remarks" isRequired={true} />
          <Input
            type="text"
            name="remarks"
            value={editOrderData.remarks}
            onChange={handleEditChange}
          />
        </div>

        <div className="mb-4 flex gap-x-2">
          <input
            type="checkbox"
            name="status"
            checked={editOrderData.status === "shipped"}
            onChange={(e) =>
              setEditOrderData((prev) => ({
                ...prev,
                status: e.target.checked ? "shipped" : "open",
              }))
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
          <Label text="Mark as Shipped" />
        </div>
        <PendingRed
          title="Delete Order"
          size="full"
          onClick={() => handleDeleteOrder(po._id)}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full border border-t-stroke  bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton title="Cancel" size="full" onClick={onCancel} />
          </div>
          <div className="flex-1">
            <PrimaryButton
              title="Save Changes"
              onClick={handleSaveChanges}
              size="full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCustomOrder;
