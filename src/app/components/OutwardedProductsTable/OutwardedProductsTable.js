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
import { filterByDate } from "@/app/components/DateFilter/DateFilter";
import searchNested from "@/app/utils/searchUtils";

const OutwardedProductsTable = () => {
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);
  const [dayFilter, setDayFilter] = useState("all");
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

    data = filterByDate(data, dayFilter, "created_at");

    data = data.filter((item) =>
      searchKeys.some((key) =>
        searchNested(item[key], searchText.toLowerCase(), key)
      )
    );

    setFilteredData(data);
  };

  useEffect(() => {
    applyFilters();
  }, [allOutwardedProducts, searchText, dayFilter]);

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
        moment(row?.created_at).format("DD MMM YYYY HH:mm:ss") || "N/A",
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
  const handleDayFilterChange = (event) => {
    setDayFilter(event.target.value);
  };

  return (
    <>
      <PoFilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={sortedProducts}
        dayFilter={dayFilter}
        handleDayFilterChange={handleDayFilterChange}
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
