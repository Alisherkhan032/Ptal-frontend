"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";

// Services
import { engravingOrderServices } from "@/app/services/engravingOrderService";
import { batchServices } from "@/app/services/batchService";

// Components
import { PrimaryButton } from "@/app/components/ButtonComponent/ButtonComponent";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";

// Utils
import { items } from "@/app/utils/sidebarItems";
import {
  getAllEngravingOrdersRequest,
  getAllEngravingOrdersSuccess,
} from "../../Actions/engravingOrderActions";
import BatchSelectionForm from "@/app/components/BatchSelectionForm/BatchSelectionForm";

// Add custom Yup validation method
Yup.addMethod(
  Yup.string,
  "validateBatch",
  function (message, availableBatches) {
    return this.test("validateBatch", message, function (value) {
      const { path } = this;
      const batch = availableBatches.find((b) => b.batch_number === value);

      if (!batch) {
        return this.createError({ path, message: `${message} does not exist` });
      }

      if (batch.remaining_quantity <= 0) {
        return this.createError({
          path,
          message: `${message} has no remaining quantity`,
        });
      }

      return true;
    });
  }
);

const StoragePage = () => {
  // State Management
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isOutwardSidebarOpen, setIsOutwardSidebarOpen] = useState(false);
  const [validationSchema, setValidationSchema] = useState(Yup.object());
  const [batchInfo, setBatchInfo] = useState([]);
  const [groupedFields, setGroupedFields] = useState({});

  // Redux Dispatch
  const dispatch = useDispatch();

  // Fetch Engraving Orders
  const getAllEngravingOrders = async () => {
    try {
      dispatch(getAllEngravingOrdersRequest());

      const response = await engravingOrderServices.getAllEngravingOrders();
      if (response.success === true) {
        dispatch(getAllEngravingOrdersSuccess(response.data));
      }
    } catch (err) {
      console.error("Error fetching engraving orders:", err);
      toast.error("Failed to fetch orders", { autoClose: 2000 });
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    getAllEngravingOrders();
  }, []);

  // Get Engraving Orders from Redux
  const { allEngravingOrders } = useSelector((state) => state.engravingOrder);

  // Filter and Sort Orders
  const filteredOrders = allEngravingOrders
    .filter(
      (order) => order.status === "pending" && order.type === "rawMaterial"
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  // Checkbox Handler
  const handleCheckboxChange = (orderID) => {
    setSelectedOrders((prevSelectedOrders) =>
      prevSelectedOrders.includes(orderID)
        ? prevSelectedOrders.filter((id) => id !== orderID)
        : [...prevSelectedOrders, orderID]
    );
  };

  // Outward Orders Handler
  const handleOutwardOrders = async () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order.", { autoClose: 2000 });
      return;
    }

    setIsOutwardSidebarOpen(true);

    try {
      // Aggregate SKUs from selected orders
      const aggregatedSKUs = selectedOrders.flatMap((_id) => {
        const order = filteredOrders.find((order) => order._id === _id);
        return order.listOfProducts.map((product) => ({
          skuCode: product.skuCode,
          quantity: product.quantity,
        }));
      });

      // Group SKUs by total quantity
      const groupedSKUs = aggregatedSKUs.reduce(
        (acc, { skuCode, quantity }) => {
          acc[skuCode] = (acc[skuCode] || 0) + quantity;
          return acc;
        },
        {}
      );

      // Fetch batch information
      const response = await batchServices.getBatchInfoBySKUCode({
        skuCodes: Object.keys(groupedSKUs),
      });

      if (response.success) {
        const batchData = response.data;
        setBatchInfo(batchData);
        setGroupedFields(groupedSKUs);

        // Build dynamic validation schema
        const schemaFields = Object.entries(groupedSKUs).reduce(
          (acc, [skuCode, totalQuantity]) => {
            for (let i = 0; i < totalQuantity; i++) {
              const fieldName = `batch_${skuCode}_${i + 1}`;
              acc[fieldName] = Yup.string()
                .required("Batch is required")
                .test(
                  "validateBatch",
                  "Invalid batch or exceeds available quantity",
                  function (value, context) {
                    const allValues = context.parent;
                    const usedBatches = Object.values(allValues).reduce(
                      (counts, batchNumber) => {
                        if (batchNumber) {
                          counts[batchNumber] = (counts[batchNumber] || 0) + 1;
                        }
                        return counts;
                      },
                      {}
                    );

                    const batchAvailable = batchData[skuCode]?.batches[value];
                    return (
                      batchAvailable && usedBatches[value] <= batchAvailable
                    );
                  }
                );
            }
            return acc;
          },
          {}
        );

        setValidationSchema(Yup.object().shape(schemaFields));
      } else {
        toast.error(`Error fetching batch info: ${response.message}`, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error fetching batch info:", error);
      toast.error("Failed to fetch batch info.", { autoClose: 2000 });
    }
  };

  // Submit Batch Form Handler
  const handleSubmit = async (values) => {
    try {
      const processedOrderIDs = selectedOrders;
      const batchCounts = {};

      Object.entries(values).forEach(([key, batchNumber]) => {
        if (batchNumber) {
          batchCounts[batchNumber] = (batchCounts[batchNumber] || 0) + 1;
        }
      });

      const payload = {
        selectedOrderID: processedOrderIDs,
        Batches: batchCounts,
      };

      const response = await engravingOrderServices.outwardFromStorage(payload);

      if (response.success) {
        toast.success("Batches submitted successfully!", {
          autoClose: 2000,
          onClose: () => window.location.reload(),
        });
      } else {
        toast.error(`Submission failed: ${response.message}`, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting batches:", error);
      toast.error("An error occurred while submitting batches.", {
        autoClose: 2000,
      });
    }
  };

  // Generate Navigation Items
  const generateNavItems = () => {
    const storageTeam = items.find((item) => item.label === "Storage");
    if (storageTeam && storageTeam.subItems) {
      return storageTeam.subItems.map((subItem) => ({
        name: subItem.label,
        path: subItem.path,
        icon: subItem.iconKey,
      }));
    }
    return [];
  };
  const navItems = generateNavItems();

  // Table Headings
  const headings = {
    checkbox: {
      label: "Select",
      isCheckbox: true,
      onChange: (row) => handleCheckboxChange(row._id),
      isSticky: false,
    },
    orderID: {
      label: "Order ID",
      renderCell: (row) => row.orderID || "N/A",
      isSticky: false,
    },
    skuCode: {
      label: "Sku Code",
      renderCell: (row) =>
        row?.listOfProducts.map((p) => p.skuCode).join(", ") || "N/A",
      isSticky: false,
    },
    quantity: {
      label: "Qty",
      renderCell: (row) => row?.listOfProducts[0].quantity || "N/A",
      isSticky: false,
    },
    updatedAt: {
      label: "Updated At",
      renderCell: (row) =>
        moment(row.updatedAt).format("YYYY-MM-DD HH:mm:ss") || "N/A",
      isSticky: false,
    },
  };

  // Action Buttons
  const buttons = [
    <PrimaryButton
      title="Fulfil"
      onClick={handleOutwardOrders}
      size="medium"
    />
  ];

  return (
    <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
      <div className="relative z-10 flex flex-col items-center overflow-scroll scrollbar-none px-4 py-2">
        <div className="w-full max-w-full mb-4">
          <TitleBar title="Storage" buttons={buttons} />
        </div>

        <div className="w-full max-w-full mb-5">
          <NavigationBar navItems={navItems} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg bg-gray-1 overflow-y-auto scrollbar-none">
            <DynamicTableWithoutAction
              headings={headings}
              rows={filteredOrders}
            />
          </div>
        </div>

        {/* Outward Sidebar */}
        {isOutwardSidebarOpen && (
          <RightSidebar
            isOpen={isOutwardSidebarOpen}
            onClose={() => setIsOutwardSidebarOpen(false)}
          >
            {/* {renderBatchForm()} */}
            <BatchSelectionForm
              groupedFields={groupedFields}
              onSubmit={handleSubmit}
              onCancel={() => setIsOutwardSidebarOpen(false)}
            />
          </RightSidebar>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default StoragePage;
