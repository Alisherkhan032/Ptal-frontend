"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import StatusComponent from "../StatusComponent/StatusComponent";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import AssemblyPoBatches from "../AssemblyPoBatches/AssemblyPoBatches";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";

const ViewAssemblyTable = () => {
  const { allAssemblyPO, loading, error } = useSelector(
    (state) => state.assemblyPO
  );
  const [openIndex, setOpenIndex] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);

  const sortedMaterials = allAssemblyPO.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedMaterials);

  const [filter, setFilter] = useState("allMaterials");
  const [searchText, setSearchText] = useState("");


  const currentDateAndFileName = `View_Assembly_PO_${moment().format(
    "DD-MMM-YYYY"
  )}`;

  const applyFilters = () => {
    let data = allAssemblyPO;

    if (filter !== "allAssemblyPO") {
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
  }, [filter, allAssemblyPO, searchText]);

  const filterOptions = [
    { value: "allAssemblyPO", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "fulfilled", label: "Fulfilled" },
  ];

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
  }, [sortedMaterials]);


  const searchKeys = [
    "raw_material_id",
    "quantity",
    "createdBy",
    "fulfilledBy",
    "createdAt",
    "status",
  ];

  const headings = {
    createdAt: {
      label: "Created On",
      renderCell: (row) =>
        moment(row?.createdAt).format("DD MMM YYYY") || "N/A",
      isSticky: false,
    },
    status: {
      label: "Status",
      renderCell: (row) => <StatusComponent status={row?.status} /> || "N/A",
      isSticky: false,
    },
    material_name: {
      label: "Raw Material",
      renderCell: (row) => row?.raw_material_id?.material_name || "N/A",
      isSticky: false,
    },
    quantity: {
      label: "Qty",
      renderCell: (row) => row?.quantity || "N/A",
      isSticky: false,
    },
    created_by: {
      label: "Raised By",
      renderCell: (row) =>
        `${row?.createdBy?.firstName} ${row?.createdBy?.lastName}` || "N/A",
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
        <ActionDropdown
          po={row}
          actions={generatePOActions(row)}
        />
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
    ]
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
        filter={filter}
        setFilter={setFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={sortedMaterials}
        filterOptions={filterOptions}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {sidebarType === "viewBatches" && (
          <AssemblyPoBatches
            po={selectedPo}
            handleCancel={closeSidebar} 
          />
        )}
      </RightSidebar>
    </>
  );
};

export default ViewAssemblyTable;
