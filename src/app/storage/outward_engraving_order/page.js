'use client';
import React, { useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import OutwardEngravingOrderRawMaterial from '@/app/components/OutwardEngravingOrderRawMaterial/OutwardEngravingOrderRawMaterial';
import { engravingOrderServices } from '@/app/services/engravingOrderService';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllEngravingOrdersRequest,
    getAllEngravingOrdersSuccess,
    getAllEngravingOrdersFailure,
} from '../../Actions/engravingOrderActions';
import PageTitle from '@/app/components/PageTitle/PageTitle';

const page = () => {
  const dispatch = useDispatch();

  const getAllEngravingOrders = async () => {
    try {
      dispatch(getAllEngravingOrdersRequest());

      const response = await engravingOrderServices.getAllEngravingOrders();
      if (response.success === true) {
        dispatch(getAllEngravingOrdersSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllEngravingOrders();
  }, []);

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Outward Raw Material To Engraving Orders'} />
        </div>
        <div className="mt-[0.3vw]  scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <OutwardEngravingOrderRawMaterial />
        </div>
      </div>
    </div>
  );
};

export default page;
