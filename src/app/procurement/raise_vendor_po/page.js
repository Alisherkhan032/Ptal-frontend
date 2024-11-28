"use client";
import React, { useState, useEffect } from "react";
import RaiseStoragePOTable from "../../components/RaiseStoragePOTable/RaiseStoragePOTable";
import { poServices } from "../../services/poService";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPoRequest,
  getAllPoSuccess,
  getAllPoFailure,
} from "../../Actions/poActions";
import StatusBar from "@/app/components/StatusBar/StatusBar";
import PageTitle from "@/app/components/PageTitle/PageTitle";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import { useRouter } from "next/navigation";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [statusBarData, setStatusBarData] = useState([
    { value: 0, heading: "Pending PO's" },
    { value: 0, heading: "Items with Over Stock" },
    { value: 0, heading: "Items with Under Stock" },
  ]);

  // Fetch PO data
  const getAllPos = async () => {
    try {
      dispatch(getAllPoRequest());
      const response = await poServices.getAllPo();

      // console.log("🚀🚀🚀",response);
      if (response.success === true) {
        dispatch(getAllPoSuccess(response.data));

        const poData = response.data;
         // Initialize counters
         let pendingCount = 0;
         let underStockCount = 0;
         let overStockCount = 0;

         poData.forEach((po) => {
          const quantity = po.raw_material_id.current_stock;
          const lowerThreshold = po.raw_material_id.lower_threshold;
          const upperThreshold = po.raw_material_id.upper_threshold;

          // Count pending POs
          if (po.status == "pending") {
            pendingCount++;
          }

          // Count under stock
          if (quantity < lowerThreshold) {
            underStockCount++;
          }

          // Count over stock
          if (quantity > upperThreshold) {
            overStockCount++;
          }
        });

        setStatusBarData([
          { value: pendingCount, heading: "Pending PO's" },
          { value: overStockCount, heading: "Items with Over Stock" },
          { value: underStockCount, heading: "Items with Under Stock" },
        ]);

      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllPos();
  }, []);

 
  // button actions and styling of title bar
  const buttons = [
    {
      label: "Raise Vendor PO",
      action: () => router.push("/procurement/raise_po_form"), // Handle redirection
      className: "bg-[#2D68F8] text-white ", // Custom button styling
    },
  ];

  return (
    <div className="flex flex-col items-center bg-[#f9fafc] w-full h-full px-4 py-2">
      {/* Page Title */}
      <div className="w-full max-w-full mb-4">
        {/* <PageTitle pageTitle={"Raise Vendor PO"} /> */}
        <TitleBar title="Procurement" buttons={buttons} />
      </div>

      {/* Status Bar */}
      <div className="w-full max-w-full mb-6">
        <StatusBar data={statusBarData} />
      </div>

      {/* Table */}
      <div className="w-full max-w-full flex-1 scrollbar-none overflow-y-auto bg-white rounded-lg shadow-lg">
        <RaiseStoragePOTable />
      </div>
    </div>
  );
};

export default Page;
