"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { items } from "@/app/utils/sidebarItems";
import EngravingInventoryLevel from "@/app/components/EngravingInventoryLevel/EngravingInventoryLevel";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";

const page = () => {
  const generateNavItems = () => {
    const engravingTeam = items.find((item) => item.label === "Engraving");

    if (engravingTeam && engravingTeam.subItems) {
      return engravingTeam.subItems.map((subItem) => ({
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
          <TitleBar title="Engraving" />
        </div>

        <div className="w-full max-w-full mb-5">
          <NavigationBar navItems={navItems} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <EngravingInventoryLevel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
