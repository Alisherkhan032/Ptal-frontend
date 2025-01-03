"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { orderServices } from "@/app/services/oderService";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import DynamicTableInsideSidebar from "@/app/components/DynamicTableInsideSidebar/DynamicTableInsideSidebar";
import EditCustomOrder from "../EditCustomOrder/EditCustomOrder";
import PoFilterBar from "@/app/components/PoFilterBar/PoFilterBar";
import { ICONS } from "@/app/utils/icons";
import { filterByDate } from '@/app/components/DateFilter/DateFilter';
import searchNested from '@/app/utils/searchUtils';

const CustomOrderTable = () => {
  const { allCustomOrders } = useSelector((state) => state.order);

  const sortedMaterials = allCustomOrders.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  const [filteredData, setFilteredData] = useState(sortedMaterials);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [dayFilter, setDayFilter] = useState("all");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrderData, setEditOrderData] = useState({});

  const currentDateAndFileName = `Custom_Order_${moment().format(
    "DD-MMM-YYYY"
  )}`;
  const [searchText, setSearchText] = useState("");

  const applyFilters = () => {
    let data = allCustomOrders;

    data = filterByDate(data, dayFilter);

    data = data.filter((item) =>
      searchKeys.some((key) =>
        searchNested(item[key], searchText.toLowerCase(), key)
      )
    );

    setFilteredData(data);
  };


  useEffect(() => {
    applyFilters();
  }, [allCustomOrders, searchText, dayFilter]);

  // Convert data to CSV
  const convertToCSV = (data) => {
    const headers = [
      "ORDER ID",
      "ORDER TITLE",
      "CREATED AT",
      "ORDER DATE",
      "SCHEDULED DISPATCH DATE",
      "PLATFORM/MODE",
      "NUMBER OF DISTINCT SKU",
      "DESIRED QUANTITY",
      "FULFILLED QUANTITY",
      "RETAILER",
      "LOCATION",
      "TRACKING NUMBER",
      "STATUS",
      "FULFILLED AT",
      "REMARKS",
    ];

    const rows = data.map((order) => {
      const totalQuantity = order?.listOfProducts.reduce(
        (acc, product) => acc + product.quantity,
        0
      );
      const totalFulfilledQuantity = order?.listOfProducts.reduce(
        (acc, product) => acc + (product.fulfilledQuantity || 0),
        0
      );

      return [
        order?.orderId,
        order?.orderTitle,
        order?.createdAt
          ? moment(order.createdAt).format("DD MMM YYYY HH:mm")
          : "",
        order?.orderDate ? moment(order.orderDate).format("DD MMM YYYY") : "",
        order?.scheduledDispatchDate
          ? moment(order.scheduledDispatchDate).format("DD MMM YYYY")
          : "",
        order?.platform,
        order?.listOfProducts.length,
        totalQuantity,
        totalFulfilledQuantity,
        order?.retailer,
        order?.location,
        order?.trackingNumber,
        order?.status,
        order?.fulfilledAt
          ? moment(order.fulfilledAt).format("DD MMM YYYY HH:mm")
          : "",
        order?.remarks,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const searchKeys = [
    "orderId",
    "orderTitle",
    "orderDate",
    "fulfilledBy",
    "createdAt",
    "status",
    "scheduledDispatchDate",
    "platform",
    "quantity",
    "retailer",
    "location",
    "trackingNumber",
    "remarks",
  ];

  useEffect(() => {
    setFilteredData(sortedMaterials);
  }, [sortedMaterials]);

  // Modal functions
  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  // Edit modal functions
  const openEditModal = (order) => {
    setEditOrderData({
      orderInternalId: order._id,
      orderId: order.orderId,
      orderTitle: order.orderTitle,
      trackingNumber: order.trackingNumber,
      remarks: order.remarks,
      status: order.status,
      // Include other fields you want to edit based on your schema
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditOrderData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    console.log("data =====", editOrderData);
    const result = await orderServices.editOrderByOrderInternalId(
      editOrderData
    );
    if (result.success) {
      alert("Order updated successfully!");
      closeEditModal();
    } else {
      alert("Failed to update order: " + result.error);
    }
  };

  function formatStatus(status) {
    if (!status) return status;

    // Replace underscores with spaces and split the string into words
    const words = status.replace(/_/g, " ").split(" ");

    // Capitalize the first letter of each word
    const formattedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    // Join the words back into a single string
    return formattedWords.join(" ");
  }

  // Handle Delete Order
  const handleDeleteOrder = async (orderId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this order? This action is irreversible."
    );

    if (confirmation) {
      try {
        const result = await orderServices.deleteOrderByOrderId(orderId);

        if (result.success) {
          alert("Order deleted successfully!");
          closeEditModal();
          window.location.reload();
          // Optionally, refresh orders if needed
        } else {
          alert("Failed to delete order: " + result.error);
        }
      } catch (error) {
        alert("An error occurred: " + error.message);
      }
    }
  };

  const headings = {
    createdAt: {
      label: "Created On",
      renderCell: (row) =>
        moment(row?.createdAt).format("DD MMM YYYY") || "N/A",
      isSticky: false,
    },
    orderId: {
      label: "Order ID",
      renderCell: (row) => row?.orderId || "N/A",
      isSticky: false,
    },
    orderTitle: {
      label: "Order Title",
      renderCell: (row) => row?.orderTitle || "N/A",
      isSticky: false,
    },
    orderDate: {
      label: "Order Date",
      renderCell: (row) =>
        moment(row?.orderDate).format("DD MMM YYYY") || "N/A",
      isSticky: false,
    },
    scheduledDispatchDate: {
      label: "Scheduled Dispatch Date",
      renderCell: (row) =>
        moment(row?.scheduledDispatchDate).format("DD MMM YYYY") || "N/A",
      isSticky: false,
    },
    platform: {
      label: "Platform/Mode",
      renderCell: (row) => row?.platform || "N/A",
      isSticky: false,
    },
    numberOfDistinctSKU: {
      label: "Number of Distinct SKU",
      renderCell: (row) => row?.listOfProducts.length || "N/A",
      isSticky: false,
    },
    totalQuantity: {
      label: "Desired Quantity",
      renderCell: (row) => {
        const totalQuantity = row?.listOfProducts?.reduce(
          (acc, product) => acc + (product?.quantity || 0),
          0
        );
        return totalQuantity || "N/A";
      },
      isSticky: false,
    },
    totalfulfilledQuantity: {
      label: "Fulfilled Quantity",
      renderCell: (row) => {
        const totalFulfilled = row?.listOfProducts?.reduce(
          (acc, product) => acc + (product?.fulfilledQuantity || 0),
          0
        );
        return totalFulfilled || "N/A";
      },
      isSticky: false,
    },
    retailer: {
      label: "Retailer",
      renderCell: (row) => row?.retailer || "N/A",
      isSticky: false,
    },
    location: {
      label: "Location",
      renderCell: (row) => row?.location || "N/A",
      isSticky: false,
    },
    trackingNumber: {
      label: "Tracking Number",
      renderCell: (row) => row?.trackingNumber || "N/A",
      isSticky: false,
    },
    status: {
      label: "Status",
      renderCell: (row) => formatStatus(row?.status) || "N/A",
    },
    fulfilledAt: {
      label: "Fulfilled At",
      renderCell: (row) =>
        moment(row?.fulfilledAt).format("DD MMM YYYY") || "N/A",
      isSticky: false,
    },
    remarks: {
      label: "Remarks",
      renderCell: (row) => row?.remarks || "N/A",
      isSticky: false,
    },
    action: {
      label: "Action",
      renderCell: (row) => (
        <ActionDropdown
          po={row}
          actions={generatePOActions(row)}
          customElement={customUpdateIcon(row)}
        />
      ),
      isSticky: true,
      stickyClassHeader: stickyActionColumnClassname,
      stickyClassRow: stickyActionRowClassname,
    },
  };

  const generatePOActions = (po) => [
    {
      label: "View Details",
      condition: null,
      action: () => handleSidebarContent("viewDetails", po),
    },
    // {
    //   label: "Edit Order",
    //   condition: () => po.status !== "shipped",
    //   action: () => handleSidebarContent("editOrder", po),
    // },
  ];

   const customUpdateIcon =(po) => [
      {
        label: ICONS.update,
        condition: () => () => po.status !== "shipped",
        action: (po) => handleSidebarContent("editOrder", po),
      },
    ];
  

  const openSidebar = (type, po) => {
    setSidebarType(type);
    setSelectedPo(po);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSidebarType(null);
    setSelectedPo(null);
  };

  const handleSidebarContent = (actionType, po = null) => {
    const sidebarComponents = {
      viewDetails: (
        <DynamicTableInsideSidebar
          headings={headingsInsideSidebar}
          rows={po?.listOfProducts}
          handleCancel={() => closeSidebar()}
        />
      ),
      editOrder: (
        <EditCustomOrder
          editOrderData={po}
          handleEditChange={handleEditChange}
          handleSaveChanges={handleSaveChanges}
          handleDeleteOrder={handleDeleteOrder}
          closeModal={closeEditModal}
          po={po}
          onCancel={() => closeSidebar()}
        />
      ),
    };

    const content = sidebarComponents[actionType] || null;
    setSidebarContent(content);
    setIsSidebarOpen(!!content);
  };

  const headingsInsideSidebar = [
    {
      label: "SKU Code",
      renderCell: (row) => row?.skuCode || "N/A",
    },
    {
      label: "Desired Units",
      renderCell: (row) => row?.quantity || "N/A",
    },
    {
      label: "Fulfilled Units",
      renderCell: (row) => row?.fulfilledQuantity || "N/A",
    },
  ];
  
  const handleDayFilterChange = (event) => {
    setDayFilter(event.target.value);
  };


  return (
    <>
      <PoFilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={allCustomOrders}
        dayFilter={dayFilter}
        handleDayFilterChange={handleDayFilterChange} 
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar} // Close the sidebar
      >
        {sidebarContent}
      </RightSidebar>
    </>
  );
};

export default CustomOrderTable;
