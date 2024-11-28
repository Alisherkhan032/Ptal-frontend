import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMatValue, getMatName } from "../../Actions/dropdownValuesActions";

const RawMateialDropDown = ({ bgColor, height, width, options }) => {
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
    <div style={{ position: "relative", width: width || "auto" }} ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setDropdownVisible(true)}
        placeholder="Search materials..."
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
              filteredOptions.map((material) => (
                <li
                  key={material._id}
                  value={material._id}
                  onClick={() => handleMaterialChange(material)}
                  style={{
                    padding: "0.5vw 1vw",
                    cursor: "pointer",
                    borderBottom: "1px solid #ccc",
                    color: "#838481",
                    backgroundColor: bgColor || "white",
                  }}
                >
                  {material.sku_code} - {material.material_name}
                </li>
              ))
            ) : (
              <li style={{ padding: "0.5vw 1vw", color: "#838481", backgroundColor: bgColor || "white" }}>
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
