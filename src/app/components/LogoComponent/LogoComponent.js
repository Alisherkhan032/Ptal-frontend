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
    <div className="flex items-center gap-2">
      {logo ? (
        <div className="h-16 w-16 flex items-center justify-center"> {/* Ensuring consistent height */}
          <img
            src={logo}
            alt={`${name} logo`}
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center mb-2 font-semibold w-8 h-8 mt-2 ml-2 mr-2 rounded-[8px] bg-red-light px-4 py-3 text-white text-sm flex-shrink-0"> {/* Adjusted margins for fallback */}
          {getInitials(name)}
        </div>
      )}
      <div className="text-lg font-semibold mt-2">{name}</div> {/* Consistent margin on the name */}
    </div>
  );
};

export default LogoComponent;
