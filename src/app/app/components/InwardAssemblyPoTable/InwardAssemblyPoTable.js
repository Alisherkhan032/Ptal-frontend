"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import SearchBar from "../SearchBar/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import OutwardForm from "../OutwardAssemblyPoForm/OutwardAssemblyPoForm";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import StatusComponent from "../StatusComponent/StatusComponent";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import { filterByDate } from "@/app/components/DateFilter/DateFilter";
import searchNested from "@/app/utils/searchUtils";

const InwardAssemblyPoTable = () => {
  const { allAssemblyPO, loading, error } = useSelector(
    (state) => state.assemblyPO
  );

  console.log("allAssemblyPO====", allAssemblyPO);

  const { allBatches } = useSelector((state) => state.batch);
  const dropDownBatchNumber = useSelector((state) => state.dropdown);

  const [searchText, setSearchText] = useState("");
  const [isInwardSidebarOpen, setIsInwardSidebarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("allPo");
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);
  const [outwardPoId, setOutwardPoId] = useState(null); // New state to track the PO for inward
  const [dayFilter, setDayFilter] = useState("all");

  const [formData, setFormData] = useState({
    batchNumber: null,
    quantity: null,
  });
  const [formDisabled, setFormDisabled] = useState(false); // State to disable form interactions
  const [errors, setErrors] = useState({
    batchNumber: "",
    quantity: "",
    totalQuantity: "",
    batchQuantity: "",
  });
  const currentDateAndFileName = `Outward_Assembly_PO_${moment().format(
    "DD-MMM-YYYY"
  )}`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    const numericValue = value === "" ? null : Number(value); // Convert value to a number

    setFormData({
      ...formData,
      [name]: numericValue,
    });

    setErrors({
      ...errors,
      [name]: "",
      quantity: "",
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      batchNumber: dropDownBatchNumber,
    });
  }, [dropDownBatchNumber]);

  const sortedMaterials = allAssemblyPO.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedMaterials);

  const applyFilters = () => {
    let data = allAssemblyPO;

    if (filter !== "allPo") {
      data = data.filter((item) => item.status === filter);
    }

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
  }, [allAssemblyPO, searchText, filter, dayFilter]);

  const convertToCSV = (data) => {
    const headers = [
      "RAW MATERIAL NAME",
      "QUANTITY",
      "RAISED BY",
      "CREATED AT",
    ];

    const rows = data.map((po) => [
      po?.raw_material_id?.material_name,
      po?.quantity,
      `${po?.createdBy?.firstName} ${po?.createdBy?.lastName}`,
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

  const filterOptions = [
    { value: "allPo", label: "All POs" },
    { value: "pending", label: "Pending" },
    { value: "fulfilled", label: "Fulfilled" },
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
    vendor_name: {
      label: "Vendor Name",
      renderCell: (row) =>
        `${row?.createdBy?.firstName} ${row?.createdBy?.lastName}` || "N/A",
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
        label: "Outward",
        condition: (po) => po.status !== "fulfilled",
        action: () => openSidebar("outward", po),
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

  const searchKeys = [
    "raw_material_id",
    "quantity",
    "createdBy",
    "createdAt",
    "status",
  ];
  const handleDayFilterChange = (event) => {
    setDayFilter(event.target.value);
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
        dayFilter={dayFilter}
        handleDayFilterChange={handleDayFilterChange}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {sidebarType === "outward" && (
          <OutwardForm poId={selectedPo?._id} handleCancel={closeSidebar} />
        )}
      </RightSidebar>
    </>
  );
};

export default InwardAssemblyPoTable;
