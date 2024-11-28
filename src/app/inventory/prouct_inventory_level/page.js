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
import PageTitle from '@/app/components/PageTitle/PageTitle';

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

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Product Inventory Level'} />
        </div>

        <div className="mt-[0.3vw] scrollWidth overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <ProductLevelTable />
        </div>
      </div>
    </div>
  );
};

export default page;
