'use client';
import React, { useState, useEffect } from 'react';
import TeamProductFlowCard from '../TeamProductFlowCard/TeamProductFlowCard';
import { transactionService } from '@/app/services/transactionService';


const QualityTeamProductFlowCard = ({ dateRange }) => {
const { fromDate, toDate } = dateRange;
const team = 'quality team';
const [qualityTeamData, setQualityTeamData] = useState([]);

const getAllMaterial = async () => {
  try {
    // Call the service to fetch transactions
    const response = await transactionService.getTransactions(fromDate, toDate, team);

    if (response.success === true) {
      const transactions = response.data;

      console.log('Filtered transactions of testing :', transactions);

      // Initialize counters for different categories
      let rawMaterialCount = 0;
      let pkgMaterialCount = 0;

      // Count products in each category from the filtered data
      if (transactions && Array.isArray(transactions) && transactions.length > 0) {
        // Count products in each category from the filtered data
        transactions.forEach((transaction) => {
          if (
            transaction.rawMaterial &&
            transaction.rawMaterial.material_category_id &&
            transaction.rawMaterial.material_category_id.category_name === 'Raw Material'
          ) {
            rawMaterialCount++;
          } else if (
            transaction.rawMaterial &&
            transaction.rawMaterial.material_category_id &&
            transaction.rawMaterial.material_category_id.category_name === 'Packaging Material'
          ) {
            pkgMaterialCount++;
          }
        });
      }

      // Prepare the data for the inward team flow card
      const testedData = [
        {
          numberOfProduct: rawMaterialCount,
          link: `/qualityTable/raw-products?fromDate=${fromDate}&toDate=${toDate}&team=${team}`,
          linkName: 'Raw Product Tested',
          startDate: fromDate,
          endDate: toDate,
        },
        {
          numberOfProduct: pkgMaterialCount,
          link: `/qualityTable/pkg-products?fromDate=${fromDate}&toDate=${toDate}&team=${team}`,
          linkName: 'PKG Product Tested',
          startDate: fromDate,
          endDate: toDate,
        },
      ];
      

      setQualityTeamData(testedData);
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
    <TeamProductFlowCard teamName="Quality Team" productFlows={qualityTeamData} />
  );
};

export default QualityTeamProductFlowCard;
