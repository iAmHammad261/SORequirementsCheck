// function to process changes in lead

import { getProductRows } from "./HelperFunctions/getProductRows.js";
import { markTheRequirementCompleted } from "./HelperFunctions/markTheRequirementCompleted.js";
import { markTheRequirementNotCompleted } from "./HelperFunctions/markTheRequirementNotCompleted.js";

export const processChanges = async (layoutDto, dealId) => {
    // first check about the product rows:
    const numberOfProductRows = await getProductRows(dealId);

    if(numberOfProductRows > 0){
        await markTheRequirementCompleted(layoutDto, "product_requirement01");
    }
    else {
        await markTheRequirementNotCompleted(layoutDto, "product_requirement01");
    }

}