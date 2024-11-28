"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./sidebar.css";
import { ICONS } from "@/app/utils/icons";
import LogoComponent from "@/app/components/LogoComponent/LogoComponent";
import UserCard from "../UserCard/UserCard";
import { items } from "@/app/utils/sidebarItems";

const Sidebar = () => {
  const defaultActiveItemId = "procurement_team";

  const [activeItem, setActiveItem] = useState(defaultActiveItemId);

  useEffect(() => {
    // Only access localStorage on the client side after component mounts
    if (typeof window !== "undefined") {
      const savedActiveItem = localStorage.getItem("activeItem");
      if (savedActiveItem) {
        setActiveItem(JSON.parse(savedActiveItem));
      }
    }
  }, []); // Empty dependency array ensures this only runs once after initial render

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeItem", JSON.stringify(item.id));
    }
    window.location.href = item.path; // You can use Next.js router if needed for client-side navigation
  };

  return (
    <div className="flex flex-col w-[23vw] h-screen bg-[#f9fafc] font-medium text-black">
      {/* Top Section - Logo */}
      <div className="flex flex-col px-7 py-4">
        <Link href="/storage/inventory_level">
          <LogoComponent logo={"/logo.svg"} name="Fill Flow" />
        </Link>
      </div>

      {/* Sidebar Items */}
      <div className="overflow-y-auto flex-1 px-4 scrollbar-none bg-[#f9fafc]">
        {items.map((item) => (
          <div key={item.id} className="mb-2">
            <button
              className={`w-full text-[1.15vw] font-medium py-2 px-4 text-left flex items-center gap-3 rounded-lg ${
                activeItem === item.id
                  ? "bg-[#F3F4F6] text-[#2D68F8]"
                  : "text-[#111928] hover:bg-[#F3F4F6]"
              }`}
              onClick={() => handleItemClick(item)}
            >
              <span className="text-[#8899A8]">
                {React.cloneElement(ICONS[item.iconKey], {
                  className: `size-6 ${
                    activeItem === item.id ? "text-[#2D68F8]" : "text-[#8899A8]"
                  }`,
                })}
              </span>
              {item.label}
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Section - Admin Settings and Profile */}
      <div className="flex flex-col px-7 py-2 mt-3 bg-[#f9fafc]">
        {/* Admin Settings */}
        <div
          className={`flex items-center gap-3 mb-4 cursor-pointer rounded-lg ${
            activeItem === "admin_settings"
              ? "bg-[#F3F4F6] text-[#2D68F8]"
              : "text-[#111928] hover:bg-[#F3F4F6]"
          }`}
          onClick={() => handleItemClick({ id: "admin_settings", path: "#" })}
        >
          <span
            className={`size-6 ${
              activeItem === "admin_settings" ? "text-[#2D68F8]" : "text-[#8899A8]"
            }`}
          >
            {ICONS["settings"]}
          </span>
          <span className="text-[1.15vw]">Admin Settings</span>
        </div>

        {/* User Profile */}
        <div className="">
          <UserCard name="Shashwat Sharma" email="shashwat.sharma@acme.com" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
