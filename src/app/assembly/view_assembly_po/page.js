"use client";
import React, { useEffect, useState } from "react";
import { assemblyPOServices } from "@/app/services/assemblyPO";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAssemblyPoRequest,
  getAllAssemblyPoSuccess,
  getAllAssemblyPoFailure,
} from "../../Actions/assemblyPoActions";
import ViewAssemblyTable from "@/app/components/ViewAssemblyTable/ViewAssemblyTable";
import StatusBar from "@/app/components/StatusBar/StatusBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import { items } from "@/app/utils/sidebarItems";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import RaiseAssemblyPoComponent from "@/app/components/RaiseAssemblyPoComponent/RaiseAssemblyPoComponent";
import { SecondaryButton } from "@/app/components/ButtonComponent/ButtonComponent";
import POTypeDropdown from "@/app/components/POTypeDropdown/POTypeDropdown";
import GenerateQrCodeComponent from "@/app/components/GenerateQrCodeComponent/GenerateQrCodeComponent";

const page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Raise Assembly PO");
  const dispatch = useDispatch();

  const getAllAssemblyPo = async () => {
    try {
      dispatch(getAllAssemblyPoRequest());
      const response = await assemblyPOServices.getAllAssemblyPo();
      if (response.success === true) {
        dispatch(getAllAssemblyPoSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllAssemblyPo();
  }, []);
  const handleSidebarContent = (actionType) => {
    switch (actionType) {
      case "generateQr":
        setSidebarContent(<GenerateQrCodeComponent onCancel={() => setIsSidebarOpen(false)} />);
        setIsSidebarOpen(true);
        break;
      case "vendor":
        setSidebarContent(
          <RaiseAssemblyPoComponent onCancel={() => setIsSidebarOpen(false)} />
        );
        setIsSidebarOpen(true);
        break;
      default:
        setIsSidebarOpen(false);
    }
    // Open the sidebar
  };

  const { allAssemblyPO, loading, error } = useSelector(
    (state) => state.assemblyPO
  );

  console.log("allAssemblyPO====>", allAssemblyPO);
  const allOptions = [
    { value: "assembly", label: "Raise Assembly PO" },
    { value: "vendor", label: "Raise SFG PO" },
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

  const calculateStatusBarData = (allAssemblyPO) => {
    let underStockCount = 0;
    let overStockCount = 0;
    let pendingCount = 0;
    let fulfilledCount = 0;

    allAssemblyPO.forEach((po) => {
      const { current_stock, lower_threshold, upper_threshold } =
        po.raw_material_id;
      const status = po.status;
      if (current_stock < lower_threshold) underStockCount++;
      if (current_stock > upper_threshold) overStockCount++;
      if (status === "pending") pendingCount++;
      if (status === "fulfilled") fulfilledCount++;
    });

    return [
      { value: overStockCount, heading: "Items with Over Stock" },
      { value: underStockCount, heading: "Items with Under Stock" },
      { value: pendingCount, heading: "Pending PO's" },
      { value: fulfilledCount, heading: "Fulfilled PO's" },
    ];
  };

  const statusBarData = calculateStatusBarData(allAssemblyPO);

  const generateNavItems = () => {
    const AssemblyTeam = items.find((item) => item.label === "Assembly");

    if (AssemblyTeam && AssemblyTeam.subItems) {
      return AssemblyTeam.subItems.map((subItem) => ({
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
            <ViewAssemblyTable />
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
