"use client";
import React, { useEffect } from "react";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import { items } from "@/app/utils/sidebarItems";
import EngravingOrderTable from "@/app/components/EngravingOrdersTable/EngravingOrdersTable";
import { engravingOrderServices } from "@/app/services/engravingOrderService";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEngravingOrdersRequest,
  getAllEngravingOrdersSuccess,
  getAllEngravingOrdersFailure,
} from "../../Actions/engravingOrderActions";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import StatusBar from "@/app/components/StatusBar/StatusBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";

const page = () => {
  const dispatch = useDispatch();

  const getAllEngravingOrders = async () => {
    try {
      dispatch(getAllEngravingOrdersRequest());

      const response = await engravingOrderServices.getAllEngravingOrders();
      if (response.success === true) {
        dispatch(getAllEngravingOrdersSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllEngravingOrders();
  }, []);

  const { allEngravingOrders } = useSelector((state) => state.engravingOrder);

  //  ['pending', 'engraving_done_and_QRCode_generated', 'outwarded_from_inventory', 'outwarded_from_storage']

  const calculateStatusBarData = (poData) => {
    let pendingCount = 0;
    let engravedAndQrGenerated = 0;
    let outwardedFromInventory = 0;
    let outwardedFromStorage = 0;

    poData.forEach((po) => {
      if (po.status === "pending") pendingCount++;
      if (po.status === "engraving_done_and_QRCode_generated")
        engravedAndQrGenerated++;
      if (po.status === "outwarded_from_inventory") outwardedFromInventory++;
      if (po.status === "outwarded_from_storage") outwardedFromStorage++;
    });

    return [
      { value: pendingCount, heading: "Pending PO's" },
      {
        value: engravedAndQrGenerated,
        heading: "Engraved and QR code generated PO's",
      },
      {
        value: outwardedFromInventory,
        heading: "Outwarded from Inventory PO's",
      },
      { value: outwardedFromStorage, heading: "Outwarded from Inventory PO's" },
    ];
  };

  const statusBarData = calculateStatusBarData(allEngravingOrders);

  const generateNavItems = () => {
    const engravingTeam = items.find((item) => item.label === "Engraving");

    if (engravingTeam && engravingTeam.subItems) {
      return engravingTeam.subItems.map((subItem) => ({
        name: subItem.label,
        path: subItem.path,
        icon: subItem?.iconKey,
      }));
    }

    return [];
  };

  const navItems = generateNavItems();

  return (
    <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
      <div className="relative z-10 flex flex-col items-center overflow-scroll scrollbar-none px-4 py-2">
        <div className="w-full max-w-full mb-4">
          <TitleBar title="Engraving" />
        </div>

        <div className="w-full max-w-full mb-5">
          <StatusBar data={statusBarData} />
        </div>

        <div className="w-full max-w-full mb-5">
          <NavigationBar navItems={navItems} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <EngravingOrderTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
