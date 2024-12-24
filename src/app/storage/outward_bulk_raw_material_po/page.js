'use client';
import React, { use, useEffect } from 'react';
import { bulkRawMaterialPOServices } from '@/app/services/bulkRawMaterialPOService';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBulkRawMaterialPOFailure,
  getAllBulkRawMaterialPORequest,
  getAllBulkRawMaterialPOSuccess } from '@/app/Actions/bulkRawMaterialPOActions';
import { items } from '@/app/utils/sidebarItems';
import StatusBar from "@/app/components/StatusBar/StatusBar";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import OutwardBulkRawMaterialPoTable from '@/app/components/OutwardBulkRawMaterialPoTable/OutwardBulkRawMaterialPoTable';
import NavigationBar from '@/app/components/NavigationBar/NavigationBar';

const page = () => {
  const dispatch = useDispatch();

  const getAllBulkRawMaterialPO = async () => {
    try {
      dispatch(getAllBulkRawMaterialPORequest());
      const response = await bulkRawMaterialPOServices.getAllBulkRawMaterialPO();
      
      if (response.success === true) {
        dispatch(getAllBulkRawMaterialPOSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllBulkRawMaterialPO();
  }, []);

  const { allBulkRawMaterialPO, loading, error } = useSelector(
    (state) => state.bulkRawMaterialPO
  );

  const calculateStatusBarData = (allBulkRawMaterialPO) => {
    let underStockCount = 0;
    let overStockCount = 0;

    allBulkRawMaterialPO.forEach((po) => {
      const { current_stock, lower_threshold, upper_threshold } = po.raw_material_id;
      if (current_stock < lower_threshold) underStockCount++;
      if (current_stock > upper_threshold) overStockCount++;
    });

    return [
      { value: overStockCount, heading: "Items with Over Stock" },
      { value: underStockCount, heading: "Items with Under Stock" },
    ];
  };

  const statusBarData = calculateStatusBarData(allBulkRawMaterialPO);

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
          <OutwardBulkRawMaterialPoTable />
        </div>
      </div>
    </div>
  </div>
  );
};

export default page;
