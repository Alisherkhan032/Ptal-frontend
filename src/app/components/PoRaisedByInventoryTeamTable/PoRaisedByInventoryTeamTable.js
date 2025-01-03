"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  getAllBatchRequest,
  getAllBatchSuccess,
} from "../../Actions/batchActions";
import DynamicTableWithoutAction from "../DynamicTableWithoutAction/DynamicTableWithoutAction";
import { batchServices } from "@/app/services/batchService";
import StatusComponent from "../StatusComponent/StatusComponent";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import { filterByDate } from "../DateFilter/DateFilter";
import searchNested from "@/app/utils/searchUtils";

const PoRaisedByInventoryTeamTable = () => {
  const { allInventoryPO, loading, error } = useSelector(
    (state) => state.inventoryPo
  );
  // console.log("allInventoryPO====", allInventoryPO);
  const [filter, setFilter] = useState("allPo");
  const [searchText, setSearchText] = useState("");
  const [dayFilter, setDayFilter] = useState("all");
  const { selectedRawMaterialId } = useSelector((state) => state.batch);
  const { dropDownBatchNumber } = useSelector((state) => state.dropdown);
  const [formData, setFormData] = useState({
    batchNumber: null,
    quantity: null,
  });

  const dispatch = useDispatch();

  const applyFilters = () => {
    let data = allInventoryPO;

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
  }, [filter, searchText, dayFilter, allInventoryPO]);

  useEffect(() => {
    setFormData({
      ...formData,
      batchNumber: dropDownBatchNumber,
    });
  }, [dropDownBatchNumber]);

  const sortedMaterials = allInventoryPO.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedMaterials);

  const currentDateAndFileName = `Raise_Inventory_PO_${moment().format(
    "DD-MMM-YYYY"
  )}`;

  const convertToCSV = (data) => {
    const headers = [
      "PRODUCT NAME",
      "PRODUCT SKU CODE",
      "QUANTITY",
      "RAISED BY",
      "FULFILLED BY",
      "CREATED AT",
    ];

    const rows = data.map((po) => [
      po?.product_id?.product_name,
      po?.product_id?.sku_code,
      po?.quantity,
      `${po?.createdBy?.firstName} ${po?.createdBy?.lastName}`,
      `${po?.fulfilledBy?.firstName} ${po?.fulfilledBy?.lastName}`,
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

  const getAllBatches = async () => {
    try {
      dispatch(getAllBatchRequest());
      const response = await batchServices.getAllBatches(selectedRawMaterialId);
      if (response.success === true) {
        dispatch(getAllBatchSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllBatches();
  }, [selectedRawMaterialId]);

  useEffect(() => {
    setFilteredData(sortedMaterials);
  }, [sortedMaterials]);

  const searchKeys = [
    "product_id",
    "Quantity",
    "createdBy",
    "fulfilledBy",
    "createdAt",
    "status",
  ];

  const headings = {
    createdAt: {
      label: "Created On",
      renderCell: (row) =>
        row?.createdAt ? moment(row.createdAt).format("DD MMM YYYY") : "N/A",
      isSticky: false,
    },
    product_name: {
      label: "Product Name",
      renderCell: (row) => row?.product_id?.product_name || "N/A",
      isSticky: false,
    },
    status: {
      label: "Status",
      renderCell: (row) => <StatusComponent status={row?.status} /> || "N/A",
      isSticky: false,
    },
    quantity: {
      label: "Quantity",
      renderCell: (row) => row?.quantity || "N/A",
      isSticky: false,
    },
    sku_code: {
      label: "SKU Code",
      renderCell: (row) => row?.product_id?.sku_code || "N/A",
      isSticky: false,
    },
    created_by: {
      label: "Raised By",
      renderCell: (row) =>
        row?.created_by?.firstName || row?.created_by?.lastName
          ? `${row?.created_by?.firstName} ${row?.created_by?.lastName}`
          : "N/A",
      isSticky: false,
    },
    fulfilledBy: {
      label: "Fulfilled By",
      renderCell: (row) =>
        row?.fulfilledBy?.firstName || row?.fulfilledBy?.lastName
          ? `${row?.fulfilledBy?.firstName || ""} ${
              row?.fulfilledBy?.lastName || ""
            }`.trim()
          : "N/A",
      isSticky: false,
    },
  };

  const filterOptions = [
    { value: "allPo", label: "All POs" },
    { value: "fulfilled", label: "fulfilled" },
    { value: "pending", label: "pending" },
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
        allPO={allInventoryPO}
        filterOptions={filterOptions}
        dayFilter={dayFilter}
        handleDayFilterChange={handleDayFilterChange}
      />

      <DynamicTableWithoutAction headings={headings} rows={filteredData} />
    </>
  );
};

export default PoRaisedByInventoryTeamTable;
