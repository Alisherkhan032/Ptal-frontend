'use client';
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import BlockedAmountCard from '@/app/components/BlockedAmountCard/BlockedAmountCard';
import CalenderFilter from '@/app/components/CalenderFilter/CalenderFilter';
import ProductFlowCards from '@/app/components/ProductFlowCards/ProductFlowCards';
// import InventoryAgeingCard from '@/app/components/InventoryAgeingCard/InventoryAgeingCard';

const Page = () => {
  // Get the current date
  const currentDate = new Date();
  
  // Set the fromDate to 1 day before today
  const fromDate = new Date();
  fromDate.setDate(currentDate.getDate() - 1); // Subtract 1 day from current date
  const formattedFromDate = fromDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
  // Set the toDate as today's date
  const formattedToDate = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  const [dateRange, setDateRange] = useState({
    fromDate: formattedFromDate,
    toDate: formattedToDate
  });

  const handleDateFilterChange = (fromDate, toDate) => {
    setDateRange({ fromDate, toDate });
  };

  return (
    <div className="h-screen overflow-hidden">
      

      <div className="flex flex-col w-[77vw] h-full overflow-y-auto p-4">
        <PageTitle pageTitle={'Executive Dashboard'} />

        <div className="mt-4">
          <BlockedAmountCard />
          {/* Pass the onFilterChange function to CalenderFilter */}
          <CalenderFilter onFilterChange={handleDateFilterChange} />

          {/* Pass dateRange to ProductFlowCards */}
          <ProductFlowCards dateRange={dateRange} />
          
          {/* <InventoryAgeingCard /> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
