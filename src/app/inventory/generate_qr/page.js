// form to create product PO
import Sidebar from "@/app/components/Sidebar/Sidebar";
import { items } from "@/app/utils/sidebarItems";
import GenerateQrForm from "@/app/components/GenerateQrForm/GenerateQrForm";

const page = () => {
  return (
    <div className="flex w-full h-screen  flex-row gap-4">
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div className="flex leading-tight mt-[2.5vw] flex-col">
          <span className="font-semibold text-[1.6vw] ">Fillflow Portal</span>
          <span className="text-[1.1vw] font-medium text-[rgb(181,176,161)]">
            A inventory management system
          </span>
        </div>
        <span className="mt-[1.2vw] text-[1.4vw] font-semibold">
          Generate QR Code
        </span>
        <div className="mt-[0.3vw]">
          <GenerateQrForm />
        </div>
      </div>
    </div>
  );
};

export default page;
