// Titlebar.js
import React from "react";

const TitleBar = ({ title, buttons = [] }) => {

  return (
    <div className="flex justify-between items-center  mt-1 ">
      {/* Title on the left */}
      <h1 className="text-lg text-black font-semibold">{title}</h1>

      {/* Buttons on the right */}

      <div className="flex items-center justify-center space-x-4">
        {buttons.map((button, index) => button)}
      </div>
    </div>
  );
};

export default TitleBar;
