'use client';
import React, { useEffect } from 'react';
import { bulkRawMaterialPOServices } from '@/app/services/bulkRawMaterialPOService';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBulkRawMaterialPOFailure,
  getAllBulkRawMaterialPORequest,
  getAllBulkRawMaterialPOSuccess } from '@/app/Actions/bulkRawMaterialPOActions';

import { items } from '@/app/utils/sidebarItems';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import ViewBulkRawMaterialPOTable from '@/app/components/ViewBulkRawMaterialPOTable/ViewBulkRawMaterialPOTable';
import PageTitle from '@/app/components/PageTitle/PageTitle';

const page = () => {
  const dispatch = useDispatch();



  const getAllBulkRawMaterialPO = async () => {
    try {
      dispatch(getAllBulkRawMaterialPORequest());
      const response = await bulkRawMaterialPOServices.getAllBulkRawMaterialPO();
      
      if (response.success === true) {
        dispatch(getAllBulkRawMaterialPOSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllBulkRawMaterialPO();
  });

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <PageTitle pageTitle={'View Bulk Raw Material PO'} />
        <div className="mt-[0.3vw]  scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <ViewBulkRawMaterialPOTable />
        </div>
      </div>
    </div>
  );
};

export default page;
