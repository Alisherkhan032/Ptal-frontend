'use client';
import React, { useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import OrderTable from '@/app/components/OrderTable/OrderTable';
import { orderServices } from '@/app/services/oderService';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllAmazonOrdersRequest,
  getAllAmazonOrdersSuccess,
  getAllAmazonOrdersFailure,
} from '../../Actions/orderActions';
import PageTitle from '@/app/components/PageTitle/PageTitle';

const page = () => {
  const dispatch = useDispatch();

  const getAllOrders = async () => {
    try {
      dispatch(getAllAmazonOrdersRequest());
      console.log('called==');
      const response = await orderServices.getAllOrders();
      if (response.success === true) {
        dispatch(getAllAmazonOrdersSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Inward Order List'} />
        </div>
        <div className="mt-[0.3vw]  scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <OrderTable />
        </div>
      </div>
    </div>
  );
};

export default page;
