const InputField = ({ label, type, value, onChange, error, placeholder }) => (
    <div>
      <label className="block text-[#111928] text-base font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border font-normal text-base h-12 border-gray-300 text-[#637381] rounded-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
  
export default InputField;
  