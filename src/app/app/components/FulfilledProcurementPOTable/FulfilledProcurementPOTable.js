'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../SearchBar/SearchBar';
import moment from 'moment';
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import DynamicTableWithoutAction from "../DynamicTableWithoutAction/DynamicTableWithoutAction";
import StatusComponent from '../StatusComponent/StatusComponent';
import { filterByDate } from '@/app/components/DateFilter/DateFilter';
import searchNested from '@/app/utils/searchUtils';

const FulfilledProcurementPOTable = () => {
  const { allPO, loading, error } = useSelector((state) => state.po);
 
  const sortedMaterials = allPO
  .filter((po) => po.status === 'fulfilled') // Only include POs where status is 'fulfilled'
  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const [filteredData, setFilteredData] = useState(sortedMaterials);
  // const [dayFilter, setDayFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [dayFilter, setDayFilter] = useState("all");

  const applyFilters = () => {
    let data = allPO;

    data = filterByDate(data, dayFilter);

    data = data.filter((item) =>
      searchKeys.some((key) =>
        searchNested(item[key], searchText.toLowerCase(), key)
      )
    );

    data = data.filter((po) => po.status === 'fulfilled') // Only include POs where status is 'fulfilled'
    setFilteredData(data);
  };

  useEffect(() => {
    applyFilters();
  }, [ allPO, searchText, dayFilter]);

  const currentDateAndFileName = `Inward_Procurement_PO_${moment().format(
    'DD-MMM-YYYY'
  )}`;

  const convertToCSV = (data) => {
    const headers = [
      'CREATED AT',
      'VENDOR NAME',
      'PO NUMBER',
      'QUANTITY',
      'RAW MATERIAL NAME',
      'GRN',
      'RAISED BY',
    ];

    const rows = data.map((po) => [
      moment(po?.createdAt).format('DD MMM YYYY'),
      po?.vendor_id?.vendor_name,
      po?.po_number,
      po?.quantity,
      po?.raw_material_id?.material_name,
      po?.grn_number,
      `${po?.created_by?.firstName} ${po?.created_by?.lastName}`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const searchKeys = [
    'vendor_id',
    'po_number',
    'quantity',
    'raw_material_id',
    'grn_number',
    'quantity',
  ];

  const headings = {
    "created_at": {
      label: "Created At",
      renderCell: (row) =>
        row?.createdAt
      ? moment(row.createdAt).format("DD MMM YYYY")
      : "N/A", 
      isSticky: false
    },
    "status": {
        label: "Status",
        renderCell: (row) => <StatusComponent status={row?.status} /> || "N/A", 
        isSticky: false
    },
    "material_name": {
      label: "Material Name",
      renderCell: (row) => row?.raw_material_id?.material_name || "N/A",
      isSticky: false
    },
    "fulfilled_at": {
      label: "Fulfilled At",
      renderCell: (row) =>
        row?.updatedAt
          ? moment(row.updatedAt).format("DD MMM YYYY") 
          : "N/A", 
      isSticky: false
    },
    "vendor_name": {
      label: "Vendor Name",
      renderCell: (row) => row?.vendor_id?.vendor_name || "N/A", 
      isSticky: false
    },
    "po_number": {
      label: "PO Number",
      renderCell: (row) => row?.po_number || "N/A", 
      isSticky: false
    },
    "bill_number": {
      label: "Bill Number",
      renderCell: (row) => row?.bill_number || "N/A", 
      isSticky: false
    },
    "quantity": {
      label: "Quantity",
      renderCell: (row) => row?.quantity || "N/A", 
      isSticky: false
    },
    "grn": {
      label: "GRN",
      renderCell: (row) => row?.grn_number || "N/A", 
      isSticky: false
    },
    "raised_by": {
      label: "Raised By",
      renderCell: (row) =>
        row?.created_by
          ? `${row?.created_by?.firstName} ${row?.created_by?.lastName}` 
          : "N/A", 
      isSticky: false
    }
  };

  const handleDayFilterChange = (event) => {
    setDayFilter(event.target.value);
  };


  return (
    <>
      <PoFilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={allPO}
        dayFilter={dayFilter}
        handleDayFilterChange={handleDayFilterChange}
      />

      <div className="relative scrollbar-none overflow-x-auto sm:rounded-lg">
        <DynamicTableWithoutAction headings={headings} rows={filteredData} />
      </div>
    </>
  );
};

export default FulfilledProcurementPOTable;
