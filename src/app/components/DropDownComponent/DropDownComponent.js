import Link from "next/link";

const DropdownComponent = ({ openDropDownToggle, index, po, generateBatchSticker, toggleDropdown }) => {
  return (
    openDropDownToggle === index && (
      <div
        id="dropdownHover"
        className="z-1000 absolute min-w-24 max-w-24 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
      >
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
          {po.status === 'pending' && (
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
          {po.status === 'qc_info_added' && (
            <>
              <li>
                <Link
                  href={`/storage/inward_procurement_po/inward_po/${po?._id}`} // Dynamic route for inward page
                  key={po?._id}
                >
                  <div className="block px-4 py-2 text-sm font-medium text-[rgb(144,138,129)] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
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
          {po.status === 'batch_generated' && (
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
    )
  );
};

export default DropdownComponent;
