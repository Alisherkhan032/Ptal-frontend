"use client";
import React, { useState, useEffect } from "react";
import { fetchBlockedAmounts } from "@/app/services/blockedAmountService";
import DynamicTable from "../DynamicTable/DynamicTable";

const Page = () => {
  const [blockedAmounts, setBlockedAmounts] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAmount = async () => {
    const data = await fetchBlockedAmounts();
    setLoading(false);
    console.log("💕💕", data);
    setBlockedAmounts(data);

    const rows = data.storageDetails.map((product) => ({
      item_name: product.productName,
      sku_code: product.skuCode,
      current_stock: product.stockCount,
      min_of_Cogs: product.minOfCogs,
      blocked_Amount: (product.stockCount * product.minOfCogs).toFixed(2),
    }));

    setRowsData(rows);
  };
  useEffect(() => {
    fetchAmount();
  }, []);

  const headings = [
    "item_name",
    "sku_code",
    "current_stock",
    "min_of_Cogs",
    "blocked_Amount",
  ];

  return (
    <div className="relative overflow-x-auto mr-[1vw] sm:rounded-lg">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-gray-800 text-center mt-4">
            Total Amount Blocked:  ₹ {blockedAmounts.storageInventorySum}
          </h2>

          <DynamicTable headings={headings} rows={rowsData} />
        </>
      )}
    </div>
  );
};

export default Page;
