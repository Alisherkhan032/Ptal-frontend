import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import DynamicTableWithoutAction from "../DynamicTableWithoutAction/DynamicTableWithoutAction";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import { convertToCSV } from  '@/app/utils/csvUtils';
import StatusComponent from "../StatusComponent/StatusComponent";

const RaiseStoragePOTable = () => {
  const { allPO, loading, error } = useSelector((state) => state.po);

  console.log('allPO====', allPO);

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
  }, [filter, dayFilter, allPO]);

  const currentDateAndFileName = `Raise_Vendor_PO_${moment().format(
    "DD-MMM-YYYY"
  )}`;

  const handleCSVDownload  = (data) => {
    const headers = [
      "RAW MATERIAL NAME",
      "GRN",
      "PO NUMBER",
      "VENDOR NAME",
      "QUANTITY",
      "RAISED BY",
      "CREATED AT",
    ];

    const rowMapper = (po) => [
      po.material_name,
      po.grn,
      po.po_number,
      po.vendor_name,
      po.quantity,
      po.raised_by,
      po.created_at,
    ];

    convertToCSV(rowData, headers, rowMapper, "Raise_Vendor_PO");
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

  const headings  = {
    "created_at": {
      label: "Created At",
      renderCell : (row) => row?.createdAt ? moment(row?.createdAt).format("DD MMM YYYY") : "N/A",
      isSticky: false
    },
    "status": {
      label: "Status",
      renderCell: (row) => <StatusComponent status={row?.status} />,
      isSticky: false
    },
    "material_name": {
      label: "Material Name",
      renderCell : (row) => row?.raw_material_id?.material_name,
      isSticky: false
    },
    "po_number": {
      label: "PO Number",
      renderCell : (row) => row?.po_number,
      isSticky: false
    },
    "grn": {
      label: "GRN",
      renderCell : (row) => row?.grn_number,
      isSticky: false
    },
    quantity: {
      label: "Quantity",
      renderCell : (row) => row?.quantity,
      isSticky: false
    },
    vendor_name: {
      label: "Vendor Name",
      renderCell : (row) => row?.vendor_id?.vendor_name,
      isSticky: false
    },
    bill_number: {
      label: "Bill Number",
      renderCell : (row) => row?.bill_number,
      isSticky: false
    },
    raised_by: {
      label: "Raised By",
      renderCell : (row) => `${row?.created_by?.firstName} ${row?.created_by?.lastName}`,
      isSticky: false
    }

  }

  const filterOptions = [
    { value: 'allPo', label: 'All POs' },
    { value: 'pending', label: 'Pending' },
    { value: 'fulfilled', label: 'Fulfilled' },
    // { value: 'qc_info_added', label: 'Qc Info Added' },
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
        convertToCSV={handleCSVDownload}
        dayFilter={dayFilter}
        handleDayFilterChange={handleDayFilterChange}
        allPO={allPO}
        filterOptions = {filterOptions}
      />

      <div className="relative scrollbar-none overflow-x-auto sm:rounded-lg">
        <DynamicTableWithoutAction headings={headings} rows={filteredData} />
      </div>
    </>
  );
};

export default RaiseStoragePOTable;
