'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { items } from '@/app/utils/sidebarItems';
import EngravingInventoryLevel from '@/app/components/EngravingInventoryLevel/EngravingInventoryLevel';
import PageTitle from '@/app/components/PageTitle/PageTitle';

const page = () => {

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Engraving Inventory Level'} />
        </div>

        <div className="mt-[0.3vw] scrollWidth overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <EngravingInventoryLevel />
        </div>
      </div>
    </div>
  );
};

export default page;
