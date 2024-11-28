import React from 'react';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import CreateCustomOrderForm from '@/app/components/CreateCustomOrderForm/CreateCustomOrderForm';
import { items } from '@/app/utils/sidebarItems';



const page = () => {
  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col  w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Create Custom Order'} />
        </div>

        <div className="mt-[0.3vw]">
          <CreateCustomOrderForm />
        </div>
      </div>
    </div>
  );
};

export default page;
