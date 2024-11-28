"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { bulkRawMaterialPOServices } from '@/app/services/bulkRawMaterialPOService';
import BatchNumbeDropdown from "../BatchNumbeDropdown/BatchNumbeDropdown";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { setRawMaterialIdBatch } from "../../Actions/batchActions";
import { getAllBulkRawMaterialPOFailure,
  getAllBulkRawMaterialPORequest,
  getAllBulkRawMaterialPOSuccess } from '@/app/Actions/bulkRawMaterialPOActions';
import {
    getAllBatchRequest,
    getAllBatchSuccess,
    getAllBatchFailure,
} from "../../Actions/batchActions";
import { batchServices } from "@/app/services/batchService";
import SearchBar from "../SearchBar/SearchBar";
import { valueToPercent } from "@mui/base";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const OutwardBulkRawMaterialPoTable = () => {
  const { allBulkRawMaterialPO, loading, error } = useSelector(
    (state) => state.bulkRawMaterialPO
  );
  const { selectedRawMaterialId } = useSelector((state) => state.batch);
  const { allBatches } = useSelector((state) => state.batch);
  const dropDownBatchNumber = useSelector((state) => state.dropdown);

  const [formData, setFormData] = useState({
    batchNumber: null,
    quantity: null,
  });
  const [formDisabled, setFormDisabled] = useState(false); // State to disable form interactions
  const [openIndex, setOpenIndex] = useState(null);
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

  
  const sortedMaterials = allBulkRawMaterialPO.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedMaterials);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

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
      const response = await bulkRawMaterialPOServices.updateBulkRawMaterialPO(poId, {
        status: "fulfilled",
        listData: updatedListData,
      });
      if (response.success === true) {
        toast.success("B2B PO updated successfully",{
          autoClose: 1500,
          onClose: () => window.location.reload()
      });
      setFormDisabled(true);
    }
      return response;
    }
     catch (error) {
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
  }, [selectedRawMaterialId]);

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

  const toggleDropdown = (index, raw_material_Id) => {
    setOpenIndex(openIndex === index ? null : index);
    dispatch(setRawMaterialIdBatch(raw_material_Id));
  };

  useEffect(() => {
    setFilteredData(sortedMaterials);
    setCurrentPage(1);
  }, [sortedMaterials]);

  const handleSearch = (data) => {
    setFilteredData(data);
    setCurrentPage(1);
  };

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function chageCPage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const pageNumbers = [];
  const threshold = 10;

  if (totalPages <= threshold) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          onClick={() => chageCPage(i)}
          className={`page-item ${currentPage === i ? "active" : ""}`}
          key={i}
        >
          <a
            href="#"
            className="relative z-10 inline-flex items-center bg-white border rounded-lg px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)] focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
          >
            {i}
          </a>
        </li>
      );
    }
  } else {
    const leftOffset = Math.max(currentPage - Math.floor(threshold / 2), 1);
    const rightOffset = Math.min(
      leftOffset + threshold - 1,
      totalPages - threshold + 1
    );

    if (leftOffset > 1) {
      pageNumbers.push(
        <li key="ellipsis1">
          <span className="ellipsis">...</span>
        </li>
      );
    }

    for (let i = leftOffset; i <= rightOffset; i++) {
      pageNumbers.push(
        <li
          onClick={() => chageCPage(i)}
          className={`page-item ${currentPage === i ? "active" : ""}`}
          key={i}
        >
          <a
            href="#"
            className="relative z-10 inline-flex items-center border rounded-md border-[rgb(248,246,242)]  px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)] focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
          >
            {i}
          </a>
        </li>
      );
    }

    if (rightOffset < totalPages) {
      pageNumbers.push(
        <li key="ellipsis2">
          <span className="ellipsis">...</span>
        </li>
      );
    }
  }

  const searchKeys = ["raw_material_id", "quantity", "createdBy", "createdAt"];

  return (
    <div class="relative  overflow-x-auto   sm:rounded-lg">
       <ToastContainer />
      <div class="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)]  dark:border-[rgb(248,246,242)]  ">
        {/* search item button */}

        <SearchBar
          tableData={sortedMaterials}
          searchKeys={searchKeys}
          onSearch={handleSearch}
        />
        <div class="flex gap-4">
          <button
            onClick={() => convertToCSV(sortedMaterials)}
            className="relative z-10 inline-flex items-center bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
          >
            Download CSV
          </button>
        </div>
      </div>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]  dark:text-gray-400">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded     dark:bg-gray-700 dark:border-gray-600"
                />
                <label for="checkbox-all-search" class="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              BULK ORDER REF
            </th>
            <th scope="col" class="px-6 py-3">
              RAW MATERIAL NAME
            </th>

            <th scope="col" class="px-6 py-3">
              QUANTITY
            </th>
            <th scope="col" class="px-6 py-3">
              RAISED BY
            </th>
            <th scope="col" class="px-6 py-3">
              CREATED AT
            </th>
            <th scope="col" class="px-6 py-3">
              ACTIONS
            </th>
          </tr>
        </thead>
        {allBulkRawMaterialPO?.length > 0 ? (
          <tbody>
            {records.map((po, index) => (
              <tr
                id={index}
                class={`${
                  po.status === "fulfilled" ? "bg-green-100" : "bg-white"
                }  border-b-[0.15vw]  border-dashed border-[rgb(248,246,242)]  dark:border-[rgb(248,246,242)]  `}
              >
                <td class="w-4 p-4">
                  <div class="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label for="checkbox-table-search-1" class="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-[rgb(153,142,125)] max-w-[20vw]"
                >
                  {po?.bulkOrderReference}
                </th>
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-[rgb(153,142,125)] max-w-[20vw]"
                >
                  {po?.raw_material_id?.material_name}
                </th>

                <td class="px-6 py-4">{po?.quantity}</td>
                <td class="px-6 py-4">
                  {po?.createdBy?.firstName} {po?.createdBy?.lastName}
                </td>
                <td class="px-6 py-4">
                  {moment(po?.createdAt).format("DD MMM YYYY")}
                </td>

                <td>
                  {po.status !== "fulfilled" && (
                    <button
                      id="dropdownHoverButton"
                      className={`${
                        openIndex === index
                          ? "bg-[rgb(216,241,247)] text-[rgb(79,202,220)]"
                          : "text-[rgb(144,138,129)] bg-[rgb(248,246,242)]"
                      }   hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center `}
                      type="button"
                      onClick={() =>
                        toggleDropdown(index, po?.raw_material_id?._id)
                      }
                    >
                      Action
                      <svg
                        class="w-2.5 h-2.5 ms-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>
                  )}

                  {openIndex === index && (
                    <div
                      id="popup-modal"
                      tabIndex="-1"
                      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                      style={{
                        backdropFilter: "blur(2px)",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <div className="relative w-[50vw] h-[30vw] flex items-center justify-center bg-[#F8F6F2] text-[#838481] rounded-lg shadow">
                        <div className="relative w-[80vw] sm:w-[50vw] md:w-[70vw] lg:w-[80vw] xl:w-[80vw] h-[60vw] sm:h-[70vw] md:h-[50vw] lg:h-[40vw] xl:h-[35vw] flex items-center justify-center bg-[#F8F6F2] text-[#838481] rounded-lg shadow">
                          <div className="p-6 md:p-6 text-center ">
                            <div className="flex justify-end items-center mb-4 mt-0">
                              <div className="mr-20">
                                <span className="font-semibold text-xl sm:text-xl md:text-1.5xl lg:text-2xl">
                                  Total Quantity : &nbsp;
                                </span>

                                <span className="font-semibold text-[rgb(79,201,218)] text-xl sm:text-xl md:text-1.5xl lg:text-2xl">
                                  {po?.quantity}
                                </span>
                              </div>
                              <div onClick={addItemsInListArray}>
                                <Button
                                  title={"+Add"}
                                  bgColor={"bg-[gray]"}
                                  radius={"rounded-lg"}
                                  padding={"lg:py-3 px-7 md:py-2 md:px-5"}
                                  color={"text-[#ffff]"}
                                  textSize={"text-[1.2vw]"}
                                  fontWeight={"font-medium"}
                                  width={"w-[8vw]"}
                                  disabled={formDisabled} 
                                />
                              </div>
                            </div>
                            <div className="flex flex-col mt-5">
                              <div className="flex flex-row gap-5">
                                <div class="">
                                  <BatchNumbeDropdown
                                    name="batchNumber"
                                    options={batchesToShow}
                                  />
                                  {/* {errors.batchNumber && (
                                    <p className=" text-[0.9vw] mt-1 ml-1 flex items-start text-start text-red-500">
                                      {errors.batchNumber}
                                    </p>
                                  )} */}
                                </div>
                                <div class="">
                                  <Input
                                    bgColor={"bg-[#ffffff]"}
                                    radius={"rounded-lg"}
                                    padding={"px-3 py-3 "}
                                    type={"number"}
                                    color={"text-[#838481] text-gray-800"}
                                    textSize={
                                      "text-[1.5vw] sm:text-[2vw] md:text-[1.2vw]"
                                    }
                                    fontWeight={"font-medium"}
                                    name="quantity"
                                    placeholder="Enter quantity"
                                    value={formData.quantity || ""}
                                    onChange={handleChange}
                                  />
                                  {/* {errors.quantity && (
                                    <p className=" w-[20vw]  text-[0.9vw] mt-1 ml-1 flex items-start text-center text-red-400">
                                      {errors.quantity}
                                    </p>
                                  )} */}
                                </div>
                              </div>
                              {errors.totalQuantity && (
                                <p className="w-[20vw] mt-2 text-[1vw] mb-4 ml-1 flex items-start text-center text-red-400">
                                  {errors.totalQuantity}
                                </p>
                              )}
                              {errors.batchQuantity && (
                                <p className="w-[30vw] mt-2 text-[1vw] mb-4 ml-1 flex items-start text-center text-red-400">
                                  {errors.batchQuantity}
                                </p>
                              )}

                              <div className="overflow-y-scroll h-48 sm:h-64 md:h-48 mt-4 sm:mt-6 md:mt-8">
                                <ul className="bg-[#F8F6F2] rounded-lg p-4 flex flex-col items-center max-w-full lg:max-w-[70%] xl:max-w-[60%] mx-auto">
                                  {listData.map((item, index) => (
                                    <li
                                      key={index}
                                      className="font-semibold rounded-md my-1 bg-[#ffffff] px-3 py-2 flex flex-col sm:flex-row items-center w-full lg:w-[400px] gap-4"
                                    >
                                      <div className="flex mb-1 sm:mb-0 ">
                                        <span className="block sm:inline text-lg">
                                          Batch no: {item.batchNumber}
                                        </span>
                                      </div>
                                      <div className="flex mt-1 sm:mt-0 ml-0 max-w-[200px] mx-2 ">
                                        <span className="block sm:inline text-lg">
                                          Quantity: {item.quantity}
                                        </span>
                                      </div>
                                      <button
                                        className="bg-red-500 text-white rounded px-4 py-1 md:px-5 md:py-2.5 lg:px-6 lg:py-0 xl:px-7 xl:py-2 ml-auto "
                                        onClick={() => handleDelete(index)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="w-6 h-6"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M9.75 3a3 3 0 00-3 3v.75H4.5a.75.75 0 000 1.5h.464l.752 12.032A2.25 2.25 0 007.96 21h8.08a2.25 2.25 0 002.244-2.718L19.038 8.25h.462a.75.75 0 000-1.5h-2.25V6a3 3 0 00-3-3h-4.5zM7.5 6a1.5 1.5 0 011.5-1.5h4.5A1.5 1.5 0 0115 6v.75H7.5V6zm.75 4.5a.75.75 0 011.5 0v7.5a.75.75 0 01-1.5 0v-7.5zm5.25-.75a.75.75 0 10-1.5 0v7.5a.75.75 0 101.5 0v-7.5z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="flex mt-5 gap-4 justify-end">
                              <button
                                data-modal-hide="popup-modal"
                                type="button"
                                className="py-1 px-3 sm:py-2 sm:px-5 md:py-2 md:px-5 lg:py-3 lg:px-7 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 "
                                onClick={() => closeModal()}
                              >
                                Close
                              </button>
                              <div
                                onClick={() =>
                                  upatePoStatus(po?._id, listData, po?.quantity)
                                }
                              >
                                <Button
                                  title={"Fulfill"}
                                  bgColor={"bg-[rgb(79,201,218)]"}
                                  radius={"rounded-lg"}
                                  padding={
                                    "py-1 px-3 sm:py-2 sm:px-5 md:py-2 md:px-5 lg:py-3 lg:px-7"
                                  }
                                  color={"text-white"}
                                  textSize={"text-sm"}
                                  fontWeight={"font-medium"}
                                  disabled={formDisabled} 
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <div>loading.....</div>
        )}
      </table>
      <nav className="p-[1vw] flex ">
        <ul className="pagination flex gap-[1vw]">
          <li className="page-item">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={prePage}
            >
              Prev
            </a>
          </li>
          {pageNumbers}
          <li className="page-item">
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={nextPage}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
         {/* Overlay to prevent user interaction */}
    {formDisabled && (
      <div
        className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
        style={{ zIndex: 1000 }}
      />
    )}
    </div>
  );
};

export default OutwardBulkRawMaterialPoTable;
