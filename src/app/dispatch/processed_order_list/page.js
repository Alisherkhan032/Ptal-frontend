"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import { items } from "@/app/utils/sidebarItems";
import { useDispatch, useSelector } from "react-redux";
import ProcessedOrderTable from "@/app/components/ProcessedOrderTable/ProcessedOrderTable";
import { orderDetailsService } from "@/app/services/orderDetailsService";
import {
  getAllOrderDetailsRequest,
  getAllOrderDetailsSuccess,
  getAllOrderDetailsFailure,
} from "../../Actions/orderDetailsActions";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import { PrimaryButton, SecondaryButton } from "@/app/components/ButtonComponent/ButtonComponent";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import CreateEngravingOrderPoComponent from "@/app/components/CreateEngravingOrderPoComponent/CreateEngravingOrderPoComponent";
import ProcessOrders from '@/app/components/ProcessOrders/ProcessOrders';
import InwardAmazonCSV from '@/app/components/InwardAmazonCsv/InwardAmazonCsv';
import ProcessAmazonOrders from '@/app/components/ProcessAmazonOrders/ProcessAmazonOrders';

const page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const dispatch = useDispatch();

  const getAllOrderDetails = async () => {
    try {
      dispatch(getAllOrderDetailsRequest());
      const response = await orderDetailsService.getAllOrderDetails();
      if (response.success === true) {
        dispatch(getAllOrderDetailsSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllOrderDetails();
  }, []);

  const generateNavItems = () => {
    const Team = items.find((item) => item.label === "Dispatch");

    if (Team && Team.subItems) {
      return Team.subItems.map((subItem) => ({
        name: subItem.label,
        path: subItem.path,
        icon: subItem.iconKey,
      }));
    }

    return [];
  };

  const navItems = generateNavItems();

  const buttons = [
    
    // <PrimaryButton
    //   title="Process Amazon Orders"
    //   onClick={() => {
    //     setIsSidebarOpen(true)
    //     handleSidebarContent("processAmazonOrders");
    //   }}
    //   size="titleBar"
    // />,
    // <PrimaryButton
    //   title="Process Order"
    //   onClick={() => {
    //     setIsSidebarOpen(true)
    //     handleSidebarContent("processOrder");
    //   }}
    //   size="titleBar"
    // />,
    <SecondaryButton
      title="Engraving PO"
      onClick={() => {
        setIsSidebarOpen(true)
        handleSidebarContent("raiseEngravingPo");
      }}
      size="titleBar"
    />,
    <SecondaryButton
      title="Inward Amazon Order"
      onClick={() => {
        setIsSidebarOpen(true)
        handleSidebarContent("inwardAmazonOrderCsv");
      }}
      size="titleBar"
    />,
  ];

  const handleSidebarContent = (actionType) => {
    switch (actionType) {
      case "processOrder":
        setSidebarContent(<ProcessOrders onCancel={() => setIsSidebarOpen(false)} />);
        setIsSidebarOpen(true);
        break;
      case "raiseEngravingPo":
        setSidebarContent(
          <CreateEngravingOrderPoComponent onCancel={() => setIsSidebarOpen(false)} />
        );
        setIsSidebarOpen(true);
        break;
      case "inwardAmazonOrderCsv":
        setSidebarContent(
          <InwardAmazonCSV onCancel={() => setIsSidebarOpen(false)} />
        );
        setIsSidebarOpen(true);
        break;
      case "processAmazonOrders":
        setSidebarContent(
          <ProcessAmazonOrders onCancel={() => setIsSidebarOpen(false)} />
        );
        setIsSidebarOpen(true);
        break;
      default:
        setIsSidebarOpen(false);
    }
    // Open the sidebar
  };

  return (
    <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
      <div className="relative z-10 flex flex-col items-center overflow-scroll scrollbar-none px-4 py-2">
        <div className="w-full max-w-full mb-4">
          <TitleBar title="Dispatch" buttons={buttons} />
        </div>

        <div className="w-full max-w-full mb-5">
          <NavigationBar navItems={navItems} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <ProcessedOrderTable />
          </div>
        </div>
      </div>

      {/* (Right Sidebar) */}
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
