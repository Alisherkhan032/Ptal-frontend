// form to create product PO
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { items } from '@/app/utils/sidebarItems';
import RaiseInventoryPOForm from '@/app/components/RaiseInventoryPOForm/RaiseInventoryPOForm';
import PageTitle from '@/app/components/PageTitle/PageTitle';

const page = () => {
  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Raise Inventory PO'} />
        </div>
        <div className="mt-[0.3vw]">
          <RaiseInventoryPOForm />
        </div>
      </div>
    </div>
  );
};

export default page;
