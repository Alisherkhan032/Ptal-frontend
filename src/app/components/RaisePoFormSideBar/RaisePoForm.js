import React from "react";

const RightSidebar = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Hide the sidebar when closed

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="bg-white w-1/4 h-full shadow-lg p-4 fixed right-0"> {/* Position it on the right */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            Close
          </button>
        </div>
        {children}
      </div>
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onClose} // Close sidebar when clicking outside
      />
    </div>
  );
};

export default RightSidebar;
