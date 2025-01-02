import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import SearchBar from "../SearchBar/SearchBar";
import Button from "../Button/Button";
import { rawMaterialServices } from "@/app/services/rawMaterialService";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import { SecondaryButton } from "../ButtonComponent/ButtonComponent";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import DynamicTableInsideSidebar from "../DynamicTableInsideSidebar/DynamicTableInsideSidebar";

const RtoOrderTable = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  // Fetch all RTO orders
  const { orders } = useSelector((state) => state.rtoOrder);

  // Sort orders by updated date
  const sortedOrders = orders.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedOrders);

  useEffect(() => {
    setFilteredData(sortedOrders);
  }, [sortedOrders]);

  const applyFilters = () => {
    let data = orders;

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
  }, [orders, searchText]);

  const convertToCSV = (data) => {
    const headers = [
      "ORDER ID",
      "AWB NUMBER",
      "SOURCE PLATFORM",
      "LOGISTICS PARTNER",
      "RETURNED ITEMS",
      "CREATED AT",
    ];

    const rows = data.map((order) => [
      order?.orderId,
      order?.awbNumber || "",
      order?.sourcePlatform || "",
      order?.logisticsPartner || "",
      order?.returnedItems
        .map((item) => `${item.sku}: ${item.quantity}`)
        .join(", ") || "",
      moment(order?.createdAt).format("DD MMM YYYY") || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const currentDateAndFileName = `RTO_Orders_${moment().format(
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
    "sourcePlatform",
    "logisticsPartner",
    "returnedItems.sku",
    "returnedItems.quantity",
  ];
  const headings = {
    createdAt: {
      label: "Created On",
      renderCell: (row) =>
        moment(row?.createdAt).format("DD MMM YYYY HH:mm") || "N/A",
      isSticky: false,
    },
    orderId: {
      label: "Order ID",
      renderCell: (row) => row?.orderId || "N/A",
      isSticky: false,
    },
    awbNumber: {
      label: "AWB NUmber",
      renderCell: (row) => row?.awbNumber || "N/A",
      isSticky: false,
    },
    sourcePlatform: {
      label: "Source Platform",
      renderCell: (row) => row?.sourcePlatform || "N/A",
      isSticky: false,
    },
    logisticsPartner: {
      label: "Logistic partner",
      renderCell: (row) => row?.logisticsPartner || "N/A",
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
        action: () => handleViewDetails(po),
      },
    ];
  };

  const handleViewDetails = async (po) => {
    setSidebarType("viewDetail");

    // Check if returnedItems is empty
    if (!po.returnedItems || po.returnedItems.length === 0) {
      setSelectedPo(po); // Directly set the PO without API call
      setIsSidebarOpen(true); // Open the sidebar
      return;
    }

    // Proceed with the API call if returnedItems is not empty
    try {
      setIsSidebarOpen(true);
      const detailedItems = await Promise.all(
        po.returnedItems.map(async (item) => {
          try {
            const response = await rawMaterialServices.getSkuCodeById(item.sku);
            return { ...item, sku: response.data.sku_code };
          } catch (error) {
            console.error("Error fetching SKU code:", error);
            return item; // Fallback to original item in case of error
          }
        })
      );

      setSelectedPo({ ...po, returnedItems: detailedItems });
    } catch (error) {
      console.error("Error fetching PO details:", error);
    }
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

  console.log("selectedPo", selectedPo);

  const headingsInsideSidebar = [
    {
      label: "SKU Code",
      renderCell: (row) => row?.sku || "N/A",
    },
    {
      label: "Quantity",
      renderCell: (row) => row?.quantity || "N/A",
    },
  ];

  return (
    <>
      <PoFilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={orders}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {sidebarType === "viewDetail" &&
          (selectedPo ? (
            <>
              <h2 className="text-base font-semibold text-[#111928] mb-2 ml-2">
                Returned Items Details
              </h2>
              <p className="text-sm font-normal text-[#4B5563] mb-6 ml-2">
                View the Returned Items Sku Code and Quantity
              </p>
              <DynamicTableInsideSidebar
                headings={headingsInsideSidebar}
                rows={selectedPo?.returnedItems || []}
                handleCancel={closeSidebar}
              />
            </>
          ) : (
            <div className="">
              <p className="text-gray-500 font-medium text-base">
                Loading details...
              </p>
            </div>
          ))}
      </RightSidebar>
    </>
  );
};

export default RtoOrderTable;
