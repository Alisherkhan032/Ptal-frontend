// src/utils/icons.js
import React from "react";
import {
    HomeIcon,
    ShoppingCartIcon,
    ServerStackIcon ,
    CubeIcon,
    Cog8ToothIcon ,
    ChartBarIcon,
    DocumentIcon ,
    TruckIcon,
    InboxArrowDownIcon,
    StarIcon,
    ArrowDownTrayIcon,
    CalendarDaysIcon
  } from "@heroicons/react/24/outline";

  export const ICONS = {
  executive: <HomeIcon className="size-6 text-[#8899A8]" />,
  procurement: <ShoppingCartIcon className="size-6 text-[#8899A8]"  />,
  storage: <ServerStackIcon className="size-6 text-[#8899A8]"  />,
  assembly: <InboxArrowDownIcon className="size-6 text-[#8899A8]" />,
  inventory: <CubeIcon className="size-6 text-[#8899A8]" />,
  engraving: <ChartBarIcon className="size-5 text-[#8899A8]"  />,
  dispatch: <TruckIcon className="size-6 text-[#8899A8]" />,
  report: <DocumentIcon className="size-6 text-[#8899A8]" />,
  admin: <DocumentIcon  className="size-6 text-[#8899A8]" />,
  custom: <DocumentIcon className="size-6 text-[#8899A8]" />,
  rto: <DocumentIcon className="size-6 text-[#8899A8]" />,
  settings : <Cog8ToothIcon className="size-6 text-[#8899A8]" />,
  rawMaterial : <StarIcon className="size-[1.125rem] text-[#111928]" />,
  packaging : <StarIcon className="size-[1.125rem] text-[#111928]" />,
  download : <ArrowDownTrayIcon class="h-4 w-4 text-dark-4" />,
  calender : <CalendarDaysIcon class="h-4 w-4 text-dark-4" />
};

export const ColoredIcon = ({ icon, isActive, activeColor, inactiveColor, size }) => {
  // Map the custom sizes to Tailwind's default ones for better support
  const sizeClasses = {
    small: "w-4 h-4",  // 1rem = 16px
    mediumSmall: "w-5 h-5", // 1.25rem = 20px
    medium: "w-6 h-6", // 1.5rem = 24px
    large: "w-8 h-8",  // 2rem = 32px
    xlarge: "w-10 h-10", // 2.5rem = 40px
  };

  // default to 'medium' if no size is provided
  const iconSize = sizeClasses[size] || sizeClasses.mediumSmall;

  return React.cloneElement(icon, {
    className: `${iconSize} ${isActive ? `text-[${activeColor}]` : `text-[${inactiveColor}]`}`,
  });
};




  