import React from "react";

const RightSidebar = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Hide the sidebar when closed

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Sidebar */}
      <div className="bg-white w-[36%] rounded-l-[16px] h-full fixed right-0"> 
        {children}
      </div>

    </div>
  );
};

export default RightSidebar;
