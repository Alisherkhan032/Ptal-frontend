"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import BatchNumbeDropdown from "../BatchNumbeDropdown/BatchNumbeDropdown";
import Input from "../Input/Input";
import Button from "../Button/Button";
import SearchBar from "../SearchBar/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const InwardAssemblyPoTable = () => {
  const { allAssemblyPO, loading, error } = useSelector(
    (state) => state.assemblyPO
  );
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
  const currentDateAndFileName = `Outward_Assembly_PO_${moment().format(
    "DD-MMM-YYYY"
  )}`;


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


  useEffect(() => {
    setFormData({
      ...formData,
      batchNumber: dropDownBatchNumber,
    });
  }, [dropDownBatchNumber]);

  console.log("allAssemblyPO====", allAssemblyPO);

  const sortedMaterials = allAssemblyPO.sort((a, b) => {
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
    <div className="relative overflow-x-auto sm:rounded-lg">
      <ToastContainer />
      <div className="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)]">
        {/* Search item button */}
        <SearchBar
          tableData={sortedMaterials}
          searchKeys={searchKeys}
          onSearch={handleSearch}
        />
        <div className="flex gap-4">
          <button
            onClick={() => convertToCSV(sortedMaterials)}
            className="relative z-10 inline-flex items-center bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
          >
            Download CSV
          </button>
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">RAW MATERIAL NAME</th>
            <th scope="col" className="px-6 py-3">QUANTITY</th>
            <th scope="col" className="px-6 py-3">RAISED BY</th>
            <th scope="col" className="px-6 py-3">CREATED AT</th>
            <th scope="col" className="px-6 py-3">ACTIONS</th>
          </tr>
        </thead>
        {allAssemblyPO?.length > 0 ? (
          <tbody>
            {records.map((po, index) => (
              <tr
                key={index}
                className={`${
                  po.status === "fulfilled" ? "bg-green-100" : "bg-white"
                } border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)]`}
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-search-${index}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor={`checkbox-table-search-${index}`} className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-[rgb(153,142,125)] max-w-[20vw]"
                >
                  {po?.raw_material_id?.material_name}
                </th>
                <td className="px-6 py-4">{po?.quantity}</td>
                <td className="px-6 py-4">
                  {po?.createdBy?.firstName} {po?.createdBy?.lastName}
                </td>
                <td className="px-6 py-4">
                  {moment(po?.createdAt).format("DD MMM YYYY")}
                </td>
                <td>
                  {po.status !== "fulfilled" && (
                    <Link href={`/storage/outward_assembly_po/outward_po/${po?._id}`}>
                      <button
                        className="text-[rgb(144,138,129)] bg-[rgb(248,246,242)] hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                        type="button"
                      >
                        Action
                      </button>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="6" className="text-center py-4">Loading...</td>
            </tr>
          </tbody>
        )}
      </table>
      <nav className="p-[1vw] flex">
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

export default InwardAssemblyPoTable;
