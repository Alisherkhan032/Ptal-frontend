'use client'
import React, { useEffect, useState } from 'react';
import { pickListServices } from '@/app/services/pickListService'; // Adjust import paths as per your project structure
import { useRouter, useSearchParams } from 'next/navigation'; // Use next/navigation
import Sidebar from '@/app/components/Sidebar/Sidebar';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import { items } from '@/app/utils/sidebarItems';

const MultiplePicklistsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ids, setIds] = useState([]);
  const [picklists, setPicklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skuMap, setSkuMap] = useState({});
  const [pickListIDArray, setPickListIDArray] = useState('');

  useEffect(() => {
    const queryIds = searchParams.get('ids');
    if (queryIds) {
      const idArray = queryIds.split(',');
      setIds(idArray);
    } else {
      setLoading(false); // No ids to fetch
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchPicklists = async () => {
      if (ids.length > 0) {
        try {
          setLoading(true); // Start loading
          const promises = ids.map(id => pickListServices.getPickListById(id));
          const responses = await Promise.all(promises);
          const picklistsData = responses.map(response => response.data);

          setPicklists(picklistsData);

          const skuTempMap = {};
          picklistsData.forEach(picklist => {
            if (picklist.status === 'fulfilled') {
              picklist.skus.forEach(sku => {
                if (skuTempMap[sku.skuCode]) {
                  skuTempMap[sku.skuCode] += sku.totalQuantity;
                } else {
                  skuTempMap[sku.skuCode] = sku.totalQuantity;
                }
              });
            }
          });
          setSkuMap(skuTempMap);

          // Update pickListIDArray with fulfilled picklist IDs
          const fulfilledPicklists = picklistsData.filter(picklist => picklist.status === 'fulfilled');
          
          const idArray = fulfilledPicklists.map(picklist => picklist.pickListumber).join(', ');
          
          setPickListIDArray(idArray);

        } catch (error) {
          console.error('Error fetching picklists:', error);
          // Handle error as per your application's needs
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };

    fetchPicklists();
  }, [ids]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!picklists.length) {
    return <div>No fulfilled picklists found</div>;
  }

  return (
    <div className="flex w-full h-screen flex-row gap-4 bg-white">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw]">
        <div>
          <PageTitle pageTitle={'View Selected Fulfilled Picklist Data '} />
        </div>

        <div className="mt-[0.3vw] p-4 scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw] overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <h2 className="text-lg font-semibold text-[hsl(36,12%,55%)] mb-4">Fulfilled Picklist IDs: {pickListIDArray}</h2>
          <h3 className="text-lg font-semibold text-[hsl(36,12%,55%)] mb-4">Sku Codes Summary </h3>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm leading-4 font-semibold text-gray-600 uppercase tracking-wider">
                  SKU Code
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm leading-4 font-semibold text-gray-600 uppercase tracking-wider">
                  Total Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(skuMap).map(skuCode => (
                <tr key={skuCode}>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm">
                    {skuCode}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm">
                    {skuMap[skuCode]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      </div>
    </div>
  );
};

export default MultiplePicklistsPage;
