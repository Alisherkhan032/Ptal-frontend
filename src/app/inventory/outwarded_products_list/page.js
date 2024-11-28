'use client';
import React, { useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import OutwardedProductsTable from '@/app/components/OutwardedProductsTable/OutwardedProductsTable';
import { outwardedProductsService } from '@/app/services/outwardedProductsService';
import {
  getAllOutwardedProductsFailure,
  getAllOutwardedProductsRequest,
  getAllOutwardedProductsSuccess
} from '../../Actions/outwardedProductsActions';


const page = () => {
 

  const dispatch = useDispatch();

  const getAllOutwardedProducts = async () => {
    try {
      dispatch(getAllOutwardedProductsRequest());
      const response = await outwardedProductsService.getAllOutwardedProducts();
      if (response.success === true) {
        dispatch(getAllOutwardedProductsSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllOutwardedProducts();
  }, []);

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'View Outwarded Product Details'} />
        </div>
        <div className="mt-[0.3vw]  scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
        <OutwardedProductsTable />
        </div>
      </div>
    </div>
  );
};

export default page;
