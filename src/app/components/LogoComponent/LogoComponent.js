import React from "react";

const LogoComponent = ({ logo, name }) => {
  // initials for fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <div className="flex items-center gap-3">
    {logo ? (
      <div className="h-16 w-16 pb-1">
        <img
          src={logo}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
        />
      </div>
    ) : (
      <div className="flex items-center justify-center w-7 h-7 rounded-[8px] bg-[#ff7777] text-white  text-sm flex-shrink-0">
        {getInitials(name)}
      </div>
    )}
    <span className="text-lg font-semibold">{name}</span>
  </div>
  
  );
};

export default LogoComponent;
