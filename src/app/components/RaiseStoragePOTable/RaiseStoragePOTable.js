import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import DynamicTableWithoutAction from "../DynamicTableWithoutAction/DynamicTableWithoutAction";
import PoFilterBar from "../PoFilterBar/PoFilterBar";

const RaiseStoragePOTable = () => {
  const { allPO, loading, error } = useSelector((state) => state.po);

  // State for filter type
  const [filter, setFilter] = useState("allPo");
  const [filteredData, setFilteredData] = useState(allPO);
  const [dayFilter, setDayFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const applyFilters = () => {
    let data = allPO;

    if (filter !== "allPo") {
      data = data.filter((item) => item.status === filter);
    }

    if (dayFilter !== "all") {
      const now = moment();
      data = data.filter((item) => {
        const itemDate = moment(item.createdAt);
        switch (dayFilter) {
          case "7days":
            return itemDate.isAfter(now.clone().subtract(7, "days"));
          case "14days":
            return itemDate.isAfter(now.clone().subtract(14, "days"));
          case "30days":
            return itemDate.isAfter(now.clone().subtract(30, "days"));
          default:
            return true;
        }
      });
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
  }, [filter, dayFilter, allPO, filteredData]);

  const currentDateAndFileName = `Raise_Vendor_PO_${moment().format(
    "DD-MMM-YYYY"
  )}`;

  const handleSearch = (data) => {
    setFilteredData(data);
  };

  const convertToCSV = (data) => {
    const headers = [
      "RAW MATERIAL NAME",
      "GRN",
      "PO NUMBER",
      "VENDOR NAME",
      "QUANTITY",
      "RAISED BY",
      "CREATED AT",
    ];

    const rows = data.map((po) => [
      po?.raw_material_id?.material_name,
      po?.grn_number,
      po?.po_number,
      po?.vendor_id?.vendor_name,
      po?.quantity,
      `${po?.created_by?.firstName} ${po?.created_by?.lastName}`,
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

  const searchKeys = [
    "grn_number",
    "created_by",
    "vendor_id",
    "raw_material_id",
    "po_number",
    "quantity",
    "status",
  ];

  const headings = [
    "created_at",
    "material_name",
    "status",
    "po_number",
    "grn",
    "quantity",
    "vendor_name",
    "bill_number",
    "raised_by",
  ];

  const rowData = filteredData.map((po) => ({
    material_name: po?.raw_material_id?.material_name,
    grn: po?.grn_number,
    po_number: po?.po_number,
    vendor_name: po?.vendor_id?.vendor_name,
    bill_number: po?.bill_number,
    quantity: po?.raw_material_id?.current_stock,
    raised_by: `${po?.created_by?.firstName} ${po?.created_by?.lastName}`,
    created_at: new Date(po?.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: po?.status,
  }));

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
        dayFilter={dayFilter}
        handleDayFilterChange={handleDayFilterChange}
        allPO={allPO}
      />

      <div className="relative scrollbar-none overflow-x-auto sm:rounded-lg">
        <DynamicTableWithoutAction headings={headings} rows={rowData} />
      </div>
    </>
  );
};

export default RaiseStoragePOTable;
