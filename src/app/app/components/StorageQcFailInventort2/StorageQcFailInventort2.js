"use client";
import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import { useSelector } from "react-redux";
import SearchBar from "../SearchBar/SearchBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import CollapsableDynamicTable from "@/app/components/CollapsableDynamicTable/CollapsableDynamicTable";
import PoFilterBarWithDatePicker from "../PoFIlterBarWithDatePicker/PoFIlterBarWithDatePicker";

const StorageQcFailInventory = () => {
  const { allPO } = useSelector((state) => state.po);

  const [startDate, setStartDate] = useState(
    moment().subtract(30, "days").toDate()
  );

  const [searchText, setSearchText] = useState("");
  const isSearchBarVisible = false;

  const applyFilters = () => {
    let data = allPO;

    data = data.filter((item) =>
      searchKeys.some((key) =>
        searchNested(item[key], searchText.toLowerCase(), key)
      )
    );

    data = data
      .filter(
        (po) =>
          (po.status === "fulfilled" || po.status === "qc_info_added") &&
          po.qcData?.failedQcInfo > 0
      )
      .filter((po) => {
        const poDate = moment(po.updatedAt);
        return poDate.isBetween(moment(startDate), moment(endDate), null, "[]");
      });

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
  }, [allPO, searchText]);

  const [endDate, setEndDate] = useState(new Date());
  const [expandedItems, setExpandedItems] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const currentDateAndFileName = `Storage_QC_Failed_Inventory_${moment().format(
    "DD-MMM-YYYY"
  )}`;

  // Process and group the data whenever dependencies change
  useEffect(() => {
    const processData = () => {
      const dateFilteredData = allPO
        .filter(
          (po) =>
            (po.status === "fulfilled" || po.status === "qc_info_added") &&
            po.qcData?.failedQcInfo > 0
        )
        .filter((po) => {
          const poDate = moment(po.updatedAt);
          return poDate.isBetween(
            moment(startDate),
            moment(endDate),
            null,
            "[]"
          );
        });

      // Group by raw material name
      const grouped = dateFilteredData.reduce((acc, po) => {
        const materialName = po.raw_material_id.material_name;
        if (!acc[materialName]) {
          acc[materialName] = {
            materialName,
            totalFailedQcQuantity: 0,
            items: [],
          };
        }
        acc[materialName].totalFailedQcQuantity += po.qcData.failedQcInfo;
        acc[materialName].items.push(po);
        return acc;
      }, {});

      return Object.values(grouped);
    };

    const groupedData = processData();
    setFilteredData(groupedData);
    setCurrentPage(1);
  }, [allPO, startDate, endDate]);

  // Calculate paginated records
  const records = (() => {
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    return filteredData.slice(firstIndex, lastIndex);
  })();

  const npage = Math.ceil(filteredData.length / recordsPerPage);

  const toggleExpand = (materialName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [materialName]: !prev[materialName],
    }));
  };

  const handleSearch = (data) => {
    setFilteredData(data);
    setCurrentPage(1);
  };

  const convertToCSV = () => {
    const headers = [
      "RAW MATERIAL NAME",
      "TOTAL QC-FAILED QUANTITY",
      "VENDOR NAME",
      "PO NUMBER",
      "BILL NUMBER",
      "QC-FAILED QUANTITY",
    ];

    const rows = filteredData.flatMap((group) =>
      group.items.map((item) => [
        group.materialName,
        group.totalFailedQcQuantity,
        item.vendor_id?.vendor_name,
        item.po_number,
        item.bill_number,
        item.qcData.failedQcInfo,
      ])
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", currentDateAndFileName + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const chageCPage = (id) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const searchKeys = ["material_name", "totalFailedQcQuantity"];

  const headings = {
    material_name: {
      label: "Material Name",
      renderCell: (row) => row?.materialName || "N/A",
    },
    totalFailedQcQuantity: {
      label: "Total QC-FAILED Quantity",
      renderCell: (row) => row?.totalFailedQcQuantity || "N/A",
    },
  };

  const expandedColumns = [
    {
      label: "Vendor Name",
      renderCell: (row) => row.vendor_id?.vendor_name || "N/A",
    },
    {
      label: "PO Number",
      renderCell: (row) => row.po_number || "N/A",
    },
    {
      label: "Bill Number",
      renderCell: (row) => row.bill_number || "N/A",
    },
    {
      label: "QC-Failed Quantity",
      renderCell: (row) => row.qcData.failedQcInfo || "N/A",
    },
    {
      label: "Comments",
      renderCell: (row) => row.qcData.comment || "N/A",
    },
  ];

  return (
    <>
      <PoFilterBarWithDatePicker
        isSearchBarVisible={isSearchBarVisible}
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={allPO}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <div className="relative scrollbar-none overflow-x-auto sm:rounded-lg">
        <CollapsableDynamicTable
          headings={headings}
          expandedColumns={expandedColumns}
          data={records}
          onToggleExpand={toggleExpand}
          expandedItems={expandedItems}
        />
      </div>
    </>
  );
};

export default StorageQcFailInventory;
