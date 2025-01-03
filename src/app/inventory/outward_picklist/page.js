'use client';
import React, { useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllPickListFailure,
  getAllPickListRequest,
  getAllPickListSuccess,
} from '../../Actions/pickListActions';
import UpdatePickListTable from '@/app/components/UpdatePickListTable/UpdatePickListTable';
import { pickListServices } from '@/app/services/pickListService';
import PageTitle from '@/app/components/PageTitle/PageTitle';

const page = () => {
  const dispatch = useDispatch();

  const getPickList = async () => {
    try {
      dispatch(getAllPickListRequest());

      const response = await pickListServices.getAllPickList();
      if (response.success === true) {
        dispatch(getAllPickListSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPickList();
  }, []);

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Outward Pick List'} />
        </div>
        <div className="mt-[0.3vw]  scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <UpdatePickListTable />
        </div>
      </div>
    </div>
  );
};

export default page;
