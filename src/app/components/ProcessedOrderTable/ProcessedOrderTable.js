import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import SearchBar from "../SearchBar/SearchBar";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import { ICONS } from "@/app/utils/icons";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import DynamicTableInsideSidebar from "../DynamicTableInsideSidebar/DynamicTableInsideSidebar";


const ProcessedOrderTable = () => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);

  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();

  // Fetch all processed orders
  const { allOrderDetails } = useSelector((state) => state.orderDetail);
  console.log("🚀 ~ ProcessedOrderTable ~ allOrderDetails:", allOrderDetails);

  // Sort orders by updated date
  const sortedOrders = allOrderDetails.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedOrders);

  const applyFilters = () => {
    let data = allOrderDetails;

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
  }, [allOrderDetails, searchText]);

  useEffect(() => {
    setFilteredData(sortedOrders);
  }, [sortedOrders]);

  const convertToCSV = (data) => {
    const headers = [
      "ORDER ID",
      "AWB NUMBER",
      "REFERENCE CODE",
      "FULFILLED SKU CODES",
      "FULFILLED QR CODES",
      "UPDATED AT",
    ];

    const rows = data.map((order) => [
      order?.orderId,
      order?.awbNumber || "",
      order?.referenceCode || "",
      order?.fulfilledQRCodes.map((item) => item.skuCode).join(", ") || "",
      order?.fulfilledQRCodes.map((item) => item.qrCode).join(", ") || "",
      moment(order?.updatedAt).format("DD MMM YYYY") || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const currentDateAndFileName = `Processed_Orders_${moment().format(
      "DD-MMM-YYYY"
    )}.csv`;
    link.setAttribute("download", currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const searchKeys = [
    "orderId",
    "awbNumber",
    "referenceCode",
    "fulfilledQRCodes.skuCode",
    "fulfilledQRCodes.qrCode",
  ];

  const headings = {
    updatedAt: {
      label: "Updated On",
      renderCell: (row) => moment(row?.updatedAt).format("DD MMM YYYY HH:mm"),
      isSticky: false,
    },
    orderId: {
      label: "Order Id",
      renderCell: (row) => row?.orderId || "N/A",
      isSticky: false,
    },
    awbNumber: {
      label: "AWB Number",
      renderCell: (row) => row?.awbNumber || "N/A",
      isSticky: false,
    },
    referenceCode: {
      label: "Reference Code",
      renderCell: (row) => row?.referenceCode || "N/A",
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
        action: () => openSidebar("viewDetail", po),
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

  const headingsInsideSidebar = [
    {
      label: "SKU Code",
      renderCell: (row) => row?.skuCode || "N/A",
    },
    {
      label: "QR Code",
      renderCell: (row) => row?.qrCode || "N/A",
    },
  ];

  

  return (
    <>
      <PoFilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={sortedOrders}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {sidebarType === "viewDetail" && (
          <>
            <DynamicTableInsideSidebar
              headings={headingsInsideSidebar}
              rows={selectedPo?.fulfilledQRCodes || []}
              handleCancel={closeSidebar}
            />
          </>
        )}
      </RightSidebar>
    </>
  );
};

export default ProcessedOrderTable;
