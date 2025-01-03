"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { bulkRawMaterialPOServices } from "@/app/services/bulkRawMaterialPOService";
import BatchNumbeDropdown from "../BatchNumbeDropdown/BatchNumbeDropdown";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { setRawMaterialIdBatch } from "../../Actions/batchActions";
import {
  getAllBulkRawMaterialPOFailure,
  getAllBulkRawMaterialPORequest,
  getAllBulkRawMaterialPOSuccess,
} from "@/app/Actions/bulkRawMaterialPOActions";
import {
  getAllBatchRequest,
  getAllBatchSuccess,
  getAllBatchFailure,
} from "../../Actions/batchActions";
import { batchServices } from "@/app/services/batchService";
import SearchBar from "../SearchBar/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RightSidebar from "@/app/components/RaisePoFormSideBar/RaisePoFormSideBar";
import StatusComponent from "../StatusComponent/StatusComponent";
import PoFilterBar from "../PoFilterBar/PoFilterBar";
import OutwardBulkForm from "../OutwardBulkForm/OutwardBulkForm";
import DynamicTableWithoutAction from "../DynamicTableWithoutAction/DynamicTableWithoutAction";
import {
  stickyActionColumnClassname,
  stickyActionRowClassname,
} from "@/app/utils/stickyActionClassname";
import ActionDropdown from "../ActionDropdown/ActionDropdown";
import { filterByDate } from '@/app/components/DateFilter/DateFilter';
import searchNested from '@/app/utils/searchUtils';

const OutwardBulkRawMaterialPoTable = () => {
  const { allBulkRawMaterialPO, loading, error } = useSelector(
    (state) => state.bulkRawMaterialPO
  );

  console.log("allBulkRawMaterialPO=========", allBulkRawMaterialPO);
  const { selectedRawMaterialId } = useSelector((state) => state.batch);
  const { allBatches } = useSelector((state) => state.batch);
  const dropDownBatchNumber = useSelector((state) => state.dropdown);

  const [searchText, setSearchText] = useState("");
  const [dayFilter, setDayFilter] = useState("all");
  const [filter, setFilter] = useState("allPo");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedPo, setSelectedPo] = useState(null);

  const [formData, setFormData] = useState({
    batchNumber: null,
    quantity: null,
  });
  let [formDisabled, setFormDisabled] = useState(false); // State to disable form interactions
  const [listData, setListData] = useState([]);
  const [errors, setErrors] = useState({
    batchNumber: "",
    quantity: "",
    totalQuantity: "",
    batchQuantity: "",
  });
  const currentDateAndFileName = `Outward_B2B_PO_${moment().format(
    "DD-MMM-YYYY"
  )}`;
  const [batchQuantities, setBatchQuantities] = useState({});

  const batchesToShow = allBatches.filter((batch) => batch.quantity > 0);

  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    const numericValue = value === "" ? null : Number(value); // Convert value to a number

    setFormData({
      ...formData,
      [name]: numericValue,
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

    const totalQuantity = listData.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    if (totalQuantity !== poQuantity) {
      newErrors.totalQuantity = `The sum of all quantities must equal ${poQuantity}.`;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    setFormData({
      ...formData,
      batchNumber: dropDownBatchNumber,
    });
  }, [dropDownBatchNumber]);

  const sortedMaterials = [...allBulkRawMaterialPO].sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedMaterials);

  const convertToCSV = (data) => {
    const headers = [
      "RAW MATERIAL NAME",
      "QUANTITY",
      "RAISED BY",
      "CREATED AT",
    ];

    const rows = data.map((po) => [
      po?.raw_material_id?.material_name,
      po?.quantity,
      `${po?.createdBy?.firstName} ${po?.createdBy?.lastName}`,
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

  const upatePoStatus = async (poId, listData, poQuantity) => {
    if (!validateForm(poQuantity)) return;

    const updatedListData = [];
    Object.keys(batchQuantities).forEach((batchNumber) => {
      updatedListData.push({
        batchNumber: batchNumber,
        quantity: batchQuantities[batchNumber],
      });
    });

    try {
      const response = await bulkRawMaterialPOServices.updateBulkRawMaterialPO(
        poId,
        {
          status: "fulfilled",
          listData: updatedListData,
        }
      );
      if (response.success === true) {
        toast.success("B2B PO updated successfully", {
          autoClose: 1500,
          onClose: () => window.location.reload(),
        });
        setFormDisabled(true);
      }
      return response;
    } catch (error) {
      // Handle error
      console.error("Error updating PO status:", error);
    }
  };

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
  }, []);

  function closeModal() {
    const modal = document.getElementById("popup-modal");
    if (modal) {
      modal.style.display = "none";
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      batchNumber: null,
      quantity: null,
    }));

    setErrors({
      batchNumber: "",
      quantity: "",
      totalQuantity: "",
    });
    setListData([]);
    setBatchQuantities({});
    setOpenIndex(null);
  }

  const checkBatchQuantity = () => {
    let valid = true;
    let newErrors = {};
    const { dropDownBatchNumber } = formData.batchNumber;

    if (formData.quantity < 0) {
      newErrors.batchQuantity = "Batch Quantity must be greater than 0";
      valid = false;
    }

    const batch = allBatches.find(
      (batch) => batch.batch_number === parseInt(dropDownBatchNumber, 10)
    );

    if (!batch) {
      newErrors.batchNumber = "Batch Number does not exist";
      valid = false;
    } else if (formData.quantity > batch.quantity) {
      const currentListQuantity =
        batchQuantities[formData.batchNumber.dropDownBatchNumber] || 0;
      newErrors.batchQuantity = `Quantity exceeds available batch quantity : ${
        batch.quantity - currentListQuantity
      } `;
      valid = false;
    } else {
      // Track batch quantities
      const updatedBatchQuantities = { ...batchQuantities };
      if (!updatedBatchQuantities[dropDownBatchNumber]) {
        updatedBatchQuantities[dropDownBatchNumber] = 0;
      }
      updatedBatchQuantities[dropDownBatchNumber] += formData.quantity;

      // Validate that the sum of quantities for each batch does not exceed the batch quantity
      Object.keys(updatedBatchQuantities).forEach((batchNumber) => {
        const batch = allBatches.find(
          (batch) => batch.batch_number === parseInt(batchNumber, 10)
        );

        if (updatedBatchQuantities[batchNumber] > batch.quantity) {
          newErrors.batchQuantity =
            "Sum of particular batch quantities exceeds the available batch quantity";
          valid = false;
        }
      });

      if (valid) {
        setBatchQuantities(updatedBatchQuantities);
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleDelete = (index) => {
    const { batchNumber, quantity } = listData[index];

    // Update listData by removing the item at the specified index
    const updatedListData = listData.filter((_, i) => i !== index);
    setListData(updatedListData);

    // Update batchQuantities by reducing the quantity of the deleted batch
    const updatedBatchQuantities = { ...batchQuantities };
    updatedBatchQuantities[batchNumber] -= quantity;
    if (updatedBatchQuantities[batchNumber] <= 0) {
      delete updatedBatchQuantities[batchNumber];
    }

    setBatchQuantities(updatedBatchQuantities);
  };

  const addItemsInListArray = () => {
    if (!checkBatchQuantity()) return;
    setListData([
      ...listData,
      {
        batchNumber: formData.batchNumber.dropDownBatchNumber,
        quantity: formData.quantity,
      },
    ]);
  };

 

  const applyFilters = () => {
    let data = allBulkRawMaterialPO;

    if (filter !== "allPo") {
      data = data.filter((item) => item.status === filter);
    }

    data = filterByDate(data, dayFilter);

    data = data.filter((item) =>
      searchKeys.some((key) =>
        searchNested(item[key], searchText.toLowerCase(), key)
      )
    );

    setFilteredData(data);
  };

  useEffect(() => {
    applyFilters();
  }, [allBulkRawMaterialPO, searchText, filter, dayFilter]);

  const searchKeys = [
    "raw_material_id",
    "quantity",
    "createdBy",
    "createdAt",
    "status",
  ];

  const headings = {
    createdAt: {
      label: "Created On",
      renderCell: (row) =>
        moment(row?.createdAt).format("DD MMM YYYY") || "N/A",
      isSticky: false,
    },
    bulkOrderReference: {
      label: "Bulk Order Ref",
      renderCell: (row) => row?.bulkOrderReference || "N/A",
      isSticky: false,
    },
    status: {
      label: "Status",
      renderCell: (row) => <StatusComponent status={row?.status} /> || "N/A",
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
    created_by: {
      label: "Raised By",
      renderCell: (row) =>
        `${row?.createdBy?.firstName} ${row?.createdBy?.lastName}` || "N/A",
      isSticky: false,
    },
    action: {
      label: "Action",
      renderCell: (row) => (
        <ActionDropdown
          po={row}
          actions={generatePOActions(row)}
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
        label: "Outward Bulk",
        condition: (po) => po.status !== "pending",
        action: () => openSidebar("outwardBulk", po),
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
    { value: "fulfilled", label: "Fulfilled" },
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
        allPO={sortedMaterials}
        filterOptions={filterOptions}
        dayFilter={dayFilter}
        handleDayFilterChange={handleDayFilterChange}
      />
      <DynamicTableWithoutAction headings={headings} rows={filteredData} />

      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {sidebarType === "outwardBulk" && (
          <OutwardBulkForm
            po={selectedPo}
            formData={formData}
            errors={errors}
            addItemsInListArray={addItemsInListArray}
            handleChange={handleChange}
            handleDelete={handleDelete}
            listData={listData}
            upatePoStatus={upatePoStatus}
            closeModal={closeModal}
            formDisabled={formDisabled}
            batchesToShow={batchesToShow}
            handleCancel={closeSidebar}
          />
        )}
      </RightSidebar>
    </>
  );
};

export default OutwardBulkRawMaterialPoTable;
