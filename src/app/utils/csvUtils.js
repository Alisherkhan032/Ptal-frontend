import moment from "moment";

/**
 * Converts a data array to CSV format and triggers a download.
 * @param {Array} data - The data to be converted.
 * @param {Array} headers - The headers for the CSV file.
 * @param {Function} rowMapper - A function that maps a data item to a CSV row.
 * @param {string} fileName - The name of the generated CSV file.
 */
export const convertToCSV = (data, headers, rowMapper, fileName) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error("No data available to export.");
    return;
  }

  const rows = data.map(rowMapper);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName || `Export_${moment().format("YYYY-MM-DD")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
