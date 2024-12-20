'use client';
import React, { useState } from 'react';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import AmountBlockedAtStorageInventory from '@/app/components/AmountBlockedAtStorageInventory/AmountBlockedAtStorageInventory'


const Page = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[23vw] h-full bg-gray-800">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] h-full overflow-y-auto p-4">
        <PageTitle pageTitle={'Amount blocked at Storage Inventory'} /> 

        <div className="mt-4">
          <AmountBlockedAtStorageInventory />
        </div>
      </div>

      


    </div>
  );
};

export default Page;
