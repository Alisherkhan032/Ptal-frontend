'use client';
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import AmountBlockedAtProductInventory from '@/app/components/AmountBlockedAtProductInventory/AmountBlockedAtProductInventory'


const Page = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col w-[77vw] h-full overflow-y-auto p-4">
        <PageTitle pageTitle={'Amount blocked at Product Inventory'} /> 

        <div className="mt-4">
          <AmountBlockedAtProductInventory />
        </div>
      </div>
    </div>
  );
};

export default Page;
