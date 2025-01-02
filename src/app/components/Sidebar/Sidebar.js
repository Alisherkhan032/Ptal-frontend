"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ICONS } from "@/app/utils/icons";
import LogoComponent from "@/app/components/LogoComponent/LogoComponent";
import UserCard from "../UserCard/UserCard";
import { items } from "@/app/utils/sidebarItems";

const Sidebar = () => {
  const pathname = usePathname();
  const { userInfo } = useSelector((state) => state.auth);

  // Extract team name from pathname or default to 'storage'
  const extractTeamName = (path) => {
    const segments = path.split("/").filter(Boolean);
    return segments.length > 0 ? segments[0] : "storage";
  };

  // Determine active item based on pathname
  const determineActiveItem = () => {
    const teamName = extractTeamName(pathname);

    // Special case for admin path
    if (teamName === "admin") {
      return "7";
    }

    const activeItem = items.find((item) => {
      const itemTeamName = item.path.split("/")[1];
      return teamName === itemTeamName;
    });

    return activeItem?.id || "2"; // Fallback to default
  };

  const [activeItem, setActiveItem] = useState(determineActiveItem());

  // Update active item when pathname changes
  useEffect(() => {
    setActiveItem(determineActiveItem());
  }, [pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    window.location.href = item.path;
  };

  // User info handling
  const firstName = userInfo?.firstName || "User";
  const lastName = userInfo?.lastName || "";
  const email = userInfo?.email || "Not Available";

  return (
    <div className="flex flex-col w-[23vw] h-screen bg-[#f9fafc] font-medium text-black">
      {/* Logo Section */}
      <div className="flex flex-col px-7 py-2 mt-1">
        <Link href="/storage/inventory_level">
          <LogoComponent logo={"/filflow_logo.jpg"} name="Filflow" />
        </Link>
      </div>

      {/* Sidebar Items */}
      <div className="overflow-y-auto flex-1 px-4 scrollbar-none bg-[#f9fafc]">
        {items
          .filter((item) => item.label !== "Admin")
          .map((item) => (
            <div key={item.id} className="mb-2">
              <button
                className={`w-full text-sm font-medium py-2 px-4 text-left flex items-center gap-3 rounded-lg ${
                  activeItem === item.id
                    ? "bg-gray-2 text-primary"
                    : "text-dark hover:bg-gray-2"
                }`}
                onClick={() => handleItemClick(item)}
              >
                <span
                  style={{
                    color: activeItem === item.id ? "#3758F9" : "#9CA3AF",
                  }}
                >
                  {React.cloneElement(ICONS[item.iconKey], {
                    width: 20,
                    height: 20,
                  })}
                </span>
                {item.label}
              </button>
            </div>
          ))}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col px-7 py-2 mt-3 bg-[#f9fafc]">
        {/* Admin Settings */}
        <div
          className={`flex items-center gap-3 p-2 mb-4 cursor-pointer rounded-lg ${
            activeItem === "7"
              ? "bg-gray-2 text-primary"
              : "text-dark hover:bg-gray-2"
          }`}
          onClick={() =>
            handleItemClick({
              id: "7",
              path: "/admin/view_bulk_raw_material_po",
            })
          }
        >
          <span
            style={{
              color: activeItem === "7" ? "#3758F9" : "#9CA3AF",
            }}
          >
            {React.cloneElement(ICONS["settings"], {
              width: 20,
              height: 20,
            })}
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
