'use client';
import React, { useState, useEffect } from 'react';
import InwardProcurementPOTable from '@/app/components/InwardProcurementPOTable/InwardProcurementPOTable';
import StatusBar from "@/app/components/StatusBar/StatusBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import { usePoData } from "@/app/hooks/usePoData";
import NavigationBar from '@/app/components/NavigationBar/NavigationBar';
import { items } from '@/app/utils/sidebarItems';

const Page = () => {  

  const poData = usePoData();

  const calculateStatusBarData = (poData) => {
    let pendingCount = 0;
    let fulfilledCount = 0;
    let qcInfoAddedCount = 0;
    let underStockCount = 0;
    let overStockCount = 0;

    poData.forEach((po) => {
      const { current_stock, lower_threshold, upper_threshold } = po.raw_material_id;
      if (po.status === "pending") pendingCount++;
      if (po.status === "fulfilled") fulfilledCount++;
      if (po.status === "qc_info_added") qcInfoAddedCount++;
      if (current_stock < lower_threshold) underStockCount++;
      if (current_stock > upper_threshold) overStockCount++;
    });

    return [
      { value: pendingCount, heading: "Pending PO's" },
      { value: fulfilledCount, heading: "Fulfilled PO's" },
      { value: qcInfoAddedCount, heading: "QC Info Added PO's" },
      { value: overStockCount, heading: "Items with Over Stock" },
      { value: underStockCount, heading: "Items with Under Stock" },
    ];
  };

  const statusBarData = calculateStatusBarData(poData);

  const generateNavItems = () => {
    
    const storageTeam = items.find(item => item.label === "Storage");
  
    if (storageTeam && storageTeam.subItems) {
      return storageTeam.subItems.map(subItem => ({
        name: subItem.label,
        path: subItem.path,
        icon: subItem.iconKey,
      }));
    }
  
    return [];
  };
  
  const navItems = generateNavItems();

  return (
    <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
      <div className="relative z-10 flex flex-col items-center overflow-scroll scrollbar-none px-4 py-2">
        <div className="w-full max-w-full mb-4">
          <TitleBar title="Storage"  />
        </div>

        <div className="w-full max-w-full mb-5">
          <StatusBar data={statusBarData} />
        </div>

        <div className='w-full max-w-full mb-5'>
        <NavigationBar navItems={navItems} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <InwardProcurementPOTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
