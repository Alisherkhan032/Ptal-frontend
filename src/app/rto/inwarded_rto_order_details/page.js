"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import { items } from "@/app/utils/sidebarItems";
import { useDispatch, useSelector } from "react-redux";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import RTOOrderTable from "@/app/components/RTOOrderTable/RTOOrderTable";
import { rtoOrderService } from "@/app/services/rtoOrderService";
import {
  getAllRtoOrderRequest,
  getAllRtoOrderSuccess,
  getAllRtoOrderFailure,
} from "../../Actions/rtoOrderActions";
import { PrimaryButton } from "@/app/components/ButtonComponent/ButtonComponent";
import TitleBar from "@/app/components/TitleBar/TitleBar";

const page = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dispatch = useDispatch();

  const getAllRtoOrderDetails = async () => {
    try {
      dispatch(getAllRtoOrderRequest());
      const response = await rtoOrderService.getAllRTOOrders();
      if (response.success === true) {
        dispatch(getAllRtoOrderSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllRtoOrderDetails();
  }, []);

  const buttons = [
    <PrimaryButton
      title="Inward Return"
      onClick={() => setIsSidebarOpen(true)}
      size='full'
    />
  ];

  return (
    <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
      <div className="relative z-10 flex flex-col items-center overflow-scroll scrollbar-none px-4 py-2">
        <div className="w-full max-w-full mb-4">
          <TitleBar title="Returns" buttons={buttons} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <RTOOrderTable />
          </div>
        </div>
      </div>

      {/* (Right Sidebar) */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)} // Close the sidebar
      >
        <h1>Hi</h1>
      </RightSidebar>
    </div>
  );
};

export default page;
