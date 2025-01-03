import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMatValue, getMatName } from "../../Actions/dropdownValuesActions";

const RawMateialDropDown = ({ bgColor, height, width, options, disabled }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const handleMaterialChange = (material) => {
    dispatch(getMatValue(material._id));
    dispatch(getMatName(material.material_name));
    setDropdownVisible(false);
    setSearchTerm(`${material.sku_code} - ${material.material_name}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setDropdownVisible(true);
  };

  const sortedOptions = [...options].sort((a, b) => {
    return a.material_name.localeCompare(b.material_name);
  });

  const filteredOptions = sortedOptions.filter((material) =>
    `${material.sku_code} - ${material.material_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
    <div className="relative w-full" ref={dropdownRef} style={{ width: width || "auto" }}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setDropdownVisible(true)}
        placeholder="Search Product"
        disabled={disabled}
        className="w-full p-2 border font-normal text-sm h-10 bg-white border-gray-300 text-[#4B5563] rounded-xl"
      />
      {dropdownVisible && (
        <div
          className={`absolute z-50 bg-white border border-gray-300 rounded-[6px] max-h-[20vw] overflow-y-auto 
          w-full shadow-md scrollbar-none`}
        >
          <ul className="list-none">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((material) => (
                <li
                  key={material._id}
                  value={material._id}
                  onClick={() => handleMaterialChange(material)}
                  className="px-5 py-3 text-sm font-medium cursor-pointer text-[#111928] hover:bg-[#F5F3FF] hover:text-[#3758F9] border-b border-gray-200"
                >
                  {material.sku_code} - {material.material_name}
                </li>
              ))
            ) : (
              <li className="p-2 text-[#637381]">
                No materials found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
  
};

export default RawMateialDropDown;
