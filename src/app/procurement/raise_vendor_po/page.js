  "use client";
  import React, { useState } from "react";
  import RaiseStoragePOTable from "../../components/RaiseStoragePOTable/RaiseStoragePOTable";
  import StatusBar from "@/app/components/StatusBar/StatusBar";
  import TitleBar from "@/app/components/TitleBar/TitleBar";
  import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
  import RaisePoFormComponent from '@/app/components/RaisePoFormComponent/RaisePoFormComponent'
  import { usePoData } from "@/app/hooks/usePoData";
  import { PrimaryButton } from "@/app/components/ButtonComponent/ButtonComponent";

  const Page = () => {  
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const poData = usePoData();

    const calculateStatusBarData = (poData) => {
      let pendingCount = 0;
      let underStockCount = 0;
      let overStockCount = 0;

      poData.forEach((po) => {
        const { current_stock, lower_threshold, upper_threshold } = po.raw_material_id;
        if (po.status === "pending") pendingCount++;
        if (current_stock < lower_threshold) underStockCount++;
        if (current_stock > upper_threshold) overStockCount++;
      });

      return [
        { value: pendingCount, heading: "Pending PO's" },
        { value: overStockCount, heading: "Items with Over Stock" },
        { value: underStockCount, heading: "Items with Under Stock" },
      ];
    };

    const statusBarData = calculateStatusBarData(poData);

    const buttons = [
      <PrimaryButton
        title="Raise Vendor PO"
        onClick={() => setIsSidebarOpen(true)}
        width="w-auto"
        bgColor = 'bg-primary'
      >
        Raise Vendor PO
      </PrimaryButton>,
    ];

    return (
      <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
        <div className="relative z-10 flex flex-col items-center overflow-scroll scrollbar-none px-4 py-2">
          <div className="w-full max-w-full mb-4">
            <TitleBar title="Procurement" buttons={buttons} />
          </div>

          <div className="w-full max-w-full mb-5">
            <StatusBar data={statusBarData} />
          </div>

          <div className="flex w-full max-w-full mb-6 scrollbar-none">
            <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
              <RaiseStoragePOTable />
            </div>
          </div>
        </div>

        {/* (Right Sidebar) */}
        <RightSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)} // Close the sidebar
        >
          <RaisePoFormComponent
            onCancel={() => setIsSidebarOpen(false)}
          />

        </RightSidebar>
      </div>
    );
  };

  export default Page;
