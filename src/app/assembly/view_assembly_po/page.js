'use client';
import React, { useEffect } from 'react';
import { assemblyPOServices } from '@/app/services/assemblyPO';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllAssemblyPoRequest,
  getAllAssemblyPoSuccess,
  getAllAssemblyPoFailure,
} from '../../Actions/assemblyPoActions';
import { items } from '@/app/utils/sidebarItems';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import ViewAssemblyTable from '@/app/components/ViewAssemblyTable/ViewAssemblyTable';
import PageTitle from '@/app/components/PageTitle/PageTitle';

const page = () => {
  const dispatch = useDispatch();

  const getAllAssemblyPo = async () => {
    try {
      dispatch(getAllAssemblyPoRequest());
      const response = await assemblyPOServices.getAllAssemblyPo();
      if (response.success === true) {
        dispatch(getAllAssemblyPoSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllAssemblyPo();
  });

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <PageTitle pageTitle={'View Assembly PO'} />
        <div className="mt-[0.3vw]  scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <ViewAssemblyTable />
        </div>
      </div>
    </div>
  );
};

export default page;
