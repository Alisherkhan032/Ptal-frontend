import React from 'react';
import { PendingRed, FulfilledGreen, DefaultStatus, QcInfo } from '@/app/components/ButtonComponent/ButtonComponent';

const StatusComponent = ({ status, textSize = "text-sm" }) => {
  // Format the status text to be more readable
  const formatStatus = (status) => {
    return status
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formattedStatus = formatStatus(status);

  switch (status.toLowerCase()) {
    case "pending":
      return (
        <div className="w-full min-w-[120px] max-w-[200px]">
          <PendingRed textSize={textSize} title="Pending" />
        </div>
      );
    case "fulfilled":
      return (
        <div className="w-full min-w-[120px] max-w-[200px]">
          <FulfilledGreen textSize={textSize} title="Fulfilled" />
        </div>
      );
    case "qc_info_added":
      return (
        <div className="w-full min-w-[120px] max-w-[200px]">
          <QcInfo textSize={textSize} title="QC Info Added" />
        </div>
      );
    default:
      return (
        <div className="w-full min-w-[120px] max-w-[200px]">
          <DefaultStatus title={formattedStatus} />
        </div>
      );
  }
};

export default StatusComponent;