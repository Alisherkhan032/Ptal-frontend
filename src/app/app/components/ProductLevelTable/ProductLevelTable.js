'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import PoFilterBar from '../PoFilterBar/PoFilterBar';
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import { filterByDate } from '@/app/components/DateFilter/DateFilter';
import searchNested from '@/app/utils/searchUtils';

const ProductLevelTable = () => {
  const { allProducts } = useSelector((state) => state.product);
    
  const sortedMaterials = allProducts.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  console.log("🚀 ~ ProductLevelTable ~ sortedMaterials:", sortedMaterials.length)
  console.log("🚀 ~ ProductLevelTable :", sortedMaterials)
  const [filteredData, setFilteredData] = useState(sortedMaterials);
  const [searchText, setSearchText] = useState("");
  const [dayFilter, setDayFilter] = useState("all");

  const applyFilters = () => {
      let data = allProducts;

      data = data.filter((item) =>
        searchKeys.some((key) =>
          searchNested(item[key], searchText.toLowerCase(), key)
        )
      );

      data = filterByDate(data, dayFilter);

      setFilteredData(data);
    };
  
    useEffect(() => {
      applyFilters();
    }, [ allProducts, searchText, dayFilter]);

  const currentDateAndFileName = `Product_Inventory_level_${moment().format(
    'DD-MMM-YYYY'
  )}`;

  const router = useRouter();
  const dispatch = useDispatch();

  const convertToCSV = (data) => {
    const headers = ['PRODUCT NAME', 'PRODUCT SKU CODE' ,'CATEGORY', 'CURRENT STOCK','LOWER THRESHOLD','UPPER THRESHOLD'];

    const rows = data.map((product) => [
      product?.product_name,
      product?.sku_code,
      product?.product_category_id?.category_name,
      product?.current_stock,
      product?.lower_threshold,
      product?.upper_threshold,
    ]);

    const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((row) => row.map((field) => {
      // Convert the field to a string and then replace double quotes with two double quotes
      const fieldString = String(field);
      return `"${fieldString.replace(/"/g, '""')}"`;
    }).join(','))].join('\n');
  

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setFilteredData(sortedMaterials);
  }, [sortedMaterials]);

  const searchKeys = ['product_name', 'product_category_id', 'current_stock', 'lower_threshold', 'upper_threshold', 'sku_code'];

  const headings = {
    
    sku_code: {
      label: "SKU Code",
      renderCell: (row) => row?.sku_code || "N/A",
      isSticky: false,
    },
    category_name: {
      label: "Category",
      renderCell: (row) => row?.product_category_id?.category_name || "N/A",
      isSticky: false,
    },
    current_stock: {
      label: "Current Stock",
      renderCell: (row) => row?.current_stock || "N/A",
      isSticky: false,
    },
    product_name: {
      label: "Product Name",
      renderCell: (row) => row?.product_name || "N/A",
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
        allPO={sortedMaterials}
        dayFilter={dayFilter}
        handleDayFilterChange={handleDayFilterChange}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />
    </>
  );
};

export default ProductLevelTable;
