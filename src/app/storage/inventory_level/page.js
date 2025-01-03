'use client';
import React, { useState, useEffect } from 'react';
import { rawMaterialServices } from '../../services/rawMaterialService';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllMaterialRequest,
  getAllMaterialSuccess,
} from '../../Actions/materialActions';
import InventoryLevelTable from '@/app/components/InventoryLevelTable/InventoryLevelTable';
import NavigationBar from '@/app/components/NavigationBar/NavigationBar';
import { items } from '@/app/utils/sidebarItems';
import StatusBar from "@/app/components/StatusBar/StatusBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";

const page = () => {
  const dispatch = useDispatch();

  const getAllMaterial = async () => {
    try {
      dispatch(getAllMaterialRequest());
      const response = await rawMaterialServices.getAllRawMaterials();
      if (response.success === true) {
        dispatch(getAllMaterialSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllMaterial();
  }, []);

  const { allMaterials } = useSelector((state) => state.material);
  console.log(allMaterials[1]);
  
  const calculateStatusBarData = (allMaterials) => {
    let underStockCount = 0;
    let overStockCount = 0;
    let rawMaterials = 0;
    let packagingMaterials = 0;

    allMaterials.forEach((po) => {
      const { current_stock, lower_threshold, upper_threshold } = po;
      const category = po?.material_category_id?.category_name;
      if (current_stock < lower_threshold) underStockCount++;
      if (current_stock > upper_threshold) overStockCount++;
      if (category === "Raw Material") rawMaterials++;
      if (category === "Packaging Material") packagingMaterials++;
    });

    return [
      { value: overStockCount, heading: "Items with Over Stock" },
      { value: underStockCount, heading: "Items with Under Stock" },
      { value: rawMaterials, heading: "Raw Materials" },
      { value: packagingMaterials, heading: "Packaging Materials" },
    ];
  };

  const statusBarData = calculateStatusBarData(allMaterials);

  const generateNavItems = () => {
    
    const storageTeam = items.find(item => item.label === "Storage");
  
    if (storageTeam && storageTeam.subItems) {
      return storageTeam.subItems.map(subItem => ({
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
        <TitleBar title="Storage"  />
      </div>

      <div className="w-full max-w-full mb-5">
        <StatusBar data={statusBarData} />
      </div>

      <div className='w-full max-w-full mb-5'>
      <NavigationBar navItems={navItems} />
      </div>

      <div className="flex w-full max-w-full mb-6 scrollbar-none">
        <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
          <InventoryLevelTable />
        </div>
      </div>
    </div>
  </div>
  );
};

export default page;
