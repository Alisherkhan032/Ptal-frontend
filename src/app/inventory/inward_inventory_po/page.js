"use client";
import React, { useEffect, useState } from "react";
import { assemblyPOServices } from "@/app/services/assemblyPO";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllInventoryPoRequest,
  getAllInventoryPoSuccess,
  getAllInventoryPoFailure,
} from "../../Actions/inventoryPoActions";
import { items } from "@/app/utils/sidebarItems";
import InwardAssemblyPoTable from "@/app/components/InwardAssemblyPoTable/InwardAssemblyPoTable";
import { inventoryPOServices } from "@/app/services/inventoryPO";
import InwardInventoryPoTable from "@/app/components/InwardInventoryPoTable/InwardInventoryPoTable";
import StatusBar from "@/app/components/StatusBar/StatusBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/app/components/ButtonComponent/ButtonComponent";
import RaiseInventoryPoFormComponent from "@/app/components/RaiseInventoryPoFormComponent/RaiseInventoryPoFormComponent";
import OutwardProductToDispatchForm from "@/app/components/OutwardProductToDispatchForm/OutwardProductToDispatchForm";  

const page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);

  const dispatch = useDispatch();

  const getAllInventoryPo = async () => {
    try {
      dispatch(getAllInventoryPoRequest());
      const response = await inventoryPOServices.getAllInventoryPo();
      if (response.success === true) {
        dispatch(getAllInventoryPoSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllInventoryPo();
  }, []);

  const { allInventoryPO, loading, error } = useSelector(
    (state) => state.inventoryPo
  );
  console.log("allInventoryPO 40", allInventoryPO);

  const calculateStatusBarData = (allInventoryPO) => {
    let underStockCount = 0;
    let overStockCount = 0;
    let pendingPOCount = 0;
    let fullfilledPOCount = 0;

    allInventoryPO.forEach((po) => {
      const { current_stock, lower_threshold, upper_threshold } = po.product_id;
      const productStatus = po?.status;
      if (current_stock < lower_threshold) underStockCount++;
      if (current_stock > upper_threshold) overStockCount++;
      if (productStatus === "pending") pendingPOCount++;
      if (productStatus === "fulfilled") fullfilledPOCount++;
    });

    return [
      { value: pendingPOCount, heading: "Pending PO" },
      { value: fullfilledPOCount, heading: "Fullfilled PO" },
      { value: overStockCount, heading: "Items with Over Stock" },
      { value: underStockCount, heading: "Items with Under Stock" },
    ];
  };

  const statusBarData = calculateStatusBarData(allInventoryPO);

  const generateNavItems = () => {
    const inventoryTeam = items.find((item) => item.label === "Inventory");

    if (inventoryTeam && inventoryTeam.subItems) {
      return inventoryTeam.subItems.map((subItem) => ({
        name: subItem?.label,
        path: subItem?.path,
        icon: subItem?.iconKey,
      }));
    }

    return [];
  };

  const navItems = generateNavItems();

  const buttons = [
    <SecondaryButton
      title="Outward Products to Dispatch"
      size="medium"
      onClick={() => openSidebar("OutwardToDispatch")}
    />,
    <PrimaryButton
      title="Raise Inventory PO"
      onClick={() => openSidebar("RaisePo")}
    />,
  ];

  const openSidebar = (type) => {
    setSidebarType(type);
    setIsSidebarOpen(true);
  };

  return (
    <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
      <div className="relative z-10 flex flex-col items-center overflow-scroll scrollbar-none px-4 py-2">
        <div className="w-full max-w-full mb-4">
          <TitleBar title="Inventory" buttons={buttons} />
        </div>

        <div className="w-full max-w-full mb-5">
          <StatusBar data={statusBarData} />
        </div>

        <div className="w-full max-w-full mb-5">
          <NavigationBar navItems={navItems} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <InwardInventoryPoTable />
          </div>
        </div>
      </div>  

      {/* (Right Sidebar) */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)} // Close the sidebar
      >
        {sidebarType === "RaisePo" && (
          <RaiseInventoryPoFormComponent
            onCancel={() => setIsSidebarOpen(false)}
          />
        )}
        {sidebarType === "OutwardToDispatch" && (
          <OutwardProductToDispatchForm
            onCancel={() => setIsSidebarOpen(false)}
          />
        )}
      </RightSidebar>
    </div>
  );
};

export default page;
