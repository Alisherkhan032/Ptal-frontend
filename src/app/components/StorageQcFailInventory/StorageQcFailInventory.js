'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Button from '../Button/Button';
import { useSelector } from 'react-redux';
import SearchBar from '../SearchBar/SearchBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const StorageQcFailInventory = () => {
  const { allPO } = useSelector((state) => state.po);

  const [startDate, setStartDate] = useState(moment().subtract(30, 'days').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [expandedItems, setExpandedItems] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const currentDateAndFileName = `Storage_QC_Failed_Inventory_${moment().format('DD-MMM-YYYY')}`;

  // Step 1: Filter, group, and sort data
  const groupedMaterials = useMemo(() => {
    const dateFilteredData = allPO
      .filter((po) => 
        (po.status === 'fulfilled' || po.status === 'qc_info_added') && po.qcData?.failedQcInfo > 0
      )
      .filter((po) => {
        const poDate = moment(po.updatedAt);
        return poDate.isBetween(moment(startDate), moment(endDate), null, '[]');
      });

    // Group by raw material name
    const grouped = dateFilteredData.reduce((acc, po) => {
      const materialName = po.raw_material_id.material_name;
      if (!acc[materialName]) {
        acc[materialName] = {
          materialName,
          totalFailedQcQuantity: 0,
          items: [],
        };
      }
      acc[materialName].totalFailedQcQuantity += po.qcData.failedQcInfo;
      acc[materialName].items.push(po);
      return acc;
    }, {});

    return Object.values(grouped);
  }, [allPO, startDate, endDate]);

  useEffect(() => {
    setFilteredData(groupedMaterials);
    setCurrentPage(1);
  }, [groupedMaterials]);

  // Pagination for grouped items
  const records = useMemo(() => {
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    return filteredData.slice(firstIndex, lastIndex);
  }, [currentPage, filteredData]);

  const npage = Math.ceil(filteredData.length / recordsPerPage);

  // Toggle item expansion
  const toggleExpand = (materialName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [materialName]: !prev[materialName],
    }));
  };

  const handleSearch = (data) => {
    setFilteredData(data);
    setCurrentPage(1);
  };

  // CSV conversion function
  const convertToCSV = () => {
    const headers = [
      'RAW MATERIAL NAME', 'TOTAL QC-FAILED QUANTITY', 'VENDOR NAME', 'PO NUMBER', 'BILL NUMBER', 'QC-FAILED QUANTITY'
    ];

    // Expand grouped data to a CSV-friendly structure
    const rows = groupedMaterials.flatMap((group) => 
      group.items.map((item) => [
        group.materialName,
        group.totalFailedQcQuantity,
        item.vendor_id?.vendor_name,
        item.po_number,
        item.bill_number,
        item.qcData.failedQcInfo,
      ])
    );

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', currentDateAndFileName + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const chageCPage = (id) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="p-4 flex-wrap flex justify-between items-center gap-4 border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)] rounded-lg mb-4">
        <SearchBar tableData={groupedMaterials} searchKeys={['materialName']} onSearch={handleSearch} className="w-fill md:w-auto"/>
        <div className="flex gap-4 items-center flex-wrap">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="px-2 py-1 border rounded text-black"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="px-2 py-1 border rounded text-black"
            placeholderText="End Date"
          />
          <button
            onClick={convertToCSV}
            className="relative z-10 inline-flex items-center bg-green-500 text-dark px-4 py-2 text-sm font-semibold rounded-lg"
          >
            Download CSV
          </button>
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">RAW MATERIAL NAME</th>
            <th scope="col" className="px-6 py-3">TOTAL QC-FAILED QUANTITY</th>
          </tr>
        </thead>
        {filteredData.length > 0 ? (
          <tbody>
            {records.map((group, index) => (
              <React.Fragment key={index}>
                <tr
                  onClick={() => toggleExpand(group.materialName)}
                  className="cursor-pointer bg-white border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]"
                >
                  <td className="px-6 py-4 font-medium text-[rgb(153,142,125)]">{group.materialName}</td>
                  <td className="px-6 py-4">{group.totalFailedQcQuantity}</td>
                </tr>
                {expandedItems[group.materialName] && (
                  <tr>
                    <td colSpan="2">
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead>
                          <tr>
                            <th className="px-6 py-3">VENDOR NAME</th>
                            <th className="px-6 py-3">PO NUMBER</th>
                            <th className="px-6 py-3">BILL NUMBER</th>
                            <th className="px-6 py-3">QC-FAILED QUANTITY</th>
                            <th className="px-6 py-3">COMMENTS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map((item, subIndex) => (
                            <tr key={subIndex} className="bg-gray-50 border-b border-gray-200">
                              <td className="px-6 py-4">{item.vendor_id?.vendor_name}</td>
                              <td className="px-6 py-4">{item.po_number}</td>
                              <td className="px-6 py-4">{item.bill_number}</td>
                              <td className="px-6 py-4">{item.qcData.failedQcInfo}</td>
                              <td className="px-6 py-4">{item.qcData.comment}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        ) : (
          <tr>
            <td colSpan="2" className="text-center p-5 font-semibold text-red-300">No data available</td>
          </tr>
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
          {Array.from({ length: npage }, (_, i) => i + 1).map((i) => (
            <li key={i} onClick={() => chageCPage(i)} className={`page-item ${currentPage === i ? 'active' : ''}`}>
              <a href="#" className="relative z-10 inline-flex items-center bg-white border rounded-lg px-4 py-2 text-sm font-semibold text-[hsl(36,12%,55%)]">
                {i}
              </a>
            </li>
          ))}
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

export default StorageQcFailInventory;
