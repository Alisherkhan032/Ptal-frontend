"use client";
import React, { useEffect } from "react";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import { items } from "@/app/utils/sidebarItems";
import OutwardEngravingOrder from "@/app/components/OutwardEngravingOrder/OutwardEngravingOrder";
import { engravingOrderServices } from "@/app/services/engravingOrderService";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEngravingOrdersRequest,
  getAllEngravingOrdersSuccess,
  getAllEngravingOrdersFailure,
} from "../../Actions/engravingOrderActions";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";


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

  return (
    <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
      <div className="relative z-10 flex flex-col items-center overflow-scroll scrollbar-none px-4 py-2">
        <div className="w-full max-w-full mb-4">
          <TitleBar title="Inventory" />
        </div>

        <div className="w-full max-w-full mb-5">
          <NavigationBar navItems={navItems} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <OutwardEngravingOrder />
          </div>
        </div>
      </div>

    </div>
  );
};

export default page;
