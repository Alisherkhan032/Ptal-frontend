// components/UserCard.jsx
import React from "react";

const UserCard = ({ icon, name, email }) => {
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex items-center gap-3 border border-[#DFE4EA] rounded-lg px-2 -ml-2 py-2 w-full">
      {/* Icon Section */}
      <div className="w-8 h-8 flex-shrink-0">
        {icon ? (
          <img
            src={icon}
            alt={`${name} icon`}
            className="w-full h-full object-cover rounded-[8px]"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full rounded-[8px] bg-[#ff7777] font-bold text-white text-sm">
            {getInitials(name)}
          </div>
        )}
      </div>

      {/* Name and Email Section */}
      <div className="flex flex-col">
        <p className="text-sm font-semibold truncate">{name}</p>
        <p className="text-xs text-gray-600 truncate">{email}</p>
      </div>
    </div>
  );
};

export default UserCard;
