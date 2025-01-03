import { ICONS } from "@/app/utils/icons";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

const NavigationBar = ({ navItems }) => {
  const router = useRouter();
  const pathname = usePathname();

  // console.log("pathname", pathname);

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="flex border-b border-stroke p-4 overflow-scroll scrollbar-none whitespace-nowrap">
      {navItems.map((item, index) => (
        <div
          key={index}
          className="nav-item flex items-center mr-6 cursor-pointer"
          onClick={() => handleNavigation(item.path)}
        >
          <div
            className="mr-2 text-sm"
            style={{
              color: pathname === item.path ? "#3758F9" : "#9CA3AF",
            }}
          >
            {item?.icon && React.cloneElement(ICONS[item?.icon], {
          width: 20,
          height: 20,
          className: pathname === item.path ? "text-[#3758F9]" : "text-[#9CA3AF]",
        })}
          </div>
          <div
            className="text-sm font-medium"
            style={{
              color: pathname === item.path ? "#3758F9" : "#4B5563",
            }}
          >
            {item.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavigationBar;