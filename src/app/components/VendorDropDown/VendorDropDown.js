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
        placeholder="Search vendors..."
        disabled={disabled}
        style={{
          width: "100%",
          padding: "0.5vw",
          fontSize: "1.1vw",
          borderRadius: "0.5vw",
          border: "1px solid #ccc",
          marginBottom: "0.5vw",
          backgroundColor: bgColor || "white",
          color: "#838481",
        }}
      />
      {dropdownVisible && (
        <div
          style={{
            backgroundColor: "white",
            position: "absolute",
            zIndex: 1000,
            border: "1px solid #ccc",
            borderRadius: "0.5vw",
            maxHeight: "20vw",
            overflowY: "auto",
            width: "100%",
          }}
        >
          <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((vendor) => (
                <li
                  key={vendor._id}
                  value={vendor._id}
                  onClick={() => handleVendorChange(vendor)}
                  style={{
                    padding: "0.5vw 1vw",
                    cursor: "pointer",
                    borderBottom: "1px solid #ccc",
                    color: "#838481",
                    backgroundColor: bgColor || "white",
                  }}
                >
                  {vendor.vendor_name}
                </li>
              ))
            ) : (
              <li style={{ padding: "0.5vw 1vw", color: "#838481", backgroundColor: bgColor || "white" }}>
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
