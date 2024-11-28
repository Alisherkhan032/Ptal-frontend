'use client';
import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { setToken } from '../../Actions/authActions';
import { persistor } from '@/app/store';

const PageTitle = ({ pageTitle, paramsData }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(setToken(null));
    localStorage.removeItem('x-access-token');
    deleteCookie('x-access-token');
    // router.replace('/login');
    //window.location.reload();
    persistor.purge()
    localStorage.removeItem("persist:root");
    router.replace('/login');
    
  };

  return (
    <div className="flex flex-col gap-1 h-auto">
      <div className=" flex justify-between items-center">
        {/* <div className="flex  leading-tight mt-[2.5vw] flex-col">
          <span className="font-semibold text-[1.6vw]">Fillflow Portal</span>
          <span className="text-[1.1vw] font-medium text-[rgb(181,176,161)]">
            An inventory management system
          </span>
        </div> */}
        {/* logout button */}
        <div className=" flex items-center">
          <a
            href="#_"
            onClick={handleLogout}
            class="px-5 mt-[2.5vw] mr-[2vw] py-2 relative rounded group overflow-hidden font-medium bg-[rgb(17,141,255,0.5)] text-purple-600 inline-block"
          >
            <span class="absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-[rgb(17,141,255)] group-hover:h-full opacity-90"></span>
            <span class="relative text-sm text-white font-semibold group-hover:text-white">
              Logout
            </span>
          </a>
        </div>
      </div>

      <span className="mt-[1.2vw] text-[1.4vw] font-semibold">
        {pageTitle} {paramsData}
      </span>
    </div>
  );
};

export default PageTitle;
