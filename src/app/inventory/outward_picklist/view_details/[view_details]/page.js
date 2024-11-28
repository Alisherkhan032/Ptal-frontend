'use client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPickListByIdRequest, getPickListByIdSuccess, getPickListByIdFailure } from '../../../../Actions/pickListActions';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import { pickListServices } from '@/app/services/pickListService';
import moment from 'moment';
import 'tailwindcss/tailwind.css';

const Page = ({ params }) => {
  const { pickListDetail } = useSelector((state) => state.pickList);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPickListById = async () => {
      try {
        dispatch(getPickListByIdRequest());
        const response = await pickListServices.getPickListById(params.view_details);
        if (response.success === true) {
          dispatch(getPickListByIdSuccess(response.data));
        }
      } catch (err) {
        dispatch(getPickListByIdFailure(err));
      }
    };

    getPickListById();
  }, [params.view_details]);

  if (!pickListDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full h-screen flex-row gap-4 bg-white">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw]">
        <div>
          <PageTitle pageTitle={'View Picklist:'} paramsData={params.view_details} />
        </div>

        <div className="mt-[0.3vw] p-4 scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw] overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <div className="p-4 rounded-lg shadow-md border-[0.15vw] border-dashed border-gray-400 bg-white">
            <h2 className="text-lg font-semibold text-[hsl(36,12%,55%)]">Picklist ID: {pickListDetail.pickListumber}</h2>
            <p className="text-[hsl(36,12%,55%)]">Created By: {pickListDetail.createdBy?.firstName} {pickListDetail.createdBy?.lastName}</p>
            <p className="text-[hsl(36,12%,55%)]">Created At: {pickListDetail.createdAt ? moment(pickListDetail.createdAt).format('MMMM DD YYYY, hh:mm:ss') : 'N/A'}</p>
            <p className="text-[hsl(36,12%,55%)]">Updated By: {pickListDetail.fulfilledBy?.firstName} {pickListDetail.fulfilledBy?.lastName}</p>
            <p className="text-[hsl(36,12%,55%)]">Updated At: {pickListDetail.createdAt ? moment(pickListDetail.updatedAt).format('MMMM DD YYYY, hh:mm:ss') : 'N/A'}</p>
            <p className="text-[hsl(36,12%,55%)]">Status: {pickListDetail.status}</p>

            <div className="mt-4"></div>

            {pickListDetail.orderIds && (
              <div className="mb-8">
                <h3 className="text-md font-medium text-[hsl(36,12%,55%)]">Orders processed in this picklist : </h3>
                <table className="w-full mt-4 text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:text-gray-400 border-b-[0.15vw] border-dashed border-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">Order ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickListDetail.orderIds.map((orderId, index) => (
                      <tr key={index} className="bg-white border-b-[0.15vw] border-dashed border-gray-400 dark:border-gray-700">
                        <td className="px-6 py-4 text-[hsl(36,12%,55%)]">{orderId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {pickListDetail.skus && (
              <div className="mb-8">
                <h3 className="text-md font-medium text-[hsl(36,12%,55%)]">Combined SKUs from all orders :</h3>
                <table className="w-full mt-4 text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:text-gray-400 border-b-[0.15vw] border-dashed border-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">SKU Code</th>
                      <th scope="col" className="px-6 py-3">Total Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickListDetail.skus.map((sku, index) => (
                      <tr key={index} className="bg-white border-b-[0.15vw] border-dashed border-gray-400 dark:border-gray-700">
                        <td className="px-6 py-4 text-[hsl(36,12%,55%)]">{sku.skuCode}</td>
                        <td className="px-6 py-4 text-[hsl(36,12%,55%)]">{sku.totalQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {pickListDetail.fulfillPickListQrCodes && (
              <div>
                <h3 className="text-md font-medium text-[hsl(36,12%,55%)]">Fulfilled QR Codes :</h3>
                <table className="w-full mt-4 text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:text-gray-400 border-b-[0.15vw] border-dashed border-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">SKU Code</th>
                      <th scope="col" className="px-6 py-3">QR Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickListDetail.fulfillPickListQrCodes.map((qrCode, index) => (
                      <tr key={index} className="bg-white border-b-[0.15vw] border-dashed border-gray-400 dark:border-gray-700">
                        <td className="px-6 py-4 text-[hsl(36,12%,55%)]">{qrCode.skuCode}</td>
                        <td className="px-6 py-4 text-[hsl(36,12%,55%)]">{qrCode.qrCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
