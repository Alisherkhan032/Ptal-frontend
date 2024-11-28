// Titlebar.js
import React from 'react';
import { useRouter } from 'next/navigation';

const TitleBar = ({ title, buttons = [] }) => {
  const router = useRouter();  // Initialize the router for redirection

  return (
    <div className="flex justify-between items-cente p-4 ">
      {/* Title on the left */}
      <h1 className="text-xl text-black font-semibold">{title}</h1>

      {/* Buttons on the right */}
      <div className="flex space-x-4">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            className={`px-6 py-2 rounded-[12px] font-normal  ${button.className || 'bg-blue-500 text-white'}`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TitleBar;
