'use client';
import React, { useEffect, useState } from 'react';
import { items } from '@/app/utils/sidebarItems';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import CustomDatePicker from '@/app/components/DatePicker/DatePicker';
import { reportServices } from '@/app/services/reportService';
import Button from '@/app/components/Button/Button';
import dayjs from 'dayjs';
import ReportsTable from '@/app/components/ReportsTable/ReportsTable';

const page = () => {
  const options = [
    'Inventory Room Day Starting Count',
    'Storage Room Day Starting Count',
  ];
  const [selectedDate, setSelectedDate] = useState(
    dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  );
  const [selectedReportType, setSelectedReportType] = useState(null);
  console.log('selectedDate deafult===', selectedDate);
  const [reportsData, setReportsData] = useState([]);

  const handleDateChange = (newDate) => {
    // Set time to 00:00:00
    const adjustedDate = newDate.clone().startOf('day');
    const formattedDate = adjustedDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    console.log('adjustedDate===', adjustedDate);
    setSelectedDate(formattedDate);
    console.log('Selected Date:', formattedDate);
  };

  const handleDropDownChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedReportType(selectedValue);
  };

  const generateReport = async () => {
    let response;
    try {
      switch (selectedReportType) {
        case 'Storage Room Day Starting Count':
          console.log('called===');
          response = await reportServices.generateStorageRoomReport({
            reportDate: selectedDate,
          });
          console.log('response====', response);
          setReportsData(response); // Assuming response.data holds the necessary data
          break;
        case 'Inventory Room Day Starting Count':
          response = await reportServices.generateInventoryRoomReport({
            reportDate: selectedDate,
          });
          console.log('response 2====', response);
          setReportsData(response); // Assuming response.data holds the necessary data
          break;
        default:
          console.log('Invalid report type selected');
          return;
      }
    } catch (error) {
      console.log('error==', error);
    }
  };

  useEffect(() => {
    // Reset reportsData when report type changes
    setReportsData([]);
  }, [selectedReportType]);

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
          Generate Report
        </span>
        <div className="mt-[0.3vw]  scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <div className="mt-5 flex items-center gap-5 ">
            {/* dropdown */}
            <div>
              <select
                className="bg-[#F8F6F2] text-[1.1vw] max-w-[24vw] min-h-[4.5vw]  text-[#838481] font-medium px-4 py-[1vw] rounded-lg leading-tight focus:outline-none"
                value={selectedReportType}
                onChange={handleDropDownChange}
              >
                <option value="">Select Report Type</option>
                {options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* date picker and generate report button */}
            <div className=" flex gap-5">
              <CustomDatePicker onDateChange={handleDateChange} />

              <div className="mt-2" onClick={generateReport}>
                <Button
                  title={'Generate Report'}
                  bgColor={'bg-[rgb(79,201,218)]'}
                  radius={'rounded-lg'}
                  height={'h-[3vw] min-h-[3vh]'}
                  padding={'p-[1vw]'}
                  color={'text-[#ffff]'}
                  textSize={'text-[1vw]'}
                  fontWeight={'font-medium'}
                  width={'w-[10vw]'}
                />
              </div>
            </div>
          </div>
          <div>
            <ReportsTable
              reportsData={reportsData}
              reportType={selectedReportType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
