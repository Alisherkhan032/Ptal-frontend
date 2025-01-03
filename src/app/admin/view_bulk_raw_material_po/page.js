"use client";
import React, { useEffect, useState } from "react";
import { bulkRawMaterialPOServices } from "@/app/services/bulkRawMaterialPOService";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBulkRawMaterialPOFailure,
  getAllBulkRawMaterialPORequest,
  getAllBulkRawMaterialPOSuccess,
} from "@/app/Actions/bulkRawMaterialPOActions";

import { items } from "@/app/utils/sidebarItems";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import StatusBar from "@/app/components/StatusBar/StatusBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import ViewBulkRawMaterialPOTable from "@/app/components/ViewBulkRawMaterialPOTable/ViewBulkRawMaterialPOTable";
import { PrimaryButton } from "@/app/components/ButtonComponent/ButtonComponent";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import CreateAdminRawMaterialForm from "@/app/components/CreateAdminRawMaterialForm/CreateAdminRawMaterialForm";
import CreateAdminProductForm from "@/app/components/CreateAdminProductForm/CreateAdminProductForm";
import CreateAdminVendorForm from "@/app/components/CreateAdminVendorForm/CreateAdminVendorForm";
import CreateAdminRaiseBulkRawMaterialPOForm from "@/app/components/CreateAdminRaiseBulkRawMaterialPOForm/CreateAdminRaiseBulkRawMaterialPOForm";

const page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const getAllBulkRawMaterialPO = async () => {
    try {
      dispatch(getAllBulkRawMaterialPORequest());
      const response =
        await bulkRawMaterialPOServices.getAllBulkRawMaterialPO();

      if (response.success === true) {
        dispatch(getAllBulkRawMaterialPOSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllBulkRawMaterialPO();
  }, []);

  const { allBulkRawMaterialPO, loading, error } = useSelector(
    (state) => state.bulkRawMaterialPO
  );

  console.log(allBulkRawMaterialPO);

  const calculateStatusBarData = (poData) => {
    let pendingCount = 0;
    let fulfilledCount = 0;

    poData.forEach((po) => {
      if (po.status === "pending") pendingCount++;
      if (po.status === "fulfilled") fulfilledCount++;
    });

    return [
      { value: pendingCount, heading: "Pending PO's" },
      { value: fulfilledCount, heading: "Fulfilled PO's" },
    ];
  };

  const statusBarData = calculateStatusBarData(allBulkRawMaterialPO);

  const generateNavItems = () => {
    const AdminTeam = items.find((item) => item.label === "Admin");

    if (AdminTeam && AdminTeam.subItems) {
      return AdminTeam.subItems.map((subItem) => ({
        name: subItem.label,
        path: subItem.path,
        icon: subItem.iconKey,
      }));
    }

    return [];
  };

  const navItems = generateNavItems();

  const handleSidebarContent = (actionType) => {
    switch (actionType) {
      case "createRawMaterial":
        setSidebarContent(
          <CreateAdminRawMaterialForm onCancel={()=>setIsSidebarOpen(false)} />
        );
        setIsSidebarOpen(true);
        break;
      case "createVendor":
        setSidebarContent(
          <CreateAdminVendorForm onCancel={()=>setIsSidebarOpen(false)} />  
        );
        setIsSidebarOpen(true);
        break;
      case "createProduct":
        setSidebarContent(
          <CreateAdminProductForm onCancel={()=>setIsSidebarOpen(false)} />
        );
        setIsSidebarOpen(true);
        break;
      case "createBulkRawMaterialPO":
        setSidebarContent(
          <CreateAdminRaiseBulkRawMaterialPOForm onCancel={()=>setIsSidebarOpen(false)} />
        );
        setIsSidebarOpen(true);
        break;
      default:
        setIsSidebarOpen(false);
    }
  };

  const buttons = [
    <PrimaryButton
      title="Create Raw Material"
      onClick={() => {
        setIsSidebarOpen(true);
        handleSidebarContent("createRawMaterial");
      }}
      size="medium"
    />,
    <PrimaryButton
      title="Create Vendor"
      onClick={() => {
        setIsSidebarOpen(true);
        handleSidebarContent("createVendor");
      }}
      size="medium"
    />,
    <PrimaryButton
      title="Create Product"
      onClick={() => {
        setIsSidebarOpen(true);
        handleSidebarContent("createProduct");
      }}
      size="medium"
    />,
    <PrimaryButton
      title="Raise Bulk Raw Material PO"
      onClick={() => {
        setIsSidebarOpen(true);
        handleSidebarContent("createBulkRawMaterialPO");
      }}
      size="medium"
    />,
  ];

  return (
    <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
      <div className="relative z-10 flex flex-col items-center overflow-scroll scrollbar-none px-4 py-2">
        <div className="w-full max-w-full mb-4">
          <TitleBar title="Admin" buttons={buttons} />
        </div>

        <div className="w-full max-w-full mb-5">
          <StatusBar data={statusBarData} />
        </div>

        <div className="w-full max-w-full mb-5">
          <NavigationBar navItems={navItems} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <ViewBulkRawMaterialPOTable />
          </div>
        </div>
      </div>

      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)} // Close the sidebar
      >
        {sidebarContent}
      </RightSidebar>
    </div>
  );
};

export default page;
