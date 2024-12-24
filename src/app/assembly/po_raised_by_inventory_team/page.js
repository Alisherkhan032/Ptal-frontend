"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { assemblyPOServices } from "@/app/services/assemblyPO";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllInventoryPoRequest,
  getAllInventoryPoSuccess,
} from "../../Actions/inventoryPoActions";
import { inventoryPOServices } from "@/app/services/inventoryPO";
import PoRaisedByInventoryTeamTable from "@/app/components/PoRaisedByInventoryTeamTable/PoRaisedByInventoryTeamTable";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import { items } from "@/app/utils/sidebarItems";
import StatusBar from "@/app/components/StatusBar/StatusBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/app/components/ButtonComponent/ButtonComponent";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import RaiseAssemblyPoComponent from "@/app/components/RaiseAssemblyPoComponent/RaiseAssemblyPoComponent";
import POTypeDropdown from "@/app/components/POTypeDropdown/POTypeDropdown";
import GenerateQrCodeComponent from "@/app/components/GenerateQrCodeComponent/GenerateQrCodeComponent";
import RaiseAssemblyFGPoComponent from "@/app/components/RaiseAssemblyFGPoComponent/RaiseAssemblyFGPoComponent";

const page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Raise Assembly PO");
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

  const handleSidebarContent = (actionType) => {
    switch (actionType) {
      case "generateQr":
        setSidebarContent(
          <GenerateQrCodeComponent onCancel={() => setIsSidebarOpen(false)} />
        );
        setIsSidebarOpen(true);
        break;
      case "sfg":
        setSidebarContent(
          <RaiseAssemblyPoComponent onCancel={() => setIsSidebarOpen(false)} />
        );
        setIsSidebarOpen(true);
        break;
      case "fg":
        setSidebarContent(
          <RaiseAssemblyFGPoComponent onCancel={() => setIsSidebarOpen(false)} />
        );
        setIsSidebarOpen(true);
        break;

      default:
        setIsSidebarOpen(false);
    }
    // Open the sidebar
  };

  useEffect(() => {
    getAllInventoryPo();
  }, []);
  const { allInventoryPO, loading, error } = useSelector(
    (state) => state.inventoryPo
  );

  const allOptions = [
    { value: "assembly", label: "Raise Assembly PO" },
    { value: "sfg", label: "Raise SFG PO" },
    { value: "fg", label: "Raise FG PO" },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    if (option.value !== "assembly") {
      handleSidebarContent(option.value);
    }
    setIsOpen(false);
  };
  const visibleOptions = isOpen
    ? allOptions.filter((option) => option.value !== "assembly")
    : allOptions;

  // console.log('allInventoryPO====================', allInventoryPO);
  const buttons = [
    <SecondaryButton
      title="Generate QR"
      onClick={() => {
        setIsSidebarOpen(true);
        handleSidebarContent("generateQr");
      }}
      size="medium"
    >
      Raise Bulk Assembly PO
    </SecondaryButton>,

    <POTypeDropdown
      options={allOptions}
      selectedOption={selectedOption}
      onOptionSelect={handleOptionSelect}
      onToggle={handleToggle}
      isOpen={isOpen}
    />,
  ];

  const calculateStatusBarData = (allInventoryPO) => {
    let underStockCount = 0;
    let overStockCount = 0;
    let pendingCount = 0;
    let fulfilledCount = 0;

    allInventoryPO.forEach((po) => {
      const { current_stock, lower_threshold, upper_threshold } = po.product_id;
      const { status } = po;
      if (current_stock < lower_threshold) underStockCount++;
      if (current_stock > upper_threshold) overStockCount++;
      if (status === "pending") pendingCount++;
      if (status === "fulfilled") fulfilledCount++;
    });

    return [
      { value: pendingCount, heading: "Pending PO's" },
      { value: fulfilledCount, heading: "Fulfilled PO's" },
      { value: overStockCount, heading: "Items with Over Stock" },
      { value: underStockCount, heading: "Items with Under Stock" },
    ];
  };

  const statusBarData = calculateStatusBarData(allInventoryPO);

  const generateNavItems = () => {
    const assemblyTeam = items.find((item) => item.label === "Assembly");

    if (assemblyTeam && assemblyTeam.subItems) {
      return assemblyTeam.subItems.map((subItem) => ({
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
          <TitleBar title="Assembly" buttons={buttons} />
        </div>

        <div className="w-full max-w-full mb-5">
          <StatusBar data={statusBarData} />
        </div>

        <div className="w-full max-w-full mb-5">
          <NavigationBar navItems={navItems} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <PoRaisedByInventoryTeamTable />
          </div>
        </div>
      </div>
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)} // Close the sidebar
      >
        {sidebarContent}
      </RightSidebar>
    </div>
  );
};

export default page;
