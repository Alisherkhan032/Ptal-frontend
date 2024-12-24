"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { QrCodeServices } from "@/app/services/qrGenerate";
import GenerateQrFormEngraving from "../GenerateQRFormEngraving/GenerateQRFormEngraving";
import StatusComponent from "../StatusComponent/StatusComponent";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import PoFilterBar from "../PoFilterBar/PoFilterBar";

const EngravingOrderTable = () => {
  // Fetch engraving orders from Redux store
  const { allEngravingOrders } = useSelector((state) => state.engravingOrder);

  // Sort orders by last updated date (descending)
  const sortedOrders = allEngravingOrders.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  // States
  const [filteredData, setFilteredData] = useState(sortedOrders); // Filtered orders for display
  const [isRawMaterialQRFLowSuccessfull, setIsRawMaterialQRFLowSuccessful] =
    useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);
  const [filter, setFilter] = useState("allPo");
  const [searchText, setSearchText] = useState("");

  const applyFilters = () => {
      let data = allEngravingOrders;
  
      if (filter !== "allPo") {
        data = data.filter((item) => item.status === filter);
      }
  
      data = data.filter((item) =>
        searchKeys.some((key) =>
          searchNested(item[key], searchText.toLowerCase(), key)
        )
      );

      setFilteredData(data);
    };
  
    const searchNested = (obj, query, key) => {
      if (Array.isArray(obj)) {
        return obj.some((item) => searchNested(item, query, key));
      }
      if (typeof obj === "object" && obj !== null) {
        return Object.values(obj).some((val) => searchNested(val, query, key));
      }
      if (typeof obj === "string") {
        return obj.toLowerCase().includes(query);
      }
      if (typeof obj === "number" && key === "quantity") {
        return obj.toString().includes(query);
      }
      return false;
    };
  
    useEffect(() => {
      applyFilters();
    }, [filter,  allEngravingOrders, searchText]);

  // Generate CSV filename with current date
  const currentDateAndFileName = `Engraving_Order_${moment().format(
    "DD-MMM-YYYY"
  )}`;

  
  useEffect(() => {
    setFilteredData(sortedOrders);
  }, [sortedOrders]);

  
  // Convert orders to CSV format for download
  const convertToCSV = (data) => {
    const headers = [
      "ORDER ID",
      "ORDER STATUS",
      "CREATED AT",
      "ENGRAVING CONTENT",
      "SKU CODE",
      "QUANTITY",
      "INVENTORY QR CODE",
      "ENGRAVING QR CODE",
    ];

    const rows = data
      .map((order) =>
        order?.listOfProducts.map((product) => [
          order?.orderID,
          order?.status,
          order?.createdAt
            ? moment(order.createdAt).format("DD MMM YYYY HH:mm")
            : "",
          product?.engravingContent,
          product?.skuCode,
          product?.quantity,
          product?.inventory_qr_code,
          product?.engraving_qr_code,
        ])
      )
      .flat();

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

  useEffect(() => {
    if (isRawMaterialQRFLowSuccessfull) {
      closeRawMaterialQRModal();
      setIsRawMaterialQRFLowSuccessful(false);
    }
  }, [isRawMaterialQRFLowSuccessfull]);

  // Generate PDF for engraved QR codes
  const handleGenerateQRCode = async (order) => {
    try {
      if (order.status === "outwarded_from_storage") {
        openRawMaterialQRModal(order);
      } else {
        const response = await QrCodeServices.generateEngravedQrPDF(order);

        // Create and download PDF link
        const url = window.URL.createObjectURL(
          new Blob([response], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Engraving_Order_${order?.orderID}_QR_Codes.pdf`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error generating QR Code:", error);
    }
  };

  const searchKeys = [
    "orderID",
    "status",
    "listOfProducts",
    "skuCode",
    "quantity",
  ];

  const headings = {
    orderID: {
      label: "Order ID",
      renderCell: (row) => row?.orderID || "N/A",
      isSticky: false,
    },
    status: {
      label: "Status",
      renderCell: (row) => <StatusComponent status={row?.status} /> || "N/A",
      isSticky: false,
    },
    createdAt: {
      label: "Created On",
      renderCell: (row) =>
        row?.createdAt
          ? moment(row?.createdAt).format("DD MMM YYYY HH:mm")
          : "N/A",
      isSticky: false,
    },
    engravingContent: {
      label: "Engraving Content",
      renderCell: (row) =>
        row?.listOfProducts
          ?.map((product) => product?.engravingContent)
          .join(", ") || "N/A",
      isSticky: false,
    },
    skuCode: {
      label: "SKU Code",
      renderCell: (row) =>
        row?.listOfProducts?.map((product) => product?.skuCode).join(", ") ||
        "N/A",
      isSticky: false,
    },
    quantity: {
      label: "Quantity",
      renderCell: (row) =>
        row?.listOfProducts?.map((product) => product?.quantity).join(", ") ||
        "N/A",
      isSticky: false,
    },
    action: {
      label: "Action",
      renderCell: (row) => (
        <ActionDropdown po={row} actions={generatePOActions(row)} />
      ),
      isSticky: true,
      stickyClassHeader: stickyActionColumnClassname,
      stickyClassRow: stickyActionRowClassname,
    },
  };

  const generatePOActions = (po) => {
    return [
      {
        label: "View Details",
        condition: null,
        action: () => openSidebar("inward", po),
      },
      {
        label: "Generate QR Code",
        condition: (po) => po.status !== "pending",
        action: () => handleGenerateQRCode(po),
      },
    ];
  };

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

  const filterOptions = [
    { value: "allPo", label: "All POs" },
    { value: "pending", label: "Pending" },
    {
      value: "engraving_done_and_QRCode_generated",
      label: "Engraving Done and QR Code Generated",
    },
    { value: "outwarded_from_inventory", label: "Outward From Inventory" },
    { value: "outwarded_from_storage", label: "Outward From Storage" },
  ];

  return (
    <>
      <PoFilterBar
        filter={filter}
        setFilter={setFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={filteredData}
        filterOptions={filterOptions}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />
    </>
  );
};

export default EngravingOrderTable;
