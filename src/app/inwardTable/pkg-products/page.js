'use client';
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import InwardTeamPackagingProductTable  from '@/app/components/InwardTeamPackagingProductTable/InwardTeamPackagingProductTable';


const Page = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[23vw] h-full bg-gray-800">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] h-full overflow-y-auto p-4">
        <PageTitle pageTitle={'PKG Products Inwarded'} />

        <div className="mt-4">
          <InwardTeamPackagingProductTable />
        </div>
      </div>
    </div>
  );
};

export default Page;
