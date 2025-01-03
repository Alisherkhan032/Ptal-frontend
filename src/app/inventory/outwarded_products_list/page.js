'use client';
import React, { useEffect, useState } from 'react';
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
import TitleBar from "@/app/components/TitleBar/TitleBar";
import NavigationBar from "@/app/components/NavigationBar/NavigationBar";


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

  const { allOutwardedProducts } = useSelector((state) => state.outwardedProducts);

  const generateNavItems = () => {
      const inventoryTeam = items.find((item) => item.label === "Inventory");
  
      if (inventoryTeam && inventoryTeam.subItems) {
        return inventoryTeam.subItems.map((subItem) => ({
          name: subItem?.label,
          path: subItem?.path,
          icon: subItem?.iconKey,
        }));
      }
  
      return [];
    };
  
    const navItems = generateNavItems();

    return (
      <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
        <div className="relative z-10 flex flex-col items-center overflow-scroll scrollbar-none px-4 py-2">
          <div className="w-full max-w-full mb-4">
            <TitleBar title="Inventory"  />
          </div>
  
          <div className="w-full max-w-full mb-5">
            <NavigationBar navItems={navItems} />
          </div>
  
          <div className="flex w-full max-w-full mb-6 scrollbar-none">
            <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
              <OutwardedProductsTable />
            </div>
          </div>
        </div>
  
      </div>
    );
};

export default page;
