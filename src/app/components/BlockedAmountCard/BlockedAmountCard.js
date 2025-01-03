'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBlockedAmounts } from "../../services/blockedAmountService";

const BlockedAmountCard = () => {
  // State to hold the blocked amount data from the API
  const [blockedAmountData, setBlockedAmountData] = useState([
    {
      amount: '₹ 0.00',
      currency: 'lakhs',
      label: 'Amount Blocked by Inventory',
      link: '#',
    },
    {
      amount: '₹ 0.00',
      currency: 'lakhs',
      label: 'Amount Blocked by Raw Material',
      link: '#',
    },
    {
      amount: '₹ 0.00',
      currency: 'lakhs',
      label: 'Amount Blocked by PKG Material',
      link: '#',
    },
    {
      amount: '₹ 0.00',
      currency: 'lakhs',
      label: 'Amount Blocked by Virtual Warehouse',
      link: '#',
    },
    {
      amount: '₹ 0.00',
      currency: 'crores',
      label: 'Amount Blocked by Amazon FBA',
      link: '#',
    }
  ]);

  const formatAmount = (amount) => {
    if (amount >= 1e7) { // 1 crore = 10^7
      return `${(amount / 1e7).toFixed(2)}`;
    } else if (amount >= 1e5) { // 1 lakh = 10^5
      return `${(amount / 1e5).toFixed(2)}`;
    } else {
      return `₹ ${amount.toFixed(2)}`; // Less than a lakh, keep as is
    }
  };

  useEffect(() => {
    // Fetch the blocked amounts from the API using the service
    const fetchAmounts = async () => {
      try {
        const data = await fetchBlockedAmounts(); // Use the service to get the data
        console.log('Blocked Amounts:', data);
        setBlockedAmountData([
          {
            amount: formatAmount(data.productInventorySum || 0),
            currency: data.productInventorySum >= 1e7 ? 'crores' : 'lakhs', // Dynamic currency
            label: 'Amount Blocked at Product Inventory',
            link: '/blockedAmount/productInventory',
          },
          {
            amount: formatAmount(data.storageInventorySum || 0),
            currency: data.storageInventorySum >= 1e7 ? 'crores' : 'lakhs', // Dynamic currency
            label: 'Amount Blocked at Storage Inventory',
            link: '/blockedAmount/storageInventory',
          },
          {
            amount: '₹ 0.00', // Adjust based on your actual data structure
            currency: 'lakhs',
            label: 'Amount Blocked by PKG Material',
            link: '#',
          },
          {
            amount: '₹ 0.00', // Adjust based on your actual data structure
            currency: 'lakhs',
            label: 'Amount Blocked by Virtual Warehouse',
            link: '#',
          },
          {
            amount: '₹ 0.00', // Adjust based on your actual data structure
            currency: 'crores',
            label: 'Amount Blocked by Amazon FBA',
            link: '#',
          },
        ]);
      } catch (error) {
        console.error('Error fetching blocked amounts:', error);
      }
    };

    fetchAmounts(); // Call the function to fetch data
  }, []); // Empty dependency array means it runs once when the component mounts

  return (
    <div className="bg-white rounded-lg shadow-md p-4 gap-y-6 gap-x-8 mt-2 flex items-center flex-wrap">
      {/* Common Block: Amount Blocked at */}
      <div className="text-center flex flex-col">
        <div className="flex items-end">
          <p className="text-2xl font-bold text-gray-800">₹</p>
          <p className="text-sm font-semibold text-gray-500">crores</p>
        </div>
        <div>
          <span className="font-medium text-[1.1vw] text-gray-400">Amount Blocked at</span>
        </div>
      </div>

      {/* Dynamically render blocks */}
      {blockedAmountData.map((block, index) => (
        <div key={index} className="text-center flex flex-col">
          <div className="flex items-end gap-x-2">
            <p className="text-2xl font-bold text-gray-800">{block.amount}</p>
            <p className="text-sm font-semibold text-gray-400">{block.currency}</p>
          </div>
          <div>
            <Link href={block.link} target="_blank" rel="noopener noreferrer">
              <span className="font-medium text-[1.1vw] text-[#4FC9DA] hover:text-[#45aab8]">{block.label}</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockedAmountCard;
