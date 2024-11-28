import React from "react";

const StatusBar = ({ data }) => {
  return (
    <div
      className="flex bg-white p-4 rounded-lg items-center  shadow-md"
      style={{
        boxShadow: "1px 1px 3px 1px #A6AFC366", // Custom shadow for uniform rounded rectangle
      }}
    >
      {data.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center text-center flex-1 border-r-[1.5px] last:border-r-0 border-[#DFE4EA]"
        >
          <p className="text-xl font-semibold text-black  ">{item.value}</p>
          <p className="text-sm font-medium text-[#637381]">{item.heading}</p>
        </div>
      ))}
    </div>
  );
};

export default StatusBar;
