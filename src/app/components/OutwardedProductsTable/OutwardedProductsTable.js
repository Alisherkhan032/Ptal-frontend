import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import ViewOutwardedProductsList from "../ViewOutwardedProductsList/ViewOutwardedProductsList";

const OutwardedProductsTable = () => {
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);
  const dispatch = useDispatch();

  // Fetch outwarded products
  const { allOutwardedProducts } = useSelector(
    (state) => state.outwardedProducts
  );
  console.log(
    "🚀 ~ OutwardedProductsTable ~ allOutwardedProducts:",
    allOutwardedProducts
  );

  // Sort products by creation date
  const sortedProducts = allOutwardedProducts.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const [filteredData, setFilteredData] = useState(sortedProducts);

  const applyFilters = () => {
    let data = allOutwardedProducts;

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
  }, [allOutwardedProducts, searchText]);

  // Convert data to CSV (single row per outwarded product)
  const convertToCSV = (data) => {
    const headers = ["ID", "Created At", "Product Details"];

    const rows = data.map((item) => {
      const productDetails = item.products
        .map(
          (product) =>
            `Name: ${product.product_name} | Quantity: ${
              product.quantity
            } | SKU: ${product.sku_codes.join(", ")}`
        )
        .join("; "); // Products in a single cell

      return [
        item.outwarded_products_id,
        moment(item.created_at).format("DD MMM YYYY HH:mm:ss"), // exact time format
        productDetails,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const currentDateAndFileName = `Outwarded_Products_${moment().format(
      "DD-MMM-YYYY"
    )}.csv`;
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom search logic to handle nested product arrays
  const searchKeys = [
    "outwarded_products_id",
    "products.product_name",
    "products.sku_codes",
  ];

  const handleOpenModal = (product) => {
    setModalData(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const headings = {
    createdAt: {
      label: "Created On",
      renderCell: (row) =>
        moment(row?.createdAt).format("DD MMM YYYY HH:mm:ss") || "N/A",
      isSticky: false,
    },
    outwarded_products_id: {
      label: "ID",
      renderCell: (row) => row?.outwarded_products_id || "N/A",
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
        label: "View Product Details",
        condition: null,
        action: () => openSidebar("ViewProductDetail", po),
      },
    ];
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
    //     <SearchBarNested
    //       tableData={sortedProducts}
    //       searchKeys={searchKeys}
    //       onSearch={handleSearch}
    //     />
    //     <button
    //       onClick={() => convertToCSV(allOutwardedProducts)}
    //       className="relative z-10 inline-flex items-center bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
    //     >
    //       Download CSV
    //     </button>
    //   </div>
    //   <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    //     <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]">
    //       <tr>
    //         <th className="px-6 py-3">ID</th>
    //         <th className="px-6 py-3">Created At</th>
    //         <th className="px-6 py-3">View Product Details</th>
    //       </tr>
    //     </thead>
    //     {allOutwardedProducts?.length > 0 ? (
    //       <tbody>
    //         {records.length === 0 ? (
    //           <tr>
    //             <td colSpan="3" className="text-center p-5 font-semibold text-red-300">
    //               No products found!
    //             </td>
    //           </tr>
    //         ) : (
    //           records.map((item, index) => (
    //             <tr
    //               key={index}
    //               className="bg-white border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]"
    //             >
    //               <td className="px-6 py-4">{item?.outwarded_products_id}</td>
    //               <td className="px-6 py-4">{moment(item?.created_at).format('DD MMM YYYY HH:mm:ss')}</td> {/* Exact time */}
    //               <td className="px-6 py-4">
    //                 <button
    //                   className="text-[rgb(144,138,129)] bg-[rgb(248,246,242)] hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
    //                   type="button"
    //                   onClick={() => handleOpenModal(item)}
    //                 >
    //                   View Details
    //                 </button>
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
    //             onClick={() => setCurrentPage(n)}
    //             className={`relative z-10 inline-flex items-center bg-white border rounded-lg px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)] ${currentPage === n ? ' text-black' : 'hover:bg-gray-50'}`}
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
    //         <h2 className="text-lg font-bold mb-4">Product Details</h2>
    //         <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    //           <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]">
                // <tr>
                //   <th className="px-6 py-3">Product Name</th>
                //   <th className="px-6 py-3">Quantity</th>
                //   <th className="px-6 py-3">SKU Codes</th>
                // </tr>
    //           </thead>
    //           <tbody>
    //             {modalData?.products.map((product, idx) => (
    //               <tr key={idx} className="bg-white border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] hover:bg-gray-50">
    //                 <td className="px-6 py-4">{product.product_name}</td>
    //                 <td className="px-6 py-4">{product.quantity}</td>
    //                 <td className="px-6 py-4">{product.sku_codes.join(', ')}</td>
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
        allPO={sortedProducts}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {sidebarType === "ViewProductDetail" && (
          <ViewOutwardedProductsList
            po={selectedPo}
            handleCancel={closeSidebar}
          />
        )}
      </RightSidebar>
    </>
  );
};

export default OutwardedProductsTable;
