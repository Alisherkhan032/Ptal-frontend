'use client';
import React, { useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import RTOOrderTable from '@/app/components/RTOOrderTable/RTOOrderTable';
import { rtoOrderService } from '@/app/services/rtoOrderService';
import {
    getAllRtoOrderRequest,
    getAllRtoOrderSuccess,
    getAllRtoOrderFailure
} from '../../Actions/rtoOrderActions';

const page = () => {
 

  const dispatch = useDispatch();

  const getAllRtoOrderDetails = async () => {
    try {
      dispatch(getAllRtoOrderRequest());
      const response = await rtoOrderService.getAllRTOOrders();
      if (response.success === true) {
        dispatch(getAllRtoOrderSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllRtoOrderDetails();
  }, []);

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'View Inwarded RTO Order Details'} />
        </div>
        <div className="mt-[0.3vw]  scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
        <RTOOrderTable />
        </div>
      </div>
    </div>
  );
};

export default page;
