'use client';
import React, { useState, useEffect } from 'react';
import TeamProductFlowCard from '../TeamProductFlowCard/TeamProductFlowCard';
import { transactionService } from '@/app/services/transactionService';

const StorageTeamProductFlowCard = ({ dateRange }) => {

  const { fromDate, toDate } = dateRange;
  const team = 'storage team';
  const [storageTeamData, setStorageTeamData] = useState([]);

  const getAllMaterial = async () => {
    try {
      const response = await transactionService.getTransactions(fromDate, toDate, team);

      if (response.success === true) {
        const transactions = response.data;

      // console.log('Filtered transactions:', transactions);

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

        const storageTeamData = [
          {
            numberOfProduct: rawMaterialCount,
            link: `/storage/raw_products_page?fromDate=${fromDate}&toDate=${toDate}&team=${team}`,
            linkName: "Raw Product Outwarded",
            startDate: fromDate,
            endDate: toDate,
          },
          {
            numberOfProduct: pkgMaterialCount,
            link: `/storage/pkg_products_page?fromDate=${fromDate}&toDate=${toDate}&team=${team}`,
            linkName: "PKG Product Outwarded",
            startDate: fromDate,
            endDate: toDate,
          },
        ];

        setStorageTeamData(storageTeamData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllMaterial();
  }, [fromDate, toDate]);

  return (
    <TeamProductFlowCard teamName="Storage Team" productFlows={storageTeamData} />
  );
};

export default StorageTeamProductFlowCard;
