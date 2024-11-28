import React from "react";
import ProductFlowSingle from "../ProductFlowSingleCard/ProductFlowSingle";
import Link from "next/link";

const TeamProductFlowCard = ({ teamName, productFlows }) => {
  const maxItemsToShow = 4; // Maximum items to show before adding "view more"
  let displayedItems = [];
  let showViewMore = false;

  console.log("productFlows", productFlows);
  if(teamName === 'Inventory Team'){
    console.log('Inventory Team', productFlows);
  }

  // Use a for loop to conditionally render the items
  for (let i = 0; i < productFlows.length; i++) {
    if (i < maxItemsToShow) {
      displayedItems.push(
        <ProductFlowSingle
          key={i}
          numberOfProduct={productFlows[i].numberOfProduct}
          link={productFlows[i].link}
          linkName={productFlows[i].linkName}
          startDate={productFlows[i].startDate}
          endDate={productFlows[i].endDate}
        />
      );
    } else {
      showViewMore = true; // If more than maxItemsToShow, set flag to true
      break;
    }
  }

  return (
    <div className="border w-[23vw] min-h-[70vh] p-4 rounded-lg">
      <div>
        <h2 className="text-xl mb-6 font-bold text-gray-800">{teamName}</h2>

        {/* Render all the items collected in the for loop */}
        {displayedItems}

        {/* Conditionally render "view more" if there are extra items */}
        {showViewMore && (
          <Link href="#">
            <span className="font-medium text-[#4FC9DA] hover:text-[#45aab8]">
              view more
            </span>
          </Link>
        )}
        <hr />
      </div>
    </div>
  );
};

export default TeamProductFlowCard;
