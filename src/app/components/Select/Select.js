const Select = ({
    options = [], // Array of string options
    placeholder = "Select an option", // Default placeholder
    value,
    onChange,
    name,
    size = "medium", // Default size
    bgColor = "bg-white", // Background color
    borderColor = "border-[#DFE4EA]", // Default border color
    width = "w-full", // Full width by default
    color = "text-[#838481]", // Text color
    fontWeight = "font-normal", // Font weight
    radius = "rounded-xl", // Border-radius
  }) => {
    // Helper function for size classes
    const getSelectSizeClasses = (size) => {
      switch (size) {
        case "small":
          return "h-8 text-sm px-2 py-1";
        case "medium":
          return "h-10 text-sm px-4 py-2";
        case "large":
          return "h-12 text-base px-5 py-3";
        default:
          return "h-10 text-sm px-4 py-2";
      }
    };
  
    const sizeClasses = getSelectSizeClasses(size);
  
    return (
      <select
        className={`${bgColor} border ${borderColor} ${sizeClasses} ${fontWeight} ${width} ${radius} ${color} focus:outline-none appearance-none`}
        value={value}
        onChange={onChange}
        name={name}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };
  
  export default Select;
  