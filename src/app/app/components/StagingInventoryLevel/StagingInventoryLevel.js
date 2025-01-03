// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import moment from 'moment';
// import SearchBar from '../SearchBar/SearchBar';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';


// const StagingInventoryLevel = () => {
//   const { allPO } = useSelector((state) => state.po);
//   const [groupedData, setGroupedData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [startDate, setStartDate] = useState(moment().subtract(30, 'days').toDate());
//   const [endDate, setEndDate] = useState(new Date());

//   // Pagination constants
//   const recordsPerPage = 50;
//   const lastIndex = currentPage * recordsPerPage;
//   const firstIndex = lastIndex - recordsPerPage;
//   const records = groupedData.slice(firstIndex, lastIndex);
//   const npage = Math.ceil(groupedData.length / recordsPerPage);
//   const pageNumbers = [...Array(npage + 1).keys()].slice(1);

//   // Filter and group data by raw material name
//   useEffect(() => {
//     if (allPO) {
//       const filteredPOs = allPO.filter((po) => {
//         const updatedAt = moment(po.updatedAt);
//         return updatedAt.isBetween(moment(startDate), moment(endDate), null, '[]');
//       });

//       const pendingPOs = filteredPOs.filter(
//         (po) => po.status === 'pending' || po.status === 'batch_generated'
//       );

//       const grouped = pendingPOs.reduce((acc, po) => {
//         const materialName = po.raw_material_id?.material_name || 'Unknown Material';
//         if (!acc[materialName]) {
//           acc[materialName] = {
//             materialName,
//             totalQuantity: 0,
//             totalWeight: 0,
//             poCount: 0,
//           };
//         }
//         acc[materialName].totalQuantity += po.quantity || 0;
//         acc[materialName].totalWeight += po.weight || 0;
//         acc[materialName].poCount += 1;
//         return acc;
//       }, {});

//       setGroupedData(Object.values(grouped));
//     }
//   }, [allPO, startDate, endDate]);

//   const handleSearch = (data) => {
//     setGroupedData(data);
//     setCurrentPage(1);
//   };

//   const convertToCSV = (data) => {
//     const headers = ['RAW MATERIAL NAME', 'TOTAL QUANTITY', 'TOTAL WEIGHT', 'PO COUNT'];
//     const rows = data.map((item) => [
//       item.materialName,
//       item.totalQuantity,
//       item.totalWeight,
//       item.poCount,
//     ]);

//     const csvContent =
//       'data:text/csv;charset=utf-8,' +
//       [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     const fileName = `Grouped_POs_${moment().format('DD-MMM-YYYY')}.csv`;
//     link.setAttribute('download', fileName);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="relative overflow-x-auto mr-[1vw] sm:rounded-lg">
//       {/* Header Section */}
//       <div className="p-[2vw] flex justify-between border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)]">
//         <SearchBar
//           tableData={groupedData}
//           searchKeys={['materialName']}
//           onSearch={handleSearch}
//         />
//         <div className="flex gap-4 items-center">
//           <DatePicker
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             className="px-2 py-1 border rounded"
//             placeholderText="Start Date"
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={(date) => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//             className="px-2 py-1 border rounded"
//             placeholderText="End Date"
//           />
//           <button
//             onClick={() => convertToCSV(groupedData)}
//             className="relative z-10 inline-flex items-center bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
//           >
//             Download CSV
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <table className="w-full text-sm text-left text-gray-500">
//         <thead className="text-xs text-gray-400 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]">
//           <tr>
//             <th className="px-6 py-3">RAW MATERIAL NAME</th>
//             <th className="px-6 py-3">TOTAL QUANTITY</th>
//             <th className="px-6 py-3">TOTAL WEIGHT</th>
//             <th className="px-6 py-3">PO COUNT</th>
//           </tr>
//         </thead>
//         <tbody>
//           {records.length === 0 ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className="text-center p-5 font-semibold text-red-300"
//               >
//                 No pending POs found!
//               </td>
//             </tr>
//           ) : (
//             records.map((item, index) => (
//               <tr
//                 key={index}
//                 className="bg-white border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] hover:bg-gray-50"
//               >
//                 <th
//                   scope="row"
//                   className="px-6 py-4 font-medium text-[hsl(36,12%,55%)] max-w-[20vw]"
//                 >
//                   {item.materialName}
//                 </th>
//                 <td className="px-6 py-4">{item.totalQuantity}</td>
//                 <td className="px-6 py-4">{item.totalWeight}</td>
//                 <td className="px-6 py-4">{item.poCount}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <nav className="p-[1vw] flex">
//         <ul className="pagination flex gap-[1vw]">
//           <li>
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Prev
//             </button>
//           </li>
//           {pageNumbers.map((num) => (
//             <li key={num}>
//               <button
//                 onClick={() => setCurrentPage(num)}
//                 className={`${
//                   num === currentPage
//                     ? 'bg-indigo-600 text-white'
//                     : 'bg-gray-100 text-gray-700'
//                 } px-3 py-1.5 rounded-md`}
//               >
//                 {num}
//               </button>
//             </li>
//           ))}
//           <li>
//             <button
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, npage))}
//               className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Next
//             </button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default StagingInventoryLevel;

'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import SearchBar from '../SearchBar/SearchBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StagingInventoryLevel = () => {
  const { allPO } = useSelector((state) => state.po);
  const [groupedData, setGroupedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days').toDate());
  const [endDate, setEndDate] = useState(new Date());

  // Pagination constants
  const recordsPerPage = 50;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = groupedData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(groupedData.length / recordsPerPage);
  const pageNumbers = [...Array(npage + 1).keys()].slice(1);

  // Filter and group data by raw material name
  useEffect(() => {
    if (allPO) {
      const filteredPOs = allPO.filter((po) => {
        const updatedAt = moment(po.updatedAt);
        return updatedAt.isBetween(moment(startDate), moment(endDate), null, '[]');
      });

      const pendingPOs = filteredPOs.filter(
        (po) => po.status === 'pending' || po.status === 'batch_generated'
      );

      const grouped = pendingPOs.reduce((acc, po) => {
        const materialName = po.raw_material_id?.material_name || 'Unknown Material';
        if (!acc[materialName]) {
          acc[materialName] = {
            materialName,
            totalQuantity: 0,
            totalWeight: 0,
            poCount: 0,
          };
        }
        acc[materialName].totalQuantity += po.quantity || 0;
        acc[materialName].totalWeight += po.weight || 0;
        acc[materialName].poCount += 1;
        return acc;
      }, {});

      setGroupedData(Object.values(grouped));
    }
  }, [allPO, startDate, endDate]);

  const handleSearch = (data) => {
    setGroupedData(data);
    setCurrentPage(1);
  };

  const convertToCSV = (data) => {
    const headers = ['RAW MATERIAL NAME', 'TOTAL QUANTITY', 'TOTAL WEIGHT', 'PO COUNT'];
    const rows = data.map((item) => [
      item.materialName,
      item.totalQuantity,
      item.totalWeight,
      item.poCount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fileName = `Grouped_POs_${moment().format('DD-MMM-YYYY')}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative overflow-x-auto mr-[1vw] sm:rounded-lg">
      {/* Header Section */}
      <div className="p-4 flex flex-wrap justify-between items-center gap-4 border-[0.15vw] bg-[rgb(253,252,251)] border-dashed border-[rgb(248,246,242)] rounded-lg mb-4">
        <SearchBar
          tableData={groupedData}
          searchKeys={['materialName']}
          onSearch={handleSearch}
          className="w-full md:w-auto"
        />
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="px-2 py-2 border rounded"
              placeholderText="Start Date"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="px-2 py-2 border rounded"
              placeholderText="End Date"
            />
          </div>
          <button
            onClick={() => convertToCSV(groupedData)}
            className="inline-flex items-center bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-lg"
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-400 uppercase border-b-[0.15vw] border-dashed border-[rgb(248,246,242)]">
          <tr>
            <th className="px-6 py-3">RAW MATERIAL NAME</th>
            <th className="px-6 py-3">TOTAL QUANTITY</th>
            <th className="px-6 py-3">TOTAL WEIGHT</th>
            <th className="px-6 py-3">PO COUNT</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="text-center p-8 font-semibold text-red-300"
              >
                No pending POs found!
              </td>
            </tr>
          ) : (
            records.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] hover:bg-gray-50"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-[hsl(36,12%,55%)] max-w-[20vw]"
                >
                  {item.materialName}
                </th>
                <td className="px-6 py-4">{item.totalQuantity}</td>
                <td className="px-6 py-4">{item.totalWeight}</td>
                <td className="px-6 py-4">{item.poCount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav className="p-[1vw] flex justify-center">
        <ul className="pagination flex gap-2">
          <li>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Prev
            </button>
          </li>
          {pageNumbers.map((num) => (
            <li key={num}>
              <button
                onClick={() => setCurrentPage(num)}
                className={`${
                  num === currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                } px-3 py-1.5 rounded-md`}
              >
                {num}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, npage))}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default StagingInventoryLevel;
