'use client';
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import QualityTeamRawProductTestedTable  from '@/app/components/QualityTeamRawProductTestedTable/QualityTeamRawProductTestedTable';


const Page = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[23vw] h-full bg-gray-800">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] h-full overflow-y-auto p-4">
        <PageTitle pageTitle={'Raw Products Tested'} />

        <div className="mt-4">
          <QualityTeamRawProductTestedTable />
        </div>
      </div>
    </div>
  );
};

export default Page;
