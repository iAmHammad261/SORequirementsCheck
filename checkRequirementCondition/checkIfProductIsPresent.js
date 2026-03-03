// first condition: check if the product is present in the deal or not:

import { getProductRows } from "../HelperFunctions/getProductRows.js";

export const checkIfProductIsPresent = async (dealId) => {

    const numberOfProductRows = await getProductRows(dealId);

    if(numberOfProductRows > 0)
        return true;
    else
        return false;

}