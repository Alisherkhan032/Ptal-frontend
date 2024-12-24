"use client";
import React, { useState, useEffect } from "react";
import { rawMaterialServices } from "../../services/rawMaterialService";
import { useDispatch, useSelector } from "react-redux";
import { setRawMaterialIdBatch } from "../../Actions/batchActions";
import { useRouter } from "next/navigation";
import moment from "moment";
import {stickyActionColumnClassname, stickyActionRowClassname } from "@/app/utils/stickyActionClassname";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import DynamicTableWithoutAction from '@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction'
import ActionDropdown from "@/app/components/ActionDropdown/ActionDropdown";

const InventoryLevelTable = () => {
  const { allMaterials } = useSelector((state) => state.material);
  
  const [openIndex, setOpenIndex] = useState(null);

  const [filter, setFilter] = useState("allMaterials");
  // const [dayFilter, setDayFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const sortedMaterials = allMaterials.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedMaterials);

  const applyFilters = () => {
    let data = allMaterials;

    if (filter !== "allMaterials") {
      data = data.filter(
        (item) => item.material_category_id.category_name === filter
      );
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
  }, [filter, allMaterials, searchText]);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setFilteredData(sortedMaterials);
  }, [sortedMaterials]);


  const convertToCSV = (data) => {
    const headers = [
      "MATERIAL NAME",
      "MATERIAL SKU CODE",
      "CATEGORY",
      "CURRENT STOCK",
      "LOWER THRESHOLD",
      "UPPER THRESHOLD",
      "UPDATED AT",
    ];

    const rows = data.map((material) => [
      material?.material_name,
      material?.sku_code,
      material?.material_category_id?.category_name,
      material?.current_stock,
      material?.lower_threshold,
      material?.upper_threshold,
      moment(material?.updatedAt).format("DD MMM YYYY") || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const currentDateAndFileName = `Storage_Inventory_Level_${moment().format(
      "DD-MMM-YYYY"
    )}.csv`;
    link.setAttribute("download", currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const searchKeys = [
    "material_name",
    "sku_code",
    "material_category_id",
    "current_stock",
    "lower_threshold",
    "upper_threshold",
  ];

  const headings = {
    current_stock: {
      label: "Quantity",
      renderCell: (row) => row?.current_stock || "N/A",
      isSticky: false,
    },
    sku_code: {
      label: "Material SKU Code",
      renderCell: (row) => row?.sku_code || "N/A",
      isSticky: false,
    },
    category_name: {
      label: "Category",
      renderCell: (row) => row?.material_category_id?.category_name || "N/A",
      isSticky: false,
    },
    material_name: {
      label: "Material Name",
      renderCell: (row) => row?.material_name || "N/A",
      isSticky: false,
    },
   
    lower_threshold: {
      label: "Lower Threshold",
      renderCell: (row) => row?.lower_threshold || "N/A",
      isSticky: false,
    },
    upper_threshold: {
      label: "Upper Threshold",
      renderCell: (row) => row?.upper_threshold || "N/A",
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
        action: () => {
          dispatch(setRawMaterialIdBatch(po._id));
          router.push("/storage/view_batches");
        }
      },
    ]
  };


  const filterOptions = [
    { value: "allMaterials", label: "All" },
    { value: "Raw Material", label: "Raw Material" },
    { value: "Packaging Material", label: "Packaging Material" },
  ];
  
  const handleActionDropdownChange = (e, material, index) => {
    const selected = e.target.value;  
    if (selected === "viewBatches") {
      dispatch(setRawMaterialIdBatch(material._id));
      router.push("/storage/view_batches");
    }
    setSelectedOption("");
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
    </>
  );
};

export default InventoryLevelTable;
