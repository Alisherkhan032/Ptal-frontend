"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { poServices } from "../../services/poService";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPoRequest,
  getAllPoSuccess,
  getAllPoFailure,
} from "../../Actions/poActions";
import { items } from "@/app/utils/sidebarItems";
import StorageQcFailInventory from "@/app/components/StorageQcFailInventory/StorageQcFailInventory";
import StatusBar from "@/app/components/StatusBar/StatusBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import StorageQcFailInventory2 from "@/app/components/StorageQcFailInventort2/StorageQcFailInventort2";

const page = () => {
  const dispatch = useDispatch();

  const getAllPos = async () => {
    try {
      dispatch(getAllPoRequest());
      const response = await poServices.getAllPoAfter26Nov();
      if (response.success === true) {
        dispatch(getAllPoSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllPos();
  }, []);

  const { allPO } = useSelector((state) => state.po);
  console.log("allPO", allPO);

  const calculateStatusBarData = (poData) => {
    const filteredData = poData.filter(
      (po) =>
        (po.status === "fulfilled" || po.status === "qc_info_added") &&
        po.qcData?.failedQcInfo > 0
    );

    const totalFailedQcCount = filteredData.reduce(
      (total, po) => total + (po.qcData.failedQcInfo || 0),
      0
    );

    return [{ value: totalFailedQcCount, heading: "Total Failed QC Items" }];
  };

  const statusBarData = calculateStatusBarData(allPO);

  const generateNavItems = () => {
    const storageTeam = items.find((item) => item.label === "Storage");

    if (storageTeam && storageTeam.subItems) {
      return storageTeam.subItems.map((subItem) => ({
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
          <TitleBar title="Storage" />
        </div>

        <div className="w-full max-w-full mb-5">
          <StatusBar data={statusBarData} />
        </div>

        <div className="w-full max-w-full mb-5">
          <NavigationBar navItems={navItems} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <StorageQcFailInventory2 />
            {/* <StorageQcFailInventory /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
