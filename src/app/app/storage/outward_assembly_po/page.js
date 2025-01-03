'use client';
import React, { useEffect } from 'react';
import { assemblyPOServices } from '@/app/services/assemblyPO';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllAssemblyPoRequest,
  getAllAssemblyPoSuccess,
} from '../../Actions/assemblyPoActions';
import { items } from '@/app/utils/sidebarItems';
import StatusBar from "@/app/components/StatusBar/StatusBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import InwardAssemblyPoTable from '@/app/components/InwardAssemblyPoTable/InwardAssemblyPoTable';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import NavigationBar from '@/app/components/NavigationBar/NavigationBar';

const page = () => {
  const dispatch = useDispatch();

  const getAllAssemblyPo = async () => {
    try {
      dispatch(getAllAssemblyPoRequest());
      const response = await assemblyPOServices.getAllAssemblyPo();
      if (response.success === true) {
        dispatch(getAllAssemblyPoSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllAssemblyPo();
  }, []);

  const { allAssemblyPO } = useSelector(
    (state) => state.assemblyPO
  );

  const calculateStatusBarData = (allMaterials) => {
    let underStockCount = 0;
    let overStockCount = 0;

    allMaterials.forEach((po) => {
      const { current_stock, lower_threshold, upper_threshold } = po.raw_material_id;
      if (current_stock < lower_threshold) underStockCount++;
      if (current_stock > upper_threshold) overStockCount++;
    });

    return [
      { value: overStockCount, heading: "Items with Over Stock" },
      { value: underStockCount, heading: "Items with Under Stock" },
    ];
  };

  const statusBarData = calculateStatusBarData(allAssemblyPO);

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
          <InwardAssemblyPoTable />
        </div>
      </div>
    </div>
  </div>
  );
};

export default page;
