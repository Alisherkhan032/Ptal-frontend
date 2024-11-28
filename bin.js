// 'use client';
// import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { getBatchNumber } from '../../Actions/dropdownValuesActions';
// import { setSelectedBatch } from '../../Actions/batchActions';

// const BatchNumberDropdown = ({ bgColor, height, width, options }) => {
//   const dropdownStyle = {
//     backgroundColor: bgColor || 'white',
//     height: height || '3.5vw',
//     minHeight: '3.5vw',
//     width: width || 'auto',
//     color: '#838481',
//     fontSize: '1.1vw',
//   };

//   const dispatch = useDispatch();

//   useEffect(() => {
//     // Log the options array to ensure it's structured correctly
//     console.log('Options:', options);
//   }, [options]);

//   const handleBatchNumberChange = (event) => {
//     const selectedBatchNumber = event.target.value;
//     console.log('Selected Batch Number:', selectedBatchNumber);

//     // Retrieve the selected batch object from the data attribute
//     const selectedBatch = JSON.parse(event.target.options[event.target.selectedIndex].getAttribute('data-batch'));
//     console.log('Selected Batch=========', selectedBatch);

//     dispatch(getBatchNumber(selectedBatchNumber));
//     dispatch(setSelectedBatch(selectedBatch));
//   };

//   return (
//     <select
//       style={dropdownStyle}
//       className="w-full text-[#838481] font-medium px-4 py-[1vw] rounded-lg leading-tight focus:outline-none"
//       onChange={handleBatchNumberChange}
//     >
//       <option value="">Select Batch Number</option>
//       {options.map((batch) => {
//         console.log('Batch:', batch);
//         return (
//           <option
//             className="text-[#838481] py-[1vw] text-[1.1vw] font-medium"
//             key={batch._id}
//             value={batch.batch_number}
//             data-batch={JSON.stringify(batch)}
//           >
//             {batch.batch_number}
//           </option>
//         );
//       })}
//     </select>
//   );
// };

// export default BatchNumberDropdown;
