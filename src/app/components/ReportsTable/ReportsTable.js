import React from 'react';
import moment from 'moment';

const ReportsTable = ({ reportsData, reportType }) => {
  console.log('reportsData====', reportsData);
  //   if (!reportsData || reportsData.length === 0) {
  //     return <div>Loading...</div>;
  //   }

  let tableHeaders = [];
  let tableKeys = [];
  if (reportType === 'Storage Room Day Starting Count') {
    tableHeaders = [
      'RAW MATERIAL NAME',
      'DESCRIPTION',
      'CATEGORY ID',
      'UNIT OF MEASURE',
      'CURRENT STOCK',
      'REORDER LEVEL',
      'WAREHOUSE ID',
      'SKU CODE',
      'UNIT PRICE',
      'ZOHO ITEM ID',
      'FAILED QC COUNT',
      'CREATED AT',
      'UPDATED AT',
    ];
    tableKeys = [
      'material_name',
      'material_description',
      'material_category_id',
      'unit_of_measure',
      'current_stock',
      'reorder_level',
      'warehouse_id',
      'sku_code',
      'unit_price',
      'zoho_item_id',
      'failedQcCount',
      'createdAt',
      'updatedAt',
    ];
  } else if (reportType === 'Inventory Room Day Starting Count') {
    tableHeaders = [
      'Product name',
      'Product description',
      'product category id',
      'unit of measure',
      'current stock',
      'warehouse id',
      'sku code',
      'current_count',
      'isInward',
      'isOutward',
      'Created At',
      'Updated At',
    ];

    tableKeys = [
      'product_name',
      'product_description',
      'product_category_id',
      'unit_of_measure',
      'current_stock',
      'warehouse_id',
      'sku_code',
      'current_count',
      'isInward',
      'isOutward',
      'createdAt',
      'updatedAt',
    ];
  }

  const getValueFromNestedKey = (obj, key) => {
    const keys = key.split('.');
    return keys.reduce((acc, currentKey) => {
      return acc && acc[currentKey];
    }, obj);
  };

  return (
    <div className="relative overflow-x-auto mr-[1vw] sm:rounded-lg">
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
            {tableHeaders.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reportsData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-white border-b-[0.15vw] border-dashed border-[rgb(248,246,242)] dark:border-[rgb(248,246,242)] hover:bg-gray-50"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-table-search-${rowIndex}`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`checkbox-table-search-${rowIndex}`}
                    className="sr-only"
                  >
                    checkbox
                  </label>
                </div>
              </td>
              {tableKeys.map((key, keyIndex) => (
                <td key={keyIndex} className="px-6 py-4">
                  {key === 'createdAt' || key === 'updatedAt'
                    ? moment(getValueFromNestedKey(row, key)).format(
                        'DD MMM YYYY'
                      )
                    : getValueFromNestedKey(row, key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;
