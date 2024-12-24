import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import SearchBar from "../SearchBar/SearchBar";
import Button from "../Button/Button";
import { rawMaterialServices } from "@/app/services/rawMaterialService";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import { SecondaryButton } from "../ButtonComponent/ButtonComponent";
import PoFilterBar from "../PoFilterBar/PoFilterBar";

const OrderDetails = ({ po, handleCancel }) => {
  if (!po) return null;

  return (
    <>
      <div className="relative overflow-y-scroll scrollbar-none pb-10 text-black">
        <h2 className="text-base font-semibold text-[#111928] mb-6">
          Returned Items Details
        </h2>
        {po.returnedItems && po.returnedItems.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]">
              <tr>
                <th className="px-6 py-3">SKU CODE</th>
                <th className="px-6 py-3">QUANTITY</th>
              </tr>
            </thead>
            <tbody>
              {po.returnedItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="bg-white text-dark border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{item.sku}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-left text-red-500 font-medium">
            No items to display
          </p>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full border border-t-stroke bg-white p-2">
        <div className="flex gap-x-2">
          <div className="flex-1">
            <SecondaryButton
              title="Cancel"
              onClick={handleCancel}
              size="full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const RtoOrderTable = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  // Fetch all RTO orders
  const { orders } = useSelector((state) => state.rtoOrder);

  // Sort orders by updated date
  const sortedOrders = orders.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedOrders);

  useEffect(() => {
    setFilteredData(sortedOrders);
  }, [sortedOrders]);

  const applyFilters = () => {
    let data = orders;

    data = data.filter((item) =>
      searchKeys.some((key) =>
        searchNested(item[key], searchText.toLowerCase(), key)
      )
    );

    setFilteredData(data);
  };

  const searchNested = (obj, query, key) => {
    if (Array.isArray(obj)) {
      return obj.some((item) => searchNested(item, query, key));
    }
    if (typeof obj === "object" && obj !== null) {
      return Object.values(obj).some((val) => searchNested(val, query, key));
    }
    if (typeof obj === "string") {
      return obj.toLowerCase().includes(query);
    }
    if (typeof obj === "number" && key === "quantity") {
      return obj.toString().includes(query);
    }
    return false;
  };

  useEffect(() => {
    applyFilters();
  }, [orders, searchText]);

  const convertToCSV = (data) => {
    const headers = [
      "ORDER ID",
      "AWB NUMBER",
      "SOURCE PLATFORM",
      "LOGISTICS PARTNER",
      "RETURNED ITEMS",
      "CREATED AT",
    ];

    const rows = data.map((order) => [
      order?.orderId,
      order?.awbNumber || "",
      order?.sourcePlatform || "",
      order?.logisticsPartner || "",
      order?.returnedItems
        .map((item) => `${item.sku}: ${item.quantity}`)
        .join(", ") || "",
      moment(order?.createdAt).format("DD MMM YYYY") || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const currentDateAndFileName = `RTO_Orders_${moment().format(
      "DD-MMM-YYYY"
    )}.csv`;
    link.setAttribute("download", currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const searchKeys = [
    "orderId",
    "awbNumber",
    "sourcePlatform",
    "logisticsPartner",
    "returnedItems.sku",
    "returnedItems.quantity",
  ];
  const headings = {
    createdAt: {
      label: "Created On",
      renderCell: (row) =>
        moment(row?.createdAt).format("DD MMM YYYY HH:mm") || "N/A",
      isSticky: false,
    },
    orderId: {
      label: "Order ID",
      renderCell: (row) => row?.orderId || "N/A",
      isSticky: false,
    },
    awbNumber: {
      label: "AWB NUmber",
      renderCell: (row) => row?.awbNumber || "N/A",
      isSticky: false,
    },
    sourcePlatform: {
      label: "Source Platform",
      renderCell: (row) => row?.sourcePlatform || "N/A",
      isSticky: false,
    },
    logisticsPartner: {
      label: "Logistic partner",
      renderCell: (row) => row?.logisticsPartner || "N/A",
      isSticky: false,
    },
    action: {
      label: "Action",
      renderCell: (row) => (
        <ActionDropdown po={row} actions={generatePOActions(row)} />
      ),
      isSticky: true,
      stickyClassHeader: stickyActionColumnClassname,
      stickyClassRow: stickyActionRowClassname,
    },
  };

  const generatePOActions = (po) => {
    return [
      {
        label: "View Details",
        condition: null,
        action: () => handleViewDetails(po),
      },
    ];
  };

  const handleViewDetails = async (po) => {
    setSidebarType("viewDetail");

    // Check if returnedItems is empty
    if (!po.returnedItems || po.returnedItems.length === 0) {
      setSelectedPo(po); // Directly set the PO without API call
      setIsSidebarOpen(true); // Open the sidebar
      return;
    }

    // Proceed with the API call if returnedItems is not empty
    try {
      setIsSidebarOpen(true);
      const detailedItems = await Promise.all(
        po.returnedItems.map(async (item) => {
          try {
            const response = await rawMaterialServices.getSkuCodeById(item.sku);
            return { ...item, sku: response.data.sku_code };
          } catch (error) {
            console.error("Error fetching SKU code:", error);
            return item; // Fallback to original item in case of error
          }
        })
      );

      setSelectedPo({ ...po, returnedItems: detailedItems });
    } catch (error) {
      console.error("Error fetching PO details:", error);
    }
  };

  const openSidebar = (type, po) => {
    setSidebarType(type);
    setSelectedPo(po);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSidebarType(null);
    setSelectedPo(null);
  };

  return (
    // <div className="relative overflow-x-auto sm:rounded-lg">
    //   <div className="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)]">
    //     <SearchBar
    //       tableData={sortedOrders}
    //       searchKeys={searchKeys}
    //       onSearch={handleSearch}
    //     />
    //     <button
    //       onClick={() => convertToCSV(orders)}
    //       className="relative z-10 inline-flex items-center bg-green-500 text-dark px-4 py-2 text-sm font-semibold rounded-lg"
    //     >
    //       Download CSV
    //     </button>
    //   </div>
    //   <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    //     <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]">
    //       <tr>
    //         <th className="px-6 py-3">ORDER ID</th>
    //         <th className="px-6 py-3">AWB NUMBER</th>
    //         <th className="px-6 py-3">SOURCE PLATFORM</th>
    //         <th className="px-6 py-3">LOGISTICS PARTNER</th>
    //         <th className="px-6 py-3">VIEW RETURNED ITEM INFO</th>
    //         <th className="px-6 py-3">CREATED AT</th>
    //       </tr>
    //     </thead>
    //     {orders?.length > 0 ? (
    //       <tbody>
    //         {records.length === 0 ? (
    //           <tr>
    //             <td
    //               colSpan="6"
    //               className="text-center p-5 font-semibold text-red-300"
    //             >
    //               No RTO orders found!
    //             </td>
    //           </tr>
    //         ) : (
    //           records.map((order, index) => (
    //             <tr
    //               key={index}
    //               className={`${
    //                 order.status === "returned" ? "bg-yellow-100" : "bg-white"
    //               } border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]`}
    //             >
    //               <td className="px-6 py-4">{order?.orderId}</td>
    //               <td className="px-6 py-4">{order?.awbNumber}</td>
    //               <td className="px-6 py-4">{order?.sourcePlatform}</td>
    //               <td className="px-6 py-4">{order?.logisticsPartner}</td>
    //               <td className="px-6 py-4">
    //                 <button
    //                   id="dropdownHoverButton"
    //                   className="text-[rgb(144,138,129)] bg-[rgb(248,246,242)] hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
    //                   type="button"
    //                   onClick={() => handleOpenModal(order)}
    //                 >
    //                   View Details
    //                 </button>
    //               </td>
    //               <td className="px-6 py-4">
    //                 {moment(order?.createdAt).format("DD MMM YYYY HH:mm")}
    //               </td>
    //             </tr>
    //           ))
    //         )}
    //       </tbody>
    //     ) : (
    //       <div>Loading...</div>
    //     )}
    //   </table>
    //   <nav className="p-[1vw] flex">
    //     <ul className="pagination flex gap-[1vw]">
    //       <li className="page-item">
    //         <a
    //           href="#"
    //           className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    //           onClick={prePage}
    //         >
    //           Prev
    //         </a>
    //       </li>
    //       {numbers.map((n, i) => (
    //         <li key={i} className="page-item">
    //           <a
    //             href="#"
    //             onClick={() => chageCPage(n)}
    //             className={`relative z-10 inline-flex items-center bg-white border rounded-lg px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)] ${
    //               currentPage === n ? " text-black" : "hover:bg-gray-50"
    //             }`}
    //           >
    //             {n}
    //           </a>
    //         </li>
    //       ))}
    //       <li className="page-item">
    //         <a
    //           href="#"
    //           className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
    //           onClick={nextPage}
    //         >
    //           Next
    //         </a>
    //       </li>
    //     </ul>
    //   </nav>

    //   {showModal && (
    //     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    //       <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
    //         <h2 className="text-lg font-bold mb-4">Returned Items Details</h2>
    //         <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    //           <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]">
    //             <tr>
    //               <th className="px-6 py-3">SKU CODE</th>
    //               <th className="px-6 py-3">QUANTITY</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {modalData?.returnedItems.map((item, idx) => (
    //               <tr
    //                 key={idx}
    //                 className="bg-white text-dark border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] hover:bg-gray-50"
    //               >
    //                 <td className="px-6 py-4">{item.sku}</td>
    //                 <td className="px-6 py-4">{item.quantity}</td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //         <div className="flex justify-end mt-4">
    //           <button
    //             onClick={handleCloseModal}
    //             className="inline-flex items-center bg-red-500 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-red-600"
    //           >
    //             Close
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <>
      <PoFilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={orders}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {sidebarType === "viewDetail" &&
          (selectedPo ? (
            <OrderDetails po={selectedPo} handleCancel={closeSidebar} />
          ) : (
            <div className="">
              <p className="text-gray-500 font-medium text-lg">Loading details...</p>
            </div>
          ))}
      </RightSidebar>
    </>
  );
};

export default RtoOrderTable;
