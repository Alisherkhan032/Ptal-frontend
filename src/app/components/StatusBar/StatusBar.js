import React from "react";

const StatusBar = ({ data }) => {
  data = data.filter((po)=> po.status !== 'fulfilled');
  return (
    <div
      className="flex bg-white px-4 py-2 rounded-lg items-center shadow-md"
      style={{
        boxShadow: "1px 0px 3px 1px #A6AFC366", // Custom shadow for uniform rounded rectangle
      }}
    >
      {data.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center text-center flex-1 border-r-[1.5px] last:border-r-0 border-[#DFE4EA]"
        >
          <p className="text-lg  font-semibold text-black  ">{item.value}</p>
          <p className="text-sm font-medium text-dark-4 whitespace-nowrap mx-2">{item.heading}</p>
        </div>
      ))}
    </div>
  );
};

export default StatusBar;
