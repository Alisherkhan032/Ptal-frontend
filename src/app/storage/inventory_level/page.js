'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { rawMaterialServices } from '../../services/rawMaterialService';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllMaterialRequest,
  getAllMaterialSuccess,
  getAllMaterialFailure,
} from '../../Actions/materialActions';
import InventoryLevelTable from '@/app/components/InventoryLevelTable/InventoryLevelTable';
import { items } from '@/app/utils/sidebarItems';
import PageTitle from '@/app/components/PageTitle/PageTitle';

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

  return (
    <div className="flex w-full h-screen eflex-row gap-4">
      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Storage Inventory Level'} />
        </div>

        <div className="mt-[0.3vw] scrollWidth overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <InventoryLevelTable />
        </div>
      </div>
    </div>
  );
};

export default page;
