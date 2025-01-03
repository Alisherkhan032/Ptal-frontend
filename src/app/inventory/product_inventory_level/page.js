'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllProductRequest,
  getAllProductSuccess,
  getAllProductFailure,
} from '../../Actions/productActions';
import { items } from '@/app/utils/sidebarItems';
import ProductLevelTable from '@/app/components/ProductLevelTable/ProductLevelTable';
import { productServices } from '@/app/services/productService';
import TitleBar from '@/app/components/TitleBar/TitleBar';
import StatusBar from '@/app/components/StatusBar/StatusBar';
import NavigationBar from  '@/app/components/NavigationBar/NavigationBar';

const page = () => {
  const dispatch = useDispatch();

  const getAllProducts = async () => {
    try {
      dispatch(getAllProductRequest());
      const response = await productServices.getAllProducts();
      if (response.success === true) {
        dispatch(getAllProductSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const { allProducts } = useSelector((state) => state.product);
  const calculateStatusBarData = (poData) => {
    let pendingCount = 0;
    let fulfilledCount = 0;
    let qcInfoAddedCount = 0;
    let underStockCount = 0;
    let overStockCount = 0;

    poData.forEach((po) => {
      const { current_stock, lower_threshold, upper_threshold } = po;
      if (current_stock < lower_threshold) underStockCount++;
      if (current_stock > upper_threshold) overStockCount++;
    });

    return [
      { value: overStockCount, heading: "Items with Over Stock" },
      { value: underStockCount, heading: "Items with Under Stock" },
    ];
  };

  const statusBarData = calculateStatusBarData(allProducts);

  const generateNavItems = () => {
      
      const inventoryTeam = items.find(item => item.label === "Inventory");
    
      if (inventoryTeam && inventoryTeam.subItems) {
        return inventoryTeam.subItems.map(subItem => ({
          name: subItem.label,
          path: subItem.path,
          icon: subItem.iconKey,
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
          <StatusBar data={statusBarData} />
        </div>

        <div className='w-full max-w-full mb-5'>
        <NavigationBar navItems={navItems} />
        </div>

        <div className="flex w-full max-w-full mb-6 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            <ProductLevelTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
