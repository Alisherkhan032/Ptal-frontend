'use client';
import React, { useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';

import { useDispatch, useSelector } from 'react-redux';
import InwardRTO from '@/app/components/InwardRTO/InwardRTO';
import PageTitle from '@/app/components/PageTitle/PageTitle';

const page = () => {
  

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Inward RTO Order'} />
        </div>
        <div className="mt-[0.3vw]  scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <InwardRTO />
        </div>
      </div>
    </div>
  );
};

export default page;
