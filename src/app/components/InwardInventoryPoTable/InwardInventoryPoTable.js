"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import {
  getAllBatchRequest,
  getAllBatchSuccess,
} from "../../Actions/batchActions";
import InwardAssemblyPoFormComponent from "../InwardAssemblyPoFormComponent/InwardAssemblyPoFormComponent";
import { batchServices } from "@/app/services/batchService";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import StatusComponent from "../StatusComponent/StatusComponent";

const InwardInventoryPoTable = () => {
  const { allInventoryPO, loading, error } = useSelector(
    (state) => state.inventoryPo
  );
  const { selectedRawMaterialId } = useSelector((state) => state.batch);
  const { allBatches } = useSelector((state) => state.batch);
  const { dropDownBatchNumber } = useSelector((state) => state.dropdown);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);
  const [filter, setFilter] = useState("allPo");
  const [searchText, setSearchText] = useState("");

  const [formData, setFormData] = useState({
    batchNumber: null,
    quantity: null,
  });
  const [listData, setListData] = useState([]);
  const dispatch = useDispatch();
  const currentDateAndFileName = `Inward_Inventory_PO_${moment().format(
    "DD-MMM-YYYY"
  )}`;
  // console.log("listData====", listData);

  // console.log("formData====", formData);

  const applyFilters = () => {
      let data = allInventoryPO;
  
      if (filter !== "allPo") {
        data = data.filter((item) => item.status === filter);
      }
  
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
    }, [filter, allInventoryPO, searchText]);

  const convertToCSV = (data) => {
    const headers = [
      "PRODUCT NAME",
      "PRODUCT SKU CODE",
      "QUANTITY",
      "RAISED BY",
      "FULFILLED BY",
      "CREATED AT",
    ];

    const rows = data.map((po) => [
      po?.product_id?.product_name,
      po?.product_id?.sku_code,
      po?.quantity,
      `${po?.createdBy?.firstName} ${po?.createdBy?.lastName}`,
      `${po?.fulfilledBy?.firstName} ${po?.fulfilledBy?.lastName}`,
      moment(po?.createdAt).format("DD MM YYYY") || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setFormData({
      ...formData,
      batchNumber: dropDownBatchNumber,
    });
  }, [dropDownBatchNumber]);


  const sortedMaterials = allInventoryPO.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedMaterials);

  
  const getAllBatches = async () => {
    try {
      dispatch(getAllBatchRequest());
      const response = await batchServices.getAllBatches(selectedRawMaterialId);
      if (response.success === true) {
        dispatch(getAllBatchSuccess(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllBatches();
  }, [selectedRawMaterialId]);

  useEffect(() => {
    setFilteredData(sortedMaterials);
  }, [sortedMaterials]);

  const headings = {
    createdAt: {
      label: "Created On",
      renderCell: (row) =>
        moment(row?.createdAt).format("DD MMM YYYY") || "N/A",
      isSticky: false,
    },
    status: {
      label: "Status",
      renderCell: (row) => <StatusComponent status={row?.status} /> || "N/A",
      isSticky: false,
    },
    product_name: {
      label: "Product Name",
      renderCell: (row) => row?.product_id?.product_name || "N/A",
      isSticky: false,
    },
    quantity: {
      label: "Qty",
      renderCell: (row) => row?.quantity || "N/A",
      isSticky: false,
    },
    sku_code: {
      label: "Product SKU Code",
      renderCell: (row) => row?.product_id?.sku_code || "N/A",
      isSticky: false,
    },
    fulfilledBy: {
      label: "Fulfilled By",
      renderCell: (row) =>
        `${row?.fulfilledBy?.firstName} ${row?.fulfilledBy?.lastName}` || "N/A",
      isSticky: false,
    },
    created_by: {
      label: "Raised By",
      renderCell: (row) =>
        `${row?.createdBy?.firstName} ${row?.createdBy?.lastName}` || "N/A",
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
        label: "Inward",
        condition: (po) => po.status !== "fulfilled",
        action: () => openSidebar("inward", po),
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

  const filterOptions = [
    { value: "allPo", label: "All POs" },
    { value: "pending", label: "Pending" },
    { value : 'fulfilled', label : "Fulfilled"}
  ];

  const searchKeys = ["product_id", "quantity", "created_by", "fulfilledBy"];

  return (
    <>
      <PoFilterBar
        filter={filter}
        setFilter={setFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        allPO={sortedMaterials}
        filterOptions={filterOptions}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {sidebarType === "inward" && (
          <InwardAssemblyPoFormComponent
            poId={selectedPo?._id}
            handleCancel={closeSidebar}
          />
        )}
      </RightSidebar>
    </>
  );
};

export default InwardInventoryPoTable;
