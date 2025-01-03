// form to create product PO
'use client';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import RaiseInventoryPOForm from '@/app/components/RaiseInventoryPOForm/RaiseInventoryPOForm';
import TitleBar from "@/app/components/TitleBar/TitleBar";
import StatusBar from "@/app/components/StatusBar/StatusBar";


const page = () => {
  // const { allCategories, selectedCatId } = useSelector(
  //   (state) => state.category
  // );
  // console.log('allCategories from inventory level page', allCategories);
  return (
    <div className="flex w-full h-screen text-black flex-row gap-4">
      <div className="flex flex-col w-[77vw] ">
        <div className="mt-[0.3vw]">
          <RaiseInventoryPOForm />
        </div>
      </div>
    </div>
  );
};

export default page;
