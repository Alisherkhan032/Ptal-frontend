import React from "react";
import InwardTeam from "../InwardTeamProductFlowCard/InwardTeamProductFlowCard";
import QualityTeam from "../QualityTeamProductFlowCard/QualityTeamProductFlowCard";
import StorageTeam from "../StorageTeamProductFlowCard/StorageTeamProductFlowCard";
// import InventoryTeam from "../InventoryTeamProductFlowCard/InventoryTeamProductFlowCard";
// import PackagingTeam from "../PackaginTeamProductFlowCard/PackagingTeamProductFlowCard";
// import DispatchTeam from "../DispatchTeamProductFlowCard/DispatchTeamProdtctFlowCard";
// import DayStartingInventoryListCard from "../DayStartingInventoryListCard/DayStartingInventoryListCard";
// import BreachingThresholdCard from "../BreachingThresholdCard/BreachingThresholdCard";
// import ImportantReportLinksCard from "../ImportantReportLinksCard/ImportantReportLinksCard";

const ProductFlowCards = ({ dateRange }) => {
  console.log("dateRange", dateRange);
  return (
    <div className="flex flex-wrap gap-4 mt-8">
      <InwardTeam dateRange={dateRange} />
      <QualityTeam dateRange={dateRange} />
      <StorageTeam dateRange={dateRange} />
      {/* <PackagingTeam dateRange={dateRange} /> */}
      {/* <InventoryTeam dateRange={dateRange} /> */}
      {/* <DispatchTeam dateRange={dateRange} /> */}
      {/* <DayStartingInventoryListCard /> */}
      {/* <BreachingThresholdCard /> */}
      {/* <ImportantReportLinksCard /> */}
    </div>
  );
};

export default ProductFlowCards;
