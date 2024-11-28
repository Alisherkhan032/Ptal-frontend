"use client";
import Input from "@/app/components/Input/Input";
import Button from "@/app/components/Button/Button";
import React, { useState } from "react";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import { items } from "@/app/utils/sidebarItems";
import OutwardProductsToDispatch from "@/app/components/OutwardProductsToDispatch/OutwardProductsToDispatch";
import PageTitle from "@/app/components/PageTitle/PageTitle";


const Page = () => {
  const [numberOfTextFields, setNumberOfTextFields] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = (e) => {
    e.preventDefault()
    console.log("clicked");
    // setNumberOfTextFields(parseInt(inputValue, 10) || 0);
    setNumberOfTextFields(5)
  };

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>
      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={"Outward Products To Dispatch"} />
        </div>
        <div className="mt-[0.3vw]">
          < OutwardProductsToDispatch />
        </div>
      </div>
    </div>
  );
};

export default Page;
