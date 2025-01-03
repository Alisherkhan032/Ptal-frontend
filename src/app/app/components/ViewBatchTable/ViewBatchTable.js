import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import DynamicTableWithoutAction from '../DynamicTableWithoutAction/DynamicTableWithoutAction';

const ViewBatchTable = () => {
  const { allBatches } = useSelector((state) => state.batch);

  // Sort the batches by createdAt in descending order
  const sortedBatches = allBatches?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const headings = {
  material_name: {
    label: "Material Name",
    renderCell: (row) => row?.raw_material_id?.material_name || "N/A",
    isSticky: false,
  },
  po_number: {
    label: "PO Number",
    renderCell: (row) => row?.po_id?.po_number || "N/A",
    isSticky: false,
  },
  batch_number: {
    label: "Batch Number",
    renderCell: (row) => row?.batch_number || "N/A",
    isSticky: false,
  },
  quantity: {
    label: "Quantity",
    renderCell: (row) => row?.quantity || "N/A",
    isSticky: false,
  },
  weight: {
    label: "Weight",
    renderCell: (row) => row?.po_id?.weight || "N/A",
    isSticky: false,
  },
  created_by: {
    label: "Created By",
    renderCell: (row) => `${row?.created_by?.firstName} ${row?.created_by?.lastName}` || "N/A",
    isSticky: false,
  },
  created_at: {
    label: "Created At",
    renderCell: (row) => row?.createdAt
    ? moment(row.createdAt).format("DD MMM YYYY") 
    : "N/A", 
    isSticky: false,
  },
};


  return (
    <div className="relative scrollbar-none overflow-x-auto sm:rounded-lg">
        <DynamicTableWithoutAction headings={headings} rows={sortedBatches} />
      </div>
  );
};

export default ViewBatchTable;
