import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";

const RightSidebar = ({ isOpen, onClose, children }) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      classes={{
        paper: "w-[36%] rounded-tl-lg rounded-bl-lg", // Tailwind for width and border radius
      }}
    >
      <Box
        className="h-full overflow-y-auto bg-white p-6 scrollbar-none" // Tailwind for height, overflow, background, and padding
      >
        {children}
      </Box>
    </Drawer>
  );
};

export default RightSidebar;
