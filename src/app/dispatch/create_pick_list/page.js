'use client';
import React, { useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import OrderTable from '@/app/components/OrderTable/OrderTable';
import { orderServices } from '@/app/services/oderService';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllOpenOrdersRequest,
  getAllOpenOrdersSuccess,
  getAllOpenOrdersFailure,
} from '../../Actions/orderActions';
import PickListTable from '@/app/components/PickListTable/PickListTable';
import PageTitle from '@/app/components/PageTitle/PageTitle';

const page = () => {
  const dispatch = useDispatch();

  const getAllOpenOrders = async () => {
    try {
      dispatch(getAllOpenOrdersRequest());
      console.log('called==');
      const response = await orderServices.getAllOpenOrders();
      if (response.success === true) {
        dispatch(getAllOpenOrdersSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllOpenOrders();
  }, []);

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Create Pick List'} />
        </div>
        <div className="mt-[0.3vw]  scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <PickListTable />
        </div>
      </div>
    </div>
  );
};

export default page;
