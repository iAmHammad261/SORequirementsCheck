// function to process changes in lead

import { getProductRows } from "./HelperFunctions/getProductRows.js";
import { markTheRequirementCompleted } from "./HelperFunctions/markTheRequirementCompleted.js";
import { markTheRequirementNotCompleted } from "./HelperFunctions/markTheRequirementNotCompleted.js";
import { getMoreDealData } from "./HelperFunctions/getMoreDealData.js";
import { getContactData } from "./HelperFunctions/getContactData.js";
import { changeTheCountOfText} from "./HelperFunctions/changeTheCountOfText.js"
import { changeTheMessageToSuccess } from "./HelperFunctions/changeTheMessageToSuccess.js";

export const processChanges = async (layoutDto, dealId) => {

    var noOfRequirementsCompleted = 0;
    var totalNumberOfRequirements = 4;

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
        ++noOfRequirementsCompleted;
    }
    else {
        await markTheRequirementNotCompleted(layoutDto, "product_requirement01");

    }


    if(contactData['HAS_EMAIL'] == 'Y' && contactData['HAS_PHONE'] == 'Y' && addtionalDealData['UF_CRM_1766983873725'] != ""){
        await markTheRequirementCompleted(layoutDto, "customerInfo_requirement02")
        ++noOfRequirementsCompleted;
    }
    else {
        await markTheRequirementNotCompleted(layoutDto, "customerInfo_requirement02")
        
    }

    if(addtionalDealData['UF_CRM_1766573650'] && addtionalDealData['UF_CRM_1767092446606']){
        await markTheRequirementCompleted(layoutDto, "DP_IT_requirement03")
        ++noOfRequirementsCompleted;
    }
    else {
        await markTheRequirementNotCompleted(layoutDto, "DP_IT_requirement03")
        
    }

    if(addtionalDealData['STAGE_ID'] == "WON"){
        await markTheRequirementCompleted(layoutDto, "Deal_final_stage_requirement04")
        ++noOfRequirementsCompleted;
    }
    else {
        await markTheRequirementNotCompleted(layoutDto, "Deal_final_stage_requirement04")
        
    }


    changeTheCountOfText(layoutDto,"textForCount", (totalNumberOfRequirements-noOfRequirementsCompleted));

    if(noOfRequirementsCompleted == totalNumberOfRequirements){
        await changeTheMessageToSuccess(layoutDto,"infoTextForRemaining");
    }


}