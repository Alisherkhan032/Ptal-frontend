"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { transactionService } from '@/app/services/transactionService';
import DynamicTable from "../DynamicTable/DynamicTable";

const InventoryTeamInwardedProductTable = () => {
  const searchParams = useSearchParams();
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const team = searchParams.get("team");

  const [inwardProducts, setInwardProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRawProducts = async () => {
      const response = await transactionService.getTransactions(fromDate, toDate, team);
      if (response.success) {
        setLoading(false);
        console.log("🙌transaction object", response.data);

        // Filter raw products based on category
        let filteredProduct = response.data.filter(
          (item) => item.transactionType== "inward"
        );

        console.log("Filtered inwarded inventory Products", filteredProduct);

        // Map filtered data to an array of objects with keys matching the headings
        const rows = filteredProduct.map(product => ({
          Product_name: product?.product?.product_name,       
          sku_code: product?.product?.sku_code,            
          Inward_quantity: product?.quantity,                        
          current_stock: product?.product?.current_stock,       
          lower_threshold: product?.product?.lower_threshold,   
          upper_threshold: product?.product?.upper_threshold,      
          category_name: product?.product?.
          product_category_id
          ?.category_name, // category_name
          Date: new Date(product?.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        }));

        setInwardProducts(rows);
      }
    };

    fetchRawProducts();
  }, [fromDate, toDate, team]);

  const headings = [
    "Product_name",
    "category_name",
    "sku_code",
    "Inward_quantity",
    "Date",
    "current_stock",
    "lower_threshold",
    "upper_threshold",
  ];

  return (
    <div className="relative overflow-x-auto mr-[1vw] sm:rounded-lg">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <DynamicTable headings={headings} rows={inwardProducts} fromDate={fromDate} toDate={toDate} />
        </>
      )}
    </div>
  );
};

export default InventoryTeamInwardedProductTable;
