import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getVendorValue } from '../../Actions/dropdownValuesActions';

const VendorDropDown = ({ bgColor, height, width, options, disabled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const handleVendorChange = (vendor) => {
    dispatch(getVendorValue(vendor._id));
    setDropdownVisible(false);
    setSearchTerm(vendor.vendor_name);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setDropdownVisible(true);
    console.log("Search Term:", event.target.value);
  };

  const sortedOptions = [...options].sort((a, b) => {
    return a.vendor_name.localeCompare(b.vendor_name);
  });

  const filteredOptions = sortedOptions.filter((vendor) =>
    vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ width: width || "auto", position: "relative" }} ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setDropdownVisible(true)}
        placeholder="Search vendor"
        disabled={disabled}
        className="w-full p-2 border font-normal text-sm h-10 px-4 bg-white border-gray-300 text-[#4B5563] rounded-xl"
      />
      {dropdownVisible && (
        <div
        className={`absolute z-50 bg-white border border-gray-300 rounded-[6px] max-h-[20vw] overflow-y-auto 
        w-full shadow-md scrollbar-none`}
      >
          <ul className='list-none'>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((vendor) => (
                <li
                  key={vendor._id}
                  value={vendor._id}
                  onClick={() => handleVendorChange(vendor)}
                  className="px-5 py-3 text-sm font-medium cursor-pointer text-[#111928] hover:bg-[#F5F3FF] hover:text-[#3758F9]"
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {vendor.vendor_name}
                </li>
              ))
            ) : (
              <li
                className="p-2 text-[#637381]"
              >
                No vendors found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VendorDropDown;
