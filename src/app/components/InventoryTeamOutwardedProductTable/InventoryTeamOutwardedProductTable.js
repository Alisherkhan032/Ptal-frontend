"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { transactionService } from '@/app/services/transactionService';
import DynamicTable from "../DynamicTable/DynamicTable";

const InventoryTeamOutwardedProductTable = () => {
  const searchParams = useSearchParams();
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const team = searchParams.get("team");

  const [outwardProducts, setOutwardProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRawProducts = async () => {
      const response = await transactionService.getTransactions(fromDate, toDate, team);
      if (response.success) {
        setLoading(false);
        console.log("🙌transaction object", response.data);

        // Filter raw products based on category

        let filteredProduct = response.data.filter(
          (item) => item.transactionType== "outward"
        );

        console.log("Filtered out inventory Products", filteredProduct);

        // Map filtered data to an array of objects with keys matching the headings
        const rows = filteredProduct.map(product => ({
          Product_name: product?.product?.product_name,       
          sku_code: product?.product?.sku_code,            
          Outward_quantity: product?.quantity,                        
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

        setOutwardProducts(rows);
      }
    };

    fetchRawProducts();
  }, [fromDate, toDate, team]);

  const headings = [
    "Product_name",
    "category_name",
    "sku_code",
    "Outward_quantity",
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
          <DynamicTable headings={headings} rows={outwardProducts} fromDate={fromDate} toDate={toDate} />
        </>
      )}
    </div>
  );
};

export default InventoryTeamOutwardedProductTable;
