"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import { items } from "@/app/utils/sidebarItems";
import StatusBar from "@/app/components/StatusBar/StatusBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import CustomOrderTable from "@/app/components/CustomOrdersTable/CustomOrdersTable";
import { orderServices } from "@/app/services/oderService";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCustomOrdersSuccess,
  getAllCustomOrdersFailure,
  getAllCustomOrdersRequest,
} from "../../Actions/orderActions";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import {
  SecondaryButton,
  PrimaryButton,
} from "@/app/components/ButtonComponent/ButtonComponent";
import CreateCustomOrderForm from '@/app/components/CreateCustomOrderForm/CreateCustomOrderForm';
import ProcessCustomOrders from '@/app/components/ProcessCustomOrders/ProcessCustomOrders';


const page = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { allCustomOrders } = useSelector((state) => state.order);
  console.log("allCustomOrders", allCustomOrders);

  const getAllCustomOrders = async () => {
    try {
      dispatch(getAllCustomOrdersRequest());

      const response = await orderServices.getAllCustomOrders();
      if (response.success === true) {
        dispatch(getAllCustomOrdersSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllCustomOrders();
  }, []);

  const generateNavItems = () => {
    const Team = items.find((item) => item.label === "Custom Order");

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

  // 'closed', 'open','partially_processed', 'shipped','picked'
  const calculateStatusBarData = (allAssemblyPO) => {
    let closedCount = 0;
    let openCount = 0;
    let partiallyProcessedCount = 0;
    let shippedCount = 0;
    let pickedCount = 0;

    allAssemblyPO.forEach((po) => {
      const status = po.status;
      if (status === "closed") {
        closedCount++;
      } else if (status === "open") {
        openCount++;
      } else if (status === "partially_processed") {
        partiallyProcessedCount++;
      } else if (status === "shipped") {
        shippedCount++;
      } else if (status === "picked") {
        pickedCount++;
      }
    });

    return [
      { value: closedCount, heading: "Closed Orders" },
      { value: openCount, heading: "Open Orders" },
      { value: partiallyProcessedCount, heading: "Partially Processed Orders" },
      { value: shippedCount, heading: "Shipped Orders" },
      { value: pickedCount, heading: "Picked Orders" },
    ];
  };

  const statusBarData = calculateStatusBarData(allCustomOrders);

  const buttons = [
    <SecondaryButton
      title="Process Custom Order"
      onClick={() => {
        setIsSidebarOpen(true);
        handleSidebarContent("processCustomOrder");
      }}
      size="medium"
    />,

    <PrimaryButton
      title="Create Custom Order"
      onClick={() => {
        setIsSidebarOpen(true);
        handleSidebarContent("createCustomOrder");
      }}
      size="medium"
    />,
  ];

  const handleSidebarContent = (actionType) => {
    switch (actionType) {
      case "processCustomOrder":
        setSidebarContent(
          <ProcessCustomOrders onCancel={() => setIsSidebarOpen(false)} />
        );
        setIsSidebarOpen(true);
        break;
      case "createCustomOrder":
        setSidebarContent(
          <CreateCustomOrderForm onCancel={() => setIsSidebarOpen(false)} />
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
          <TitleBar title="Custom Order" buttons={buttons}/>
        </div>

        <div className="w-full max-w-full mb-5">
          <StatusBar data={statusBarData} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <CustomOrderTable />
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
