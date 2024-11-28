// form to create product PO
import Sidebar from '@/app/components/Sidebar/Sidebar';
import RaiseMaterialPOForm from '@/app/components/RaiseMaterialPOForm/RaiseMaterialPOForm';
import { items } from '@/app/utils/sidebarItems';
import PageTitle from '@/app/components/PageTitle/PageTitle';
const page = () => {
  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Raise Semi-Finished Goods PO'} />
        </div>
        <span className="mt-[1.2vw] text-[1.4vw] font-semibold"></span>
        <div className="mt-[0.3vw]">
          <RaiseMaterialPOForm />
        </div>
      </div>
    </div>
  );
};

export default page;
