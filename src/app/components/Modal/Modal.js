import React from 'react';

const Modal = ({ isOpen, onClose, children, message }) => {
  console.log('Modal isOpen:', isOpen);  // Check if modal is open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-8 rounded-lg shadow-lg z-10">
        {children ? children : <p className="text-lg">{message}</p>}
        <button 
          onClick={onClose} 
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
};


export default Modal;
