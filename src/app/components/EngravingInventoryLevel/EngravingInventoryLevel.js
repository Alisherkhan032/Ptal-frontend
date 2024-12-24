"use client";
import React, { useState, useEffect } from "react";
import { engravingOrderServices } from "@/app/services/engravingOrderService";
import moment from "moment";
import SearchBar from "../SearchBar/SearchBar";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import {
  SecondaryButton,
  PrimaryButton,
} from "@/app/components/ButtonComponent/ButtonComponent";
import PoFilterBar from "../PoFilterBar/PoFilterBar";

const ViewDetailComponent = ({
  productName,
  inProgress,
  engravedAndOutwarded,
  handleCancel,
}) => {
  return (
    <>
      <div className="relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <h2 className="text-base font-semibold text-[#111928] mb-1">
          Details for -{" "}
          <span className="text-sm font-normal text-[#4B5563]">
            {productName}
          </span>
        </h2>
        <p className="text-sm font-normal text-[#4B5563] mb-6"></p>

        <div className="block text-[#111928] text-sm font-medium mb-6">
          In Progress QR Codes:
        </div>

        <div className=" mb-6">
          <ul className="list-disc ml-5">
            {inProgress.length > 0 ? (
              inProgress.map((qr, index) => (
                <li key={index} className="text-sm text-gray-600 mb-2">
                  {qr}
                </li>
              ))
            ) : (
              <span className="text-sm text-red-400 font-medium">
                No QR codes found
              </span>
            )}
          </ul>
        </div>

        <div className="block text-[#111928] text-sm font-medium mb-6">
          Engraved And Outwarded QR Codes:
        </div>

        <div className="flex flex-col mb-6">
          <ul className="list-disc ml-5">
            {engravedAndOutwarded.length > 0 ? (
              engravedAndOutwarded.map((qr, index) => (
                <li key={index} className="text-sm text-gray-600 mb-2">
                  {qr}
                </li>
              ))
            ) : (
              <span className="text-sm text-red-400 font-medium">
                No QR codes found
              </span>
            )}
          </ul>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full border border-t-stroke bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton
              title="Cancel"
              onClick={handleCancel}
              size="full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const EngravingInventoryLevel = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchInventoryLevels = async () => {
      try {
        const response =
          await engravingOrderServices.getEngravingInventoryLevels();
        if (response.success) {
          setInventoryData(response.data);
          setFilteredData(response.data);
          console.log("Inventory levels:", response.data);
        } else {
          console.error("Error fetching inventory levels:", response.message);
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryLevels();
  }, []);

  const applyFilters = () => {
    if (!searchText.trim()) {
      setFilteredData(inventoryData);
      return;
    }

    const filtered = inventoryData.filter((item) =>
      searchKeys.some((key) =>
        searchNested(item[key], searchText.toLowerCase(), key)
      )
    );

    setFilteredData(filtered);
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
  }, [inventoryData, searchText]);

  const searchKeys = ["product_name", "in_progress", "engraved_and_outwarded"];

  // CSV Export
  const convertToCSV = (data) => {
    const headers = [
      "PRODUCT NAME",
      "IN PROGRESS COUNT",
      "ENGRAVED AND OUTWARDED COUNT",
    ];
    const rows = data.map((item) => [
      item.product_name,
      item.in_progress.length,
      item.engraved_and_outwarded.length,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Engraving_Inventory_${moment().format("DD-MMM-YYYY")}`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const headings = {
    product_name: {
      label: "Product Name",
      renderCell: (row) => row?.product_name || "N/A",
      isSticky: false,
    },
    InProgressCount: {
      label: "In Progress Count",
      renderCell: (row) => row?.in_progress.length || "0",
      isSticky: false,
    },
    engravedAndOutwardedCount: {
      label: "Engraved And Outwarded Count",
      renderCell: (row) => row?.engraved_and_outwarded.length || "0",
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

  return (
    <>
      <PoFilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={filteredData}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {sidebarType === "viewDetail" && (
          <ViewDetailComponent
            productName={selectedPo?.product_name}
            inProgress={selectedPo?.in_progress || []}
            engravedAndOutwarded={selectedPo?.engraved_and_outwarded || []}
            handleCancel={closeSidebar}
          />
        )}
      </RightSidebar>
    </>
  );
};

export default EngravingInventoryLevel;
