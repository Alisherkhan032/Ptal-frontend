import React from "react";
import {
  Cog8ToothIcon,
  StarIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";



import Admin from "@/app/utils/svg/Admin.svg";
import Assembly from "@/app/utils/svg/Assembly.svg";
import CustomOrder from "@/app/utils/svg/CustomOrder.svg";
import Dispatch from "@/app/utils/svg/Dispatch.svg";
import Engraving from "@/app/utils/svg/Engraving.svg";
import ExecutiveDash from "@/app/utils/svg/ExecutiveDash.svg";
import Home from "@/app/utils/svg/Home.svg";
import Inventory from "@/app/utils/svg/Inventory.svg";
import Packaging from "@/app/utils/svg/Packaging.svg";
import Procurement from "@/app/utils/svg/Procurement.svg";
import RawMaterial from "@/app/utils/svg/RawMaterial.svg";
import Report from "@/app/utils/svg/Report.svg";
import Return from "@/app/utils/svg/Return.svg";
import Storage from "@/app/utils/svg/Storage.svg";
import Qrcode from "@/app/utils/svg/Qrcode.svg";
import Logout from "@/app/utils/svg/Logout.svg";
import Profile from "@/app/utils/svg/Profile.svg";
import InventoryLevel from "@/app/utils/svg/InventoryLevel.svg";
import InwardPo from "@/app/utils/svg/InwardPo.svg";
import OutwardPo from "@/app/utils/svg/OutwardPo.svg";
import FulfilledPo from "@/app/utils/svg/FulfilledPo.svg";
import QcFail from "@/app/utils/svg/QcFail.svg";

export const ICONS = {
  executive: <ExecutiveDash width={15} height={15} />,
  procurement: <Procurement width={15} height={15} />,
  storage: <Storage width={15} height={15} />,
  assembly: <Assembly width={15} height={15} />,
  inventory: <Inventory stroke={'blue'} width={15} height={15} />,
  engraving: <Engraving width={15} height={15} />,
  dispatch: <Dispatch width={15} height={15} />,
  report: <Report width={15} height={15} />,
  admin: <Admin width={15} height={15} />,
  custom: <CustomOrder width={15} height={15} />,
  rto: <Return width={15} height={15} />,
  settings: <Cog8ToothIcon className="size-6 text-[#8899A8]" />,
  rawMaterial: <RawMaterial width={15} height={15} />,
  packaging: <Packaging width={15} height={15} />,
  download: <ArrowDownTrayIcon className="h-4 w-4 text-dark-4" />,
  calender: <CalendarDaysIcon className="h-4 w-4 text-dark-4" />,
  qrCode : <Qrcode className="h-6 w-6 text-dark-4" />,
  logout : <Logout className="h-5 w-5 text-dark-4" />,
  profile : <Profile className="h-5 w-5 text-dark-4" />,
  inventoryLevel : <InventoryLevel className="h-6 w-6 text-dark-4" />,
  inwardPo : <InwardPo className="h-6 w-6 text-dark-4" />,
  outwardPo : <OutwardPo className="h-6 w-6 text-dark-4" />,
  fulfilledPo : <FulfilledPo className="h-6 w-6 text-dark-4" />,
  qcFail : <QcFail className="h-6 w-6 text-dark-4" />,
}


export const ColoredIcon = ({
  icon,
  isActive,
  activeColor,
  inactiveColor,
  size,
}) => {
  // Map the custom sizes to Tailwind's default ones for better support
  const sizeClasses = {
    small: "w-4 h-4", // 1rem = 16px
    mediumSmall: "w-5 h-5", // 1.25rem = 20px
    medium: "w-6 h-6", // 1.5rem = 24px
    large: "w-8 h-8", // 2rem = 32px
    xlarge: "w-10 h-10", // 2.5rem = 40px
  };

  // default to 'medium' if no size is provided
  const iconSize = sizeClasses[size] || sizeClasses.mediumSmall;

  return React.cloneElement(icon, {
    className: `${iconSize} ${
      isActive ? `text-[${activeColor}]` : `text-[${inactiveColor}]`
    }`,
  });
};
