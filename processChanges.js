// function to process changes in lead

import { getProductRows } from "./HelperFunctions/getProductRows.js";
import { markTheRequirementCompleted } from "./HelperFunctions/markTheRequirementCompleted.js";
import { markTheRequirementNotCompleted } from "./HelperFunctions/markTheRequirementNotCompleted.js";
import { getMoreDealData } from "./HelperFunctions/getMoreDealData.js";
import { getContactData } from "./HelperFunctions/getContactData.js";

export const processChanges = async (layoutDto, dealId) => {

    console.log("process change called for deal ID:", dealId);
    // first check about the product rows:
    const numberOfProductRows = await getProductRows(dealId);

    // get additional deal data:
    var addtionalDealData = await getMoreDealData(dealId);

    console.log("Contact Data", addtionalDealData['CONTACT_ID']);

    if(addtionalDealData['CONTACT_ID'])
    var contactData = await getContactData(addtionalDealData["CONTACT_ID"]);

    console.log("Additional Deal Data:", addtionalDealData);


    console.log("Contact Data:", contactData);


    console.log("Number of product rows:", numberOfProductRows);

    if(numberOfProductRows > 0){
        await markTheRequirementCompleted(layoutDto, "product_requirement01");
    }
    else {
        await markTheRequirementNotCompleted(layoutDto, "product_requirement01");
    }

    console.log("Contact Data HAS_EMAIL:", contactData['HAS_EMAIL']);
    console.log("Contact Data HAS_PHONE:", contactData['HAS_PHONE']);
    console.log("Additional Deal Data UF_CRM_1766983873725:", addtionalDealData['UF_CRM_1766983873725']);

    if(contactData['HAS_EMAIL'] == 'Y' && contactData['HAS_PHONE'] == 'Y' && addtionalDealData['UF_CRM_1766983873725'] != ""){
        await markTheRequirementCompleted(layoutDto, "customerInfo_requirement02")
    }
    else {
        await markTheRequirementNotCompleted(layoutDto, "customerInfo_requirement02")
    }


}