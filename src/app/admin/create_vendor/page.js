"use client"
import React from "react";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import PageTitle from "@/app/components/PageTitle/PageTitle";
import { items } from "@/app/utils/sidebarItems";
import CreateVendorForm from "@/app/components/CreateVendorForm/CreateVendorForm";

const page = () => {
  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col  w-[77vw] ">
        <div>
          <PageTitle pageTitle={"Create Vendor"} />
        </div>

        <div className="mt-[0.3vw]">
          <CreateVendorForm />
        </div>
      </div>
    </div>
  );
};

export default page;
