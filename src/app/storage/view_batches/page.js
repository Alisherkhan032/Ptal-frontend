"use client";
import React, { useState, useEffect } from "react";
import { batchServices } from "@/app/services/batchService";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBatchRequest,
  getAllBatchSuccess,
} from "../../Actions/batchActions";
import ViewBatchTable from "@/app/components/ViewBatchTable/ViewBatchTable";
import { items } from "@/app/utils/sidebarItems";
import TitleBar from "@/app/components/TitleBar/TitleBar";

const page = () => {
  const { selectedRawMaterialId } = useSelector((state) => state.batch);

  const dispatch = useDispatch();

  const getAllBatches = async () => {
    try {
      dispatch(getAllBatchRequest());
      const response = await batchServices.getAllBatches(selectedRawMaterialId);
      if (response.success === true) {
        dispatch(getAllBatchSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllBatches();
  }, []);

  return (
    <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
      <div className="relative z-10 flex flex-col items-center overflow-scroll scrollbar-none px-4 py-2">
        <div className="w-full max-w-full mb-4">
          <TitleBar title="Storage" />
        </div>

        <div className="w-full max-w-full mb-5">
          <h1 className="text-base text-black font-semibold">
            Batches - {selectedRawMaterialId}
          </h1>
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <ViewBatchTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
