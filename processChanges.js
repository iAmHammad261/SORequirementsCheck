// function to process changes in lead

import { getProductRows } from "./HelperFunctions/getProductRows.js";
import { markTheRequirementCompleted } from "./HelperFunctions/markTheRequirementCompleted.js";
import { markTheRequirementNotCompleted } from "./HelperFunctions/markTheRequirementNotCompleted.js";
import { getMoreDealData } from "./HelperFunctions/getMoreDealData.js";

export const processChanges = async (layoutDto, dealId) => {

    console.log("process change called for deal ID:", dealId);
    // first check about the product rows:
    const numberOfProductRows = await getProductRows(dealId);

    // get additional deal data:
    var addtionalDealData = await getMoreDealData(dealId);

    console.log("Additional Deal Data:", addtionalDealData);

    console.log("Number of product rows:", numberOfProductRows);

    if(numberOfProductRows > 0){
        await markTheRequirementCompleted(layoutDto, "product_requirement01");
    }
    else {
        await markTheRequirementNotCompleted(layoutDto, "product_requirement01");
    }

}