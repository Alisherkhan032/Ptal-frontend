const SelectField = ({ label, value, options, onChange, error, placeholder }) => (
    <div className="mb-6">
      {console.log('options', options)}
      <label className="block text-[#111928] text-base font-medium mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full p-2 border font-normal text-base h-12 border-gray-300 text-[#637381] rounded-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.length>0 && options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
  
export default SelectField;
  