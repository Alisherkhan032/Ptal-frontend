"use client";
import React from "react";
// import Sidebar from "../components/Sidebar/Sidebar";
// import useWindowResize from "@/Hooks/useWindowResize";

const Layout = ({ children }) => {
  //   const isMobile = useWindowResize();

  return (
    <div className="flex flex-row w-full h-screen bg-green-200">
      {/* {!isMobile && (
        <div className="sticky mt-14">
          <Sidebar />
        </div>
      )} */}

      <div className="bg-white w-full flex flex-col no-scrollbar overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};

export default Layout;
