'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { poServices } from '../../services/poService';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllPoRequest,
  getAllPoSuccess,
  getAllPoFailure,
} from '../../Actions/poActions';
import InwardProcurementPOTable from '@/app/components/InwardProcurementPOTable/InwardProcurementPOTable';
import './page.css';
import { items } from '@/app/utils/sidebarItems';
import PageTitle from '@/app/components/PageTitle/PageTitle';

const page = () => {
  const dispatch = useDispatch();

  const getAllPos = async () => {
    try {
      dispatch(getAllPoRequest());
      const response = await poServices.getAllPo();
      if (response.success === true) {
        dispatch(getAllPoSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllPos();
  }, []);

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Inward procurement PO'} />
        </div>

        <div className="scrollWidth mt-[0.3vw] w-[74vw]  min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <InwardProcurementPOTable />
        </div>
      </div>
    </div>
  );
};

export default page;
