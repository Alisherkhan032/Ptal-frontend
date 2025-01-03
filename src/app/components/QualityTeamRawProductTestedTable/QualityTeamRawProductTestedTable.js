"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { transactionService } from '@/app/services/transactionService';
import DynamicTable from "../DynamicTable/DynamicTable";

const RawProductTestedTable = () => {
  const searchParams = useSearchParams();
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const team = searchParams.get("team");

  const [rawTestedProducts, setRawTestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Raw Product Tested data
  useEffect(() => {
    const fetchRawTestedProducts = async () => {
      const response = await transactionService.getTransactions(fromDate, toDate, team);
      if (response.success) {
        setLoading(false);
        console.log("Raw Products by transaction", response.data);

        // Filter raw products based on category
        let filteredRaw = response.data.filter(
          (item) => item?.rawMaterial?.material_category_id.category_name === "Raw Material"
        );

        console.log("Filtered Raw Products", filteredRaw);

        // Map filtered data to an array of objects with keys matching the headings
        const rows = filteredRaw.map(product => ({
          material_name: product?.rawMaterial?.material_name,       
          sku_code: product?.rawMaterial?.sku_code,            
          total_tested: product?.quantity,      
          passed_count : product?.passed_quantity,              
          failed_count : product?.failed_quantity,              
          current_stock: product?.rawMaterial?.current_stock,       
          lower_threshold: product?.rawMaterial?.lower_threshold,     
          upper_threshold: product?.rawMaterial?.upper_threshold,     
          category_name: product?.rawMaterial?.material_category_id?.category_name, // category_name
          Date: new Date(product?.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        }));

        setRawTestedProducts(rows);
      }
    };

    fetchRawTestedProducts();
  }, [fromDate, toDate]);

  const headings = [
    "material_name",
    "sku_code",
    "total_tested",
    "passed_count",
    "failed_count",
    "Date",
    "current_stock",
    "lower_threshold",
    "upper_threshold",
    "category_name"
  ];


  return (
    <div className="relative overflow-x-auto mr-[1vw] sm:rounded-lg">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DynamicTable headings={headings} rows={rawTestedProducts}  fromDate={fromDate} toDate={toDate} />
        
      )}
    </div>
  );
}
export default RawProductTestedTable;
