"use client";
import React, { useEffect, useState } from "react";
import { items } from "@/app/utils/sidebarItems";
import CustomDatePicker from "@/app/components/DatePicker/DatePicker";
import { reportServices } from "@/app/services/reportService";
import Button from "@/app/components/Button/Button";
import dayjs from "dayjs";
import ReportsTable from "@/app/components/ReportsTable/ReportsTable";
import TitleBar from "@/app/components/TitleBar/TitleBar";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import moment from "moment";
import { PrimaryButton } from "@/app/components/ButtonComponent/ButtonComponent";

const page = () => {
  const options = [
    "Inventory Room Day Starting Count",
    "Storage Room Day Starting Count",
  ];
  const [selectedDate, setSelectedDate] = useState(
    dayjs().startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
  );
  const [selectedReportType, setSelectedReportType] = useState(null);
  console.log("selectedDate deafult===", selectedDate);
  const [reportsData, setReportsData] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [rows, setRows] = useState([]);

  const reportTypeConfig = {
    "Storage Room Day Starting Count": {
      headings: {
        created_at: {
          label: "Created At",
          renderCell: (row) =>
            row?.createdAt
              ? moment(row?.createdAt).format("DD MMM YYYY")
              : "N/A",
          isSticky: false,
        },
        material_name: {
          label: "Material Name",
          renderCell: (row) => row?.material_name || "N/A",
          isSticky: false,
        },
        material_description: {
          label: "Description",
          renderCell: (row) => row?.material_description || "N/A",
          isSticky: false,
        },
        material_category_id: {
          label: "Material Category Id",
          renderCell: (row) => row?.material_category_id || "N/A",
          isSticky: false,
        },
        unit_of_measure: {
          label: "Unit Of Measure",
          renderCell: (row) => row?.unit_of_measure || "N/A",
          isSticky: false,
        },
        current_stock: {
          label: "Current Stock",
          renderCell: (row) => row?.current_stock || "N/A",
          isSticky: false,
        },
        reorder_level: {
          label: "Reorder Level",
          renderCell: (row) => row?.reorder_level || "N/A",
          isSticky: false,
        },
        warehouse_id: {
          label: "Warehouse Id",
          renderCell: (row) => row?.warehouse_id || "N/A",
          isSticky: false,
        },
        warehouse_id: {
          label: "Warehouse Id",
          renderCell: (row) => row?.warehouse_id || "N/A",
          isSticky: false,
        },
        sku_code: {
          label: "SKU Code",
          renderCell: (row) => row?.sku_code || "N/A",
          isSticky: false,
        },
        unit_price: {
          label: "Unit Price",
          renderCell: (row) => row?.unit_price || "N/A",
          isSticky: false,
        },
        zoho_item_id: {
          label: "Zoho Item Id",
          renderCell: (row) => row?.zoho_item_id || "N/A",
          isSticky: false,
        },
        failedQcCount: {
          label: "Failed QC Count",
          renderCell: (row) => row?.failedQcCount || "0",
          isSticky: false,
        },
        updatedAt: {
          label: "Updated At",
          renderCell: (row) =>
            row?.updatedAt
              ? moment(row?.updatedAt).format("DD MMM YYYY")
              : "N/A",
          isSticky: false,
        },
      },
      fetchFunction: reportServices.generateStorageRoomReport,
    },
    "Inventory Room Day Starting Count": {
      headings: {
        created_at: {
          label: "Created At",
          renderCell: (row) =>
            row?.createdAt
              ? moment(row?.createdAt).format("DD MMM YYYY")
              : "N/A",
          isSticky: false,
        },
        product_name: {
          label: "Product Name",
          renderCell: (row) => row?.product_name || "N/A",
          isSticky: false,
        },
        product_description: {
          label: "Description",
          renderCell: (row) => row?.product_description || "N/A",
          isSticky: false,
        },
        product_category_id: {
          label: "Product Category Id",
          renderCell: (row) => row?.product_category_id || "N/A",
          isSticky: false,
        },
        unit_of_measure: {
          label: "Unit Of Measure",
          renderCell: (row) => row?.unit_of_measure || "N/A",
          isSticky: false,
        },
        current_stock: {
          label: "Current Stock",
          renderCell: (row) => row?.current_stock || "N/A",
          isSticky: false,
        },
        warehouse_id: {
          label: "Warehouse Id",
          renderCell: (row) => row?.warehouse_id || "N/A",
          isSticky: false,
        },
        warehouse_id: {
          label: "Warehouse Id",
          renderCell: (row) => row?.warehouse_id || "N/A",
          isSticky: false,
        },
        sku_code: {
          label: "SKU Code",
          renderCell: (row) => row?.sku_code || "N/A",
          isSticky: false,
        },
        current_count: {
          label: "Current Stock",
          renderCell: (row) => row?.current_count || "0",
          isSticky: false,
        },
        isInward: {
          label: "Is Inward",
          renderCell: (row) => row?.isInward || "0",
          isSticky: false,
        },
        isOutward: {
          label: "Is Outward",
          renderCell: (row) => row?.isOutward || "0",
          isSticky: false,
        },
        updatedAt: {
          label: "Updated At",
          renderCell: (row) =>
            row?.updatedAt
              ? moment(row?.updatedAt).format("DD MMM YYYY")
              : "N/A",
          isSticky: false,
        },
      },
      fetchFunction: reportServices.generateInventoryRoomReport,
    },
  };

  const handleDateChange = (newDate) => {
    // Set time to 00:00:00
    const adjustedDate = newDate.clone().startOf("day");
    const formattedDate = adjustedDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    console.log("adjustedDate===", adjustedDate);
    setSelectedDate(formattedDate);
    console.log("Selected Date:", formattedDate);
  };

  const handleDropDownChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedReportType(selectedValue);

    if (reportTypeConfig[selectedValue]) {
      setHeadings(reportTypeConfig[selectedValue].headings);
      setRows([]); // Reset rows while fetching new data
    }
  };

  const generateReport = async () => {
    let response;
    try {
      switch (selectedReportType) {
        case "Storage Room Day Starting Count":
          console.log("called===");
          response = await reportServices.generateStorageRoomReport({
            reportDate: selectedDate,
          });
          console.log("response====", response);
          setReportsData(response); // Assuming response.data holds the necessary data
          break;
        case "Inventory Room Day Starting Count":
          response = await reportServices.generateInventoryRoomReport({
            reportDate: selectedDate,
          });
          console.log("response 2====", response);
          setReportsData(response); // Assuming response.data holds the necessary data
          break;
        default:
          console.log("Invalid report type selected");
          return;
      }
    } catch (error) {
      console.log("error==", error);
    }
  };

  useEffect(() => {
    // Reset reportsData when report type changes
    setReportsData([]);
  }, [selectedReportType]);

  return (
    <div className="relative w-full h-full overflow-scroll scrollbar-none bg-[#f9fafc]">
      <div className="relative z-10 flex flex-col  overflow-scroll scrollbar-none px-4 py-2">
        <div className="w-full max-w-full mb-2">
          <TitleBar title="Report" />
        </div>
        <div className="mt-5 flex justify-between items-center">
          {/* Dropdown aligned to the left */}
          <div className="flex-grow-0">
            <select
              className="text-sm h-10 border border-stroke text-[#838481] font-medium px-4 py-2 rounded-xl leading-tight focus:outline-none"
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

          {/* Date picker and generate report button aligned to the right */}
          <div className="flex gap-5 items-center">
            <CustomDatePicker onDateChange={handleDateChange} />

            {/* <div onClick={generateReport}>
              <Button
                title={"Generate Report"}
                bgColor={"bg-[rgb(79,201,218)]"}
                radius={"rounded-lg"}
                height={"h-[3vw] min-h-[3vh]"}
                padding={"p-[1vw]"}
                color={"text-[#ffff]"}
                textSize={"text-[1vw]"}
                fontWeight={"font-medium"}
                width={"w-[10vw]"}
              />
            </div> */}
            <PrimaryButton
              title="Generate Report"
              onClick={generateReport}
              size="medium"
             />
          </div>
        </div>

        <div className="flex w-full max-w-full mb-6 mt-4 scrollbar-none">
          <div className="flex-1 rounded-lg  bg-gray-1 overflow-y-auto scrollbar-none">
            {reportsData.length > 0 && (
              <DynamicTableWithoutAction
                headings={headings}
                rows={reportsData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
