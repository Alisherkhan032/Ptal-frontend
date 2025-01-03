import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProductValue, getProductName } from "../../Actions/dropdownValuesActions";

const ProductDropdown = ({ bgColor, height, width, options }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const handleProductChange = (product) => {
    dispatch(getProductValue(product._id));
    dispatch(getProductName(product.product_name));
    setDropdownVisible(false);
    setSearchTerm(`${product.sku_code} - ${product.product_name}`);
    console.log("Selected Product Value:", product._id);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setDropdownVisible(true);
    console.log("Search Term:", event.target.value);
  };

  const sortedOptions = [...options].sort((a, b) => a.product_name.localeCompare(b.product_name));
  const filteredOptions = sortedOptions.filter((product) =>
    `${product.sku_code} - ${product.product_name}`.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div  style={{ width: width || "auto", position: "relative" }} ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setDropdownVisible(true)}
        placeholder="Search products..."
       className="w-full p-2 border font-normal text-sm h-10 px-4 bg-white border-gray-300 text-[#4B5563] rounded-xl"
      />
      {dropdownVisible && (
        <div
        className={`absolute z-50 bg-white border border-gray-300 rounded-[6px] max-h-[20vw] overflow-y-auto 
        w-full shadow-md scrollbar-none`}
      >
          <ul  style={{ listStyleType: "none", padding: "0", margin: "0" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((product) => (
                <li
                  key={product._id}
                  value={product._id}
                  onClick={() => handleProductChange(product)}
                  className="px-5 py-3 text-sm font-medium cursor-pointer text-[#111928] hover:bg-[#F5F3FF] hover:text-[#3758F9]"
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {product.sku_code} - {product.product_name}
                </li>
              ))
            ) : (
              <li style={{ padding: "0.5vw 1vw", color: "#838481", backgroundColor: bgColor || "white" }}>
                No products found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDropdown;
