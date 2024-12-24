import React, { useState } from "react";

const ActionDropdown = ({ po, actions, customElement }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleActionChange = (e) => {
    const selected = e.target.value;
    if (actions[selected]?.action) {
      actions[selected].action(po); // Execute the action
      setSelectedOption(""); // Reset selection
    }
  };

  return (
    <div className="flex items-center justify-between">
      <select
        className="bg-purple-light-5 min-w-44 cursor-pointer text-primary text-left font-medium rounded-2xl appearance-none text-sm px-3 py-2.5"
        value={selectedOption}
        onChange={handleActionChange}
      >
        <option value="" disabled>
          Action
        </option>
        {Object.entries(actions).map(([key, action]) => {
          const isActionVisible =
            action.condition === null || action.condition(po);
          return (
            isActionVisible && (
              <option key={key} value={key} className="py-6 px-4">
                {action.label}
              </option>
            )
          );
        })}
      </select>

      {
        customElement && (
          <div className="cursor-pointer">
            {customElement.map((elem, idx) =>{
              return (
                <div key={idx} onClick={()=>elem.action(po  )} >
                  {elem.label}
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
};

export default ActionDropdown;
