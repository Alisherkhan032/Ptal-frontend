import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import SearchBar from '../SearchBar/SearchBar';

const RaiseStoragePOTable = () => {
  const { allPO, loading, error } = useSelector((state) => state.po);
  const route = useRouter();

  const sortedMaterials = allPO.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const [filteredData, setFilteredData] = useState(sortedMaterials);
  console.log('sortedMaterials====', sortedMaterials);

  console.log('filteredData===,', filteredData);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);
  const currentDateAndFileName = `Raise_Vendor_PO_${moment().format(
    'DD-MMM-YYYY'
  )}`;

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

  const convertToCSV = (data) => {
    const headers = [
      'RAW MATERIAL NAME',
      'GRN',
      'PO NUMBER',
      'VENDOR NAME',
      'QUANTITY',
      'RAISED BY',
      'CREATED AT',
    ];

    const rows = data.map((po) => [
      po?.raw_material_id?.material_name,
      po?.grn_number,
      po?.po_number,
      po?.vendor_id?.vendor_name,
      po?.quantity,
      `${po?.created_by?.firstName} ${po?.created_by?.lastName}`,
      moment(po?.createdAt).format('DD MM YYYY') || '',
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

  const searchKeys = [
    'grn_number',
    'created_by',
    'vendor_id',
    'raw_material_id',
    'po_number',
    'quantity',
  ];

  return (
    <div class="relative scrollbar-none overflow-x-auto sm:rounded-lg">
      <div class="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)]">
        <SearchBar
          tableData={sortedMaterials}
          searchKeys={searchKeys}
          onSearch={handleSearch}
        />
        <div class="flex gap-4">
          <div onClick={() => route.push('/procurement/raise_po_form')}>
            <Button
              title={'PO Raise'}
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
          <button
            onClick={() => convertToCSV(allPO)}
            className="relative z-10 inline-flex items-center bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
          >
            Download CSV
          </button>
        </div>
      </div>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:text-gray-400">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label for="checkbox-all-search" class="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              RAW MATERIAL NAME
            </th>
            <th scope="col" class="px-6 py-3">
              GRN
            </th>
            <th scope="col" class="px-6 py-3">
              PO NUMBER
            </th>
            <th scope="col" class="px-6 py-3">
              VENDOR NAME
            </th>
            <th scope="col" class="px-6 py-3">
              BILL NUMBER
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
          </tr>
        </thead>
        {allPO?.length > 0 ? (
          <tbody>
            {records.length === 0 ? (
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
                  class={`${
                    po.status === 'fulfilled' ? 'bg-green-100' : po.status === 'qc_info_added' 
                        ? 'bg-yellow-50' :'bg-white'
                  } border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)]`}
                >
                  <td class="w-4 p-4">
                    <div class="flex items-center">
                      <input
                        id={`checkbox-table-search-${index}`}
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        for={`checkbox-table-search-${index}`}
                        class="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-[rgb(153,142,125)] max-w-[20vw]"
                  >
                    {po?.raw_material_id?.material_name}
                  </th>
                  <td class="px-6 py-4">{po?.grn_number}</td>
                  <td class="px-6 py-4">{po?.po_number}</td>
                  <td class="px-6 py-4">{po?.vendor_id?.vendor_name}</td>
                  <td class="px-6 py-4">{po?.bill_number}</td>
                  <td class="px-6 py-4">{po?.quantity}</td>
                  <td class="px-6 py-4">
                    {po?.created_by?.firstName} {po?.created_by?.lastName}
                  </td>
                  <td class="px-6 py-4">
                    {moment(po?.createdAt).format('DD MMM YYYY')}
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

export default RaiseStoragePOTable;
