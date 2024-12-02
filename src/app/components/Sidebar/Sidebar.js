"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./sidebar.css";
import { ICONS, ColoredIcon } from "@/app/utils/icons"; // Import ColoredIcon
import LogoComponent from "@/app/components/LogoComponent/LogoComponent";
import UserCard from "../UserCard/UserCard";
import { items } from "@/app/utils/sidebarItems";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const defaultActiveItemId = "procurement_team";
  const [activeItem, setActiveItem] = useState(defaultActiveItemId);
  const { userInfo } = useSelector((state) => state.auth);

  const firstName = userInfo?.firstName || "User"; // Fallback to "User"
  const lastName = userInfo?.lastName || "";
  const email = userInfo?.email || "Not Available";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedActiveItem = localStorage.getItem("activeItem");
      if (savedActiveItem) {
        setActiveItem(JSON.parse(savedActiveItem));
      }
    }
  }, []);

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeItem", JSON.stringify(item.id));
    }
    window.location.href = item.path;
  };

  return (
    <div className="flex flex-col w-[23vw] h-screen bg-[#f9fafc] font-medium text-black">
      {/* Top Section - Logo */}
      <div className="flex flex-col px-7 py-2 mt-1">
        <Link href="/storage/inventory_level">
          <LogoComponent logo={'/logo.svg'} name="Fill Flow" />
        </Link>
      </div>

      {/* Sidebar Items */}
      <div className="overflow-y-auto flex-1 px-4 scrollbar-none bg-[#f9fafc]">
        {items.map((item) => (
          <div key={item.id} className="mb-2">
            <button
              className={`w-full text-sm font-medium py-2 px-4 text-left flex items-center gap-3 rounded-lg ${
                activeItem === item.id
                  ? "bg-gray-2 text-primary"
                  : "text-dark hover:bg-gray-2"
              }`}
              onClick={() => handleItemClick(item)}
            >
              <span className="text-[#8899A8]">
                {/* Use ColoredIcon to handle color change */}
                <ColoredIcon
                  icon={ICONS[item.iconKey]}
                  isActive={activeItem === item.id}
                  activeColor="#2D68F8"
                  inactiveColor="#8899A8"
                  size="mediumSmall"
                />
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
              ? "bg-gray-2 text-primary"
              : "text-dark hover:bg-gray-2"
          }`}
          onClick={() => handleItemClick({ id: "admin_settings", path: "#" })}
        >
          <span className="size-6">
            {/* Use ColoredIcon to handle color change */}
            <ColoredIcon
              icon={ICONS["settings"]}
              isActive={activeItem === "admin_settings"}
              activeColor="#2D68F8"
              inactiveColor="#8899A8"
              size="mediumSmall"
            />
          </span>
          <span className="text-sm">Admin Settings</span>
        </div>

        {/* User Profile */}
        <div>
          <UserCard name={`${firstName} ${lastName}`} email={email} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
