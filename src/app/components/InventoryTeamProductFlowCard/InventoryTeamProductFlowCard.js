'use client';
import React, { useState, useEffect } from 'react';
import TeamProductFlowCard from '../TeamProductFlowCard/TeamProductFlowCard';
import { transactionService } from '@/app/services/transactionService';


const InventoryTeamProductFlowCard = ({ dateRange }) => {
const { fromDate, toDate } = dateRange;
const team = 'inventory team';
const [inventoryTeamData, setInventoryTeamData] = useState([]);

// Fetch and filter data based on date range and team
const getAllMaterial = async () => {
  try {
    // Call the service to fetch transactions
    const response = await transactionService.getTransactions(fromDate, toDate, team);

    if (response.success === true) {
      const transactions = response.data;

      console.log('🚀😂😂😂😂Filtered transactions:', transactions);

      const inwardCount = transactions.filter(txn => txn.transactionType === 'inward').length;
      const outwardCount = transactions.filter(txn => txn.transactionType === 'outward').length;

      // Prepare the data for the iqnventory team flow card
      const productData = [
        {
        //   numberOfProduct: rawMaterialCount,
            numberOfProduct: inwardCount,
            link: `/inventoryTable/InwardProducts?fromDate=${fromDate}&toDate=${toDate}&team=${team}`,
            linkName: 'Total items Inwarded',
            startDate: fromDate,
            endDate: toDate,
        },
        {
          numberOfProduct: outwardCount,
          link: `/inventoryTable/OutwardProducts?fromDate=${fromDate}&toDate=${toDate}&team=${team}`,
          linkName: 'Total items Outwarded',
          startDate: fromDate,
          endDate: toDate,
        },
      ];
      setInventoryTeamData(productData);
    } else {
      console.log('No transactions found');
    }
  } catch (err) {
    console.error('Error fetching filtered transactions:', err);
  }
};

useEffect(() => {
  getAllMaterial();
}, [fromDate, toDate]);

  return (
    <div className="flex justify-center items-center">
      {/* Pass the fetched data to TeamProductFlowCard */}
      <TeamProductFlowCard
        teamName="Inventory Team"
        productFlows={inventoryTeamData} // Pass the filtered product data
      />
    </div>
  );
};

export default InventoryTeamProductFlowCard;
  