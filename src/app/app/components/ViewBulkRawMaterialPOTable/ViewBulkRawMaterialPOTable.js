"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import SearchBar from "../SearchBar/SearchBar";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import { ICONS } from "@/app/utils/icons";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import DynamicTableInsideSidebar from "../DynamicTableInsideSidebar/DynamicTableInsideSidebar";
import { filterByDate } from '@/app/components/DateFilter/DateFilter';
import searchNested from '@/app/utils/searchUtils';

const ViewBulkRawMaterialPOTable = () => {
  const { allBulkRawMaterialPO, loading, error } = useSelector(
    (state) => state.bulkRawMaterialPO
  );
  const [openIndex, setOpenIndex] = useState(null);
  const sortedMaterials = allBulkRawMaterialPO.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedMaterials);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [dayFilter, setDayFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);
  const currentDateAndFileName = `View_B2B_PO_${moment().format(
    "DD-MMM-YYYY"
  )}`;

  const convertToCSV = (data) => {
    const headers = [
      "RAW MATERIAL NAME",
      "QUANTITY",
      "RAISED BY",
      "FULFILLED BY",
      "CREATED AT",
    ];

    const rows = data.map((po) => [
      po?.raw_material_id?.material_name,
      po?.quantity,
      `${po?.createdBy?.firstName} ${po?.createdBy?.lastName}` || "",
      `${po?.fulfilledBy?.firstName} ${po?.fulfilledBy?.lastName}` || "",
      moment(po?.createdAt).format("DD MM YYYY") || "",
    ]);

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
    setFilteredData(sortedMaterials);
    setCurrentPage(1);
  }, [sortedMaterials]);

  const applyFilters = () => {
    let data = allBulkRawMaterialPO;

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
  }, [allBulkRawMaterialPO, searchText, dayFilter]);

  const searchKeys = [
    "raw_material_id",
    "quantity",
    "createdBy",
    "fulfilledBy",
    "createdAt",
    "bulkOrderReference",
  ];

  const headings = {
    createdAt: {
      label: "Created On",
      renderCell: (row) =>
        moment(row?.createdAt).format("DD MMM YYYY") || "N/A",
      isSticky: false,
    },
    bulkOrderReference: {
      label: "Bulk Order Refrence",
      renderCell: (row) => row?.bulkOrderReference || "N/A",
      isSticky: false,
    },
    material_name: {
      label: "Material Name",
      renderCell: (row) => row?.raw_material_id?.material_name || "N/A",
      isSticky: false,
    },
    quantity: {
      label: "Quantity",
      renderCell: (row) => row?.quantity || "N/A",
      isSticky: false,
    },
    created_by: {
      label: "Raised By",
      renderCell: (row) =>
        `${row?.created_by?.firstName} ${row?.created_by?.lastName}` || "N/A",
      isSticky: false,
    },
    fulfilledBy: {
      label: "Fulfilled By",
      renderCell: (row) =>
        `${row?.fulfilledBy?.firstName} ${row?.fulfilledBy?.lastName}` || "N/A",
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
        label: "View Batches",
        condition: null,
        action: () => openSidebar("viewBatches", po),
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

  console.log("selectedPo", selectedPo);

  const headingsInsideSidebar = [
    {
      label: "Batch Number",
      renderCell: (row) => row?.batchNumber || "N/A",
    },
    {
      label: "Quantity",
      renderCell: (row) => row?.quantity || "N/A",
    },
  ];

  function createDataArray(data) {
    return data.batchData.map(item => ({
      batchNumber: item.batchNumber,
      quantity: item.quantity,
    }));
  }

  const handleDayFilterChange = (event) => {
    setDayFilter(event.target.value);
  };

  return (
    <>
      <PoFilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={sortedMaterials}
        dayFilter={dayFilter}
        handleDayFilterChange={handleDayFilterChange}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {sidebarType === "viewBatches" && (
          <DynamicTableInsideSidebar
            headings={headingsInsideSidebar}
            rows={createDataArray(selectedPo) || []}
            handleCancel={closeSidebar}
          />
          // <h1>hi</h1>
        )}
      </RightSidebar>
    </>
  );
};

export default ViewBulkRawMaterialPOTable;
