'use client';
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import InwardTeamRawProductTable  from '@/app/components/InwardTeamRawProductTable/RawProductsInwardedTable';


const Page = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col w-[77vw] h-full overflow-y-auto p-4">
        <PageTitle pageTitle={'Raw Products Inwarded'} />

        <div className="mt-4">
          <InwardTeamRawProductTable />
        </div>
      </div>
    </div>
  );
};

export default Page;
