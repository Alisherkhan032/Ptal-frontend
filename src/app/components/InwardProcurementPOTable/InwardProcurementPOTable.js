

'use client';
import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../Input/Input';
import { poServices } from '@/app/services/poService';
import SearchBar from '../SearchBar/SearchBar';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const InwardProcurementPOTable = () => {
  const { allPO, loading, error } = useSelector((state) => state.po);
  const [openIndex, setOpenIndex] = useState(null);
  const [openDropDownToggle, setDropDownToggle] = useState(null);
  const [formData, setFormData] = useState({
    passedQcInfo: null,
    failedQcInfo: null,
    comment: null,
  });
  const [errors, setErrors] = useState({
    passedQcInfo: '',
    failedQcInfo: '',
    comment: '',
    quantity: '',
  });
  const sortedMaterials = allPO
  .filter((po) => po.status !== 'fulfilled') // Only include POs where status is not 'fulfilled'
  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const [filteredData, setFilteredData] = useState(sortedMaterials);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);
  const currentDateAndFileName = `Inward_Procurement_PO_${moment().format(
    'DD-MMM-YYYY'
  )}`;

  const convertToCSV = (data) => {
    const headers = [
      'CREATED AT',
      'VENDOR NAME',
      'PO NUMBER',
      'QUANTITY',
      'RAW MATERIAL NAME',
      'GRN',
      'RAISED BY',
    ];

    const rows = data.map((po) => [
      moment(po?.createdAt).format('DD MMM YYYY'),
      po?.vendor_id?.vendor_name,
      po?.po_number,
      po?.quantity,
      po?.raw_material_id?.material_name,
      po?.grn_number,
      `${po?.created_by?.firstName} ${po?.created_by?.lastName}`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', currentDateAndFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleDropdownMenu = (index) => {
    setDropDownToggle(openDropDownToggle === index ? null : index);
  };


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: '',
      quantity: '',
    });
  };

  const validateForm = (poQuantity) => {
    let valid = true;
    let newErrors = {};

    if (!formData.passedQcInfo) {
      newErrors.passedQcInfo = 'This field is required';
      valid = false;
    }
    if (!formData.failedQcInfo) {
      newErrors.failedQcInfo = 'This field is required';
      valid = false;
    }
    if (!formData.comment) {
      newErrors.comment = 'This field is required';
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
    if (!validateForm(poQuantity)) return;
    try {
      const response = await poServices.updateQcInfo(poId, {
        status: 'qc_info_added',
        formData: formData,
      });
      console.log('response=====', response);
      if (response.success === true) {
        console.log('trigger====');
        window.location.reload();
      }

      return response;
    } catch (error) {
      // Handle error
      console.error('Error updating PO status:', error);
    }
  };


  const generateBatchSticker = async (poId) => {
    try {
      const response = await poServices.generateBatchSticker(poId);
      console.log('response=====', response);

      const blob = new Blob([response], { type: 'application/pdf' });
      console.log('blob=====', blob);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'PoQR_Codes.pdf';

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
      console.error('Error updating PO status:', error);
    }
  };

  function closeModal() {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    setFormData({
      passedQcInfo: '',
      failedQcInfo: '',
      comment: '',
    });
    setErrors({
      passedQcInfo: '',
      failedQcInfo: '',
      comment: '',
      quantity: '',
    });
  }

  useEffect(() => {
    const sortedMaterials = allPO
      .filter((po) => po.status !== 'fulfilled') // Only include POs where status is not 'fulfilled'
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
    setFilteredData(sortedMaterials);
    setCurrentPage(1);
  }, [allPO]);
  

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
  // Calculate page numbers to be displayed
  const pageNumbers = [];
  const threshold = 10;

  if (totalPages <= threshold) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          onClick={() => chageCPage(i)}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
          key={i}
        >
          <a
            href="#"
            className="relative z-10 inline-flex items-center bg-white border rounded-lg px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)] focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
          className={`page-item ${currentPage === i ? 'active' : ''}`}
          key={i}
        >
          <a
            href="#"
            className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)] focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

  const searchKeys = [
    'vendor_id',
    'po_number',
    'quantity',
    'raw_material_id',
    'grn_number',
    'quantity',
  ];

  return (
    <div class="relative overflow-x-auto    sm:rounded-lg">
      <div class="p-[2vw] w-full flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)]  dark:border-[rgb(248,246,242)]  ">
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
              CREATED AT
            </th>
            <th scope="col" class="px-6 py-3">
              VENDOR NAME
            </th>
            <th scope="col" class="px-6 py-3">
              PO NUMBER
            </th>
            <th scope="col" class="px-6 py-3">
              BILL NUMBER
            </th>
            <th scope="col" class="px-6 py-3">
              QUANTITY
            </th>
            <th scope="col" class="px-6 py-3">
              RAW MATERIAL NAME
            </th>
            <th scope="col" class="px-6 py-3">
              GRN
            </th>

            <th scope="col" class="px-6 py-3">
              RAISED BY
            </th>
          </tr>
        </thead>
        {allPO?.length > 0 ? (
          <tbody>
             { records.length === 0? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-5 font-semibold  text-red-300"
                >
                  Item not found !
                </td>
              </tr>
            ) : (
              records.map((po, index) => (
                <tr
                  id={index}
                  className={`${
                        po.status === 'qc_info_added' 
                        ? 'bg-yellow-50' 
                        : 'bg-white'
                  } border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)]`}
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
                  <td className="px-6 py-4">
                    {moment(po?.createdAt).format('DD MMM YYYY')}
                  </td>
                  <td className="px-6 py-4">{po?.vendor_id?.vendor_name}</td>
                  <td className="px-6 py-4">{po?.po_number}</td>
                  <td className="px-6 py-4">{po?.bill_number}</td>
                  <td className="px-6 py-4">{po?.quantity}</td>
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-[rgb(153,142,125)] max-w-[20vw]"
                  >
                    {po?.raw_material_id?.material_name}
                  </th>
                  <td className="px-6 py-4">{po?.grn_number}</td>

                  <td className="px-6 py-4">
                    {po?.created_by?.firstName} {po?.created_by?.lastName}
                  </td>

                  <td>
                    <button
                      id="dropdownHoverButton"
                      className={`${
                        openIndex === index
                          ? 'bg-[rgb(216,241,247)] text-[rgb(79,202,220)]'
                          : 'text-[rgb(144,138,129)] bg-[rgb(248,246,242)]'
                      }   hover:bg-[rgb(216,241,247)] hover:text-[rgb(79,202,220)] focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center `}
                      type="button"
                      onClick={() => toggleDropdownMenu(index)}
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

                    {/* below code is for dropdown items */}
                    {openDropDownToggle === index && (
                      <div
                        id="dropdownHover"
                        className="z-1000 absolute min-w-24 max-w-24 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
                      >
                        <ul
                          className="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownHoverButton"
                        >
                          {po.status === "pending" && (
                            
                            <li>
                            <a
                              onClick={() => generateBatchSticker(po?._id)}
                              href="#"
                              className="block px-4 py-2 text-sm font-medium text-[rgb(144,138,129)] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Generate Batch Sticker
                            </a>
                          </li>
                          )}
                          {po.status === "qc_info_added" && (
                            <>
                              
                              <li>
                                <Link
                                  href={`/storage/inward_procurement_po/inward_po/${po?._id}`} // Dynamic route for inward page
                                  key={po?._id}
                                >
                                  <div
                                    className="block px-4 py-2 text-sm font-medium text-[rgb(144,138,129)] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    style={{ cursor: 'pointer' }}
                                  >
                                    Inward
                                  </div>
                                </Link>
                              </li>
                              <li>
                            <a
                              onClick={() => generateBatchSticker(po?._id)}
                              href="#"
                              className="block px-4 py-2 text-sm font-medium text-[rgb(144,138,129)] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Generate Batch Sticker
                            </a>
                          </li>
                            </>
                          )}
                          {po.status === "batch_generated" && (
                            <>
                              <li>
                              <a
                                onClick={() => toggleDropdown(index)}
                                href="#"
                                className="block px-4 py-2 text-sm font-medium text-[rgb(144,138,129)] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Enter QC Info
                              </a>
                            </li>
                            <li>
                            <a
                              onClick={() => generateBatchSticker(po?._id)}
                              href="#"
                              className="block px-4 py-2 text-sm font-medium text-[rgb(144,138,129)] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Generate Batch Sticker
                            </a>
                          </li>
                            </>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* below code is for modal */}
                    {openIndex === index && (
                      <div
                        id="popup-modal"
                        tabIndex="-1"
                        className=" flex  overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                        style={{
                          backdropFilter: 'blur(2px)',
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                          <div className="relative w-[40vw] flex items-center justify-center bg-[#F8F6F2] text-[#838481] rounded-lg shadow ">
                            <div className="p-4 md:p-5 text-center">
                              <div className="flex justify-end items-center"></div>
                              <div className="flex flex-col mt-3  gap-5">
                                <div>
                                  <span className="font-semibold ">
                                    Total Quantity :
                                  </span>{' '}
                                  <span className=" font-semibold text-[rgb(79,201,218)]">
                                    {po?.quantity}
                                  </span>
                                </div>

                                <div className="flex flex-row gap-5">
                                  <div className="flex flex-col gap-3">
                                    <div className="flex flex-col">
                                      <Input
                                        bgColor={'bg-[#ffffff]'}
                                        radius={'rounded-lg'}
                                        height={'h-[3.5vw] min-h-[3.5vh]'}
                                        padding={'p-[1vw]'}
                                        type={'number'}
                                        color={'text-[#838481]'}
                                        textSize={'text-[1vw]'}
                                        fontWeight={'font-medium'}
                                        name="passedQcInfo"
                                        placeholder="Enter QC passed quantity"
                                        width={'w-[20vw]'}
                                        value={formData.passedQcInfo}
                                        onChange={handleChange}
                                      />
                                      {errors.passedQcInfo && (
                                        <p className=" text-[0.9vw] mt-1 ml-1 flex items-start text-start text-red-500">
                                          {errors.passedQcInfo}
                                        </p>
                                      )}
                                    </div>

                                    <div className="flex flex-col">
                                      <Input
                                        bgColor={'bg-[#ffffff]'}
                                        radius={'rounded-lg'}
                                        height={'h-[3.5vw] min-h-[3.5vh]'}
                                        padding={'p-[1vw]'}
                                        type={'number'}
                                        color={'text-[#838481]'}
                                        textSize={'text-[1vw]'}
                                        fontWeight={'font-medium'}
                                        name="failedQcInfo"
                                        placeholder="Enter QC failed quantity"
                                        width={'w-[20vw]'}
                                        value={formData.failedQcInfo}
                                        onChange={handleChange}
                                      />
                                      {errors.failedQcInfo && (
                                        <p className=" text-[0.9vw] mt-1 ml-1 flex items-start text-start text-red-400">
                                          {errors.failedQcInfo}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <Input
                                        bgColor={'bg-[#ffffff]'}
                                        radius={'rounded-lg'}
                                        height={'h-[3.5vw] min-h-[3.5vh]'}
                                        padding={'p-[1vw]'}
                                        type={'text'}
                                        color={'text-[#838481]'}
                                        textSize={'text-[1vw]'}
                                        fontWeight={'font-medium'}
                                        name="comment"
                                        placeholder="Comment"
                                        width={'w-[20vw]'}
                                        value={formData.comment}
                                        onChange={handleChange}
                                      />
                                      {errors.comment && (
                                        <p className="  text-[0.9vw] mt-1 ml-1 flex items-start text-start text-red-400">
                                          {errors.comment}
                                        </p>
                                      )}
                                    </div>
                                    {errors.quantity && (
                                      <p className=" w-[20vw]  text-[0.9vw] mt-1 ml-1 flex items-start text-center text-red-400">
                                        {errors.quantity}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex mt-3 gap-4 justify-end">
                                <button
                                  data-modal-hide="popup-modal"
                                  type="button"
                                  className="py-2.2 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                  onClick={() => closeModal()}
                                >
                                  Close
                                </button>
                                <div
                                  onClick={() =>
                                    updateQcInfo(po?._id, po?.quantity)
                                  }
                                >
                                  <Button
                                    title={'Fulfill'}
                                    bgColor={'bg-[rgb(79,201,218)]'}
                                    radius={'rounded-lg'}
                                    height={'h-[3vw] min-h-[3vh]'}
                                    padding={'p-[1vw]'}
                                    color={'text-[#ffff]'}
                                    textSize={'text-[1vw]'}
                                    fontWeight={'font-medium'}
                                    width={'w-[7vw]'}
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
              ))
            )}
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
    </div>
  );
};

export default InwardProcurementPOTable;

