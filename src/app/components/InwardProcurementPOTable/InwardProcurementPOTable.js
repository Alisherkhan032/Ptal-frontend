"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { poServices } from "@/app/services/poService";
import StatusComponent from "../StatusComponent/StatusComponent";
import moment from "moment";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import "./InwardProcurementPOTable.css";
import QcInfoForm from "../QcInfoForm/QcInfoForm";
import InwardForm from "../InwardForm/InwardForm";
import { toast } from "react-toastify";
import DynamicTableWithoutAction from "@/app/components/DynamicTableWithoutAction/DynamicTableWithoutAction";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import {ICONS} from "@/app/utils/icons";

const InwardProcurementPOTable = () => {
  const { allPO } = useSelector((state) => state.po);

  const [formData, setFormData] = useState({
    passedQcInfo: null,
    failedQcInfo: null,
    comment: null,
  });
  const [errors, setErrors] = useState({
    passedQcInfo: "",
    failedQcInfo: "",
    comment: "",
    quantity: "",
  });
  const [filter, setFilter] = useState("allPo");
  const [dayFilter, setDayFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const sortedMaterials = allPO.filter((po) => po.status !== "fulfilled"); 
  const [filteredData, setFilteredData] = useState(sortedMaterials);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);

  const applyFilters = () => {
    let data = allPO;

    if (filter !== "allPo") {
      data = data.filter((item) => item.status === filter);
    }

    if (dayFilter !== "all") {
      const now = moment();
      data = data.filter((item) => {
        const itemDate = moment(item.createdAt);
        switch (dayFilter) {
          case "7days":
            return itemDate.isAfter(now.clone().subtract(7, "days"));
          case "14days":
            return itemDate.isAfter(now.clone().subtract(14, "days"));
          case "30days":
            return itemDate.isAfter(now.clone().subtract(30, "days"));
          default:
            return true;
        }
      });
    }

    data = data.filter((item) =>
      searchKeys.some((key) =>
        searchNested(item[key], searchText.toLowerCase(), key)
      )
    );

    data = data.filter((po) => po.status !== "fulfilled");

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
  }, [filter, dayFilter, allPO, searchText]);


  const currentDateAndFileName = `Inward_Procurement_PO_${moment().format(
    "DD-MMM-YYYY"
  )}`;

  const convertToCSV = (data) => {
    const headers = [
      "CREATED AT",
      "VENDOR NAME",
      "PO NUMBER",
      "QUANTITY",
      "RAW MATERIAL NAME",
      "GRN",
      "RAISED BY",
    ];

    const rows = data.map((po) => [
      moment(po?.createdAt).format("DD MMM YYYY"),
      po?.vendor_id?.vendor_name,
      po?.po_number,
      po?.quantity,
      po?.raw_material_id?.material_name,
      po?.grn_number,
      `${po?.created_by?.firstName} ${po?.created_by?.lastName}`,
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


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
      quantity: "",
    });
  };

  const validateForm = (poQuantity) => {
    let valid = true;
    let newErrors = {};

    if (!formData.passedQcInfo) {
      newErrors.passedQcInfo = "This field is required";
      valid = false;
    }
    if (!formData.failedQcInfo) {
      newErrors.failedQcInfo = "This field is required";
      valid = false;
    }
    if (!formData.comment) {
      newErrors.comment = "This field is required";
      valid = false;
    }

    const passedQcInfo = parseInt(formData.passedQcInfo, 10);
    const failedQcInfo = parseInt(formData.failedQcInfo, 10);

    if (passedQcInfo + failedQcInfo !== poQuantity) {
      newErrors.quantity = `The sum of QC Passed quantity and QC Failed quantity must equal ${poQuantity}`;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const updateQcInfo = async (poId, poQuantity) => {
    console.log("updaare =====", formData);
    if (!validateForm(poQuantity)) return;
    try {
      const response = await poServices.updateQcInfo(poId, {
        status: "qc_info_added",
        formData: formData,
      });
      console.log("response =====", response);
      if (response.success === true) {
        toast.success(`QC info was updated successfully`, {
          autoClose: 1500,
          onClose: () => {
            setIsSidebarOpen(false);
            window.location.reload(); // Refresh the page after the toast is shown
          },
          disableClick: true,
          className:
            "bg-green-light-6 text-green-dark p-4 rounded-lg shadow-lg text-sm",
        });
      }

      return response;
    } catch (error) {
      // Handle error
      console.error("Error updating PO status:", error);
    }
  };

  const generateBatchSticker = async (poId) => {
    try {
      const response = await poServices.generateBatchSticker(poId);
      console.log("response=====", response);

      const blob = new Blob([response], { type: "application/pdf" });
      console.log("blob=====", blob);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "PoQR_Codes.pdf";

      document.body.appendChild(a);
      a.click();

      // Clean up and remove the link
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      if (response) {
        window.location.reload();
      }

      return response;
    } catch (error) {
      // Handle error
      console.error("Error updating PO status:", error);
    }
  };

  useEffect(() => {
    const sortedMaterials = allPO
      .filter((po) => po.status !== "fulfilled") // Only include POs where status is not 'fulfilled'
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    setFilteredData(sortedMaterials);
  }, [allPO]);

  const searchKeys = [
    "vendor_id",
    "po_number",
    "quantity",
    "raw_material_id",
    "grn_number",
    "quantity",
  ];

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
    po_number: {
      label: "row Number",
      renderCell: (row) => row?.po_number || "N/A",
      isSticky: false,
    },
    material_name: {
      label: "Raw Material",
      renderCell: (row) => row?.raw_material_id?.material_name || "N/A",
      isSticky: false,
    },
    quantity: {
      label: "Qty",
      renderCell: (row) => row?.quantity || "N/A",
      isSticky: false,
    },
    vendor_name: {
      label: "Vendor Name",
      renderCell: (row) => row?.vendor_id?.vendor_name || "N/A",
      isSticky: false,
    },
    bill_number: {
      label: "Bill Number",
      renderCell: (row) => row?.bill_number || "N/A",
      isSticky: false,
    },
    grn_number: {
      label: "GRN",
      renderCell: (row) => row?.grn_number || "N/A",
      isSticky: false,
    },
    created_by: {
      label: "Raised By",
      renderCell: (row) =>
        `${row?.created_by?.firstName} ${row?.created_by?.lastName}` || "N/A",
      isSticky: false,
    },
    action: {
      label: "Action",
      renderCell: (row) => (
        <ActionDropdown 
          po={row} 
          actions={generatePOActions(row)} 
          customElement = {customQrCodeDownloadProps}
        />
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
        condition: (po) => po.status === "qc_info_added",
        action: () => openSidebar("inward", po),
      },
       {
        label: "Enter Qc Info",
        condition: (po) => po.status === "batch_generated",
        action: () => openSidebar("enterQcInfo", po),
      },
    ]
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

  const customQrCodeDownloadProps = [
    {
      label : ICONS.qrCode,
      action : (po) => generateBatchSticker(po?._id),
    }
  ]

  const filterOptions = [
    { value: "allPo", label: "All POs" },
    { value: "pending", label: "Pending" },
    { value: "qc_info_added", label: "Qc Info Added" },
    { value: "batch_generated", label: "Batch Generated" },
  ];

  const handleDayFilterChange = (event) => {
    setDayFilter(event.target.value);
  };


  return (
    <>
      <PoFilterBar
        filter={filter}
        setFilter={setFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        convertToCSV={convertToCSV}
        dayFilter={dayFilter}
        handleDayFilterChange={handleDayFilterChange}
        allPO={sortedMaterials}
        filterOptions={filterOptions}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {sidebarType === "inward" && (
          <InwardForm
            poId={selectedPo?._id}
            handleCancel={closeSidebar} 
          />
        )}
        {sidebarType === "enterQcInfo" && (
          <QcInfoForm
            po={selectedPo}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleCancel={closeSidebar} 
            handleSubmit={() =>
              updateQcInfo(selectedPo?._id, selectedPo?.quantity)
            } 
          />
        )}
      </RightSidebar>
    </>
  );
};

export default InwardProcurementPOTable;
