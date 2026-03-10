import { getBuyerData } from "../HelperFunctions/getBuyerData.js";

export const checkBuyerRequirement = async (contactIdList) => {
  var mandatoryFields = {
    NAME: "Name",
    HUMAN_RELATIONSHIP_NAME: "Relationship Name",
    HUMAN_RELATIONSHIP_WITH_NATURE: "Relationship Nature",
    CURRENT_ADDRESS: "Current Address",
    PERMANENT_ADDRESS: "Permanent Address",
    EMAIL: "Email",
    PHONE: "Phone",
    IDENTIFICATION_DOCUMENT_TYPE: "Identification Document Type",
    IDENTIFICATION_DOCUMENT_NUMBER: "Identification Document Number",
    BUYER_IMAGE: "Buyer Image",
    DOCUMENT_FIRST_PAGE: "Document First Page",
  };

  var buyerData = await getBuyerData(contactIdList);


  if( buyerData.length == 0){
    return {
      status: false,
      heading: "No buyer linked",
      message: "No buyer is linked to the deal. Please link a buyer to proceed.",
    }
  }

  if (buyerData.IDENTIFICATION_DOCUMENT_TYPE == "CNIC")
    mandatoryFields["DOCUMENT_SECOND_PAGE"] = "Document Second Page";

  var isBuyerInfoComplete = true;

  var firstLineOfMessage =
    "Following mandatory fields are missing for the buyer(s):";
  var messageArray = [];
  for (var buyer of buyerData) {
    var messageForCurrentBuyer = `${buyer.NAME} is missing the following fields: \n`;
    var missingFieldsMessage = "";

    for (var [key, displayValue] of Object.entries(mandatoryFields)) {
      if (
        !buyer[key] ||
        buyer[key] === "" ||
        buyer[key] === null ||
        buyer[key] === undefined
      ) {
        missingFieldsMessage += `${displayValue} \n`;
      }
    }

    if (missingFieldsMessage) {
      isBuyerInfoComplete = false;
      messageArray.push(messageForCurrentBuyer + missingFieldsMessage);
    }
  }

  if (isBuyerInfoComplete) {
    return {
      status: true,
      data: buyerData,
      message: "Buyer information is complete.",
    };
  } else {
    return {
      status: false,
      heading: firstLineOfMessage ,
      message: messageArray.join(""),
    };
  }
};
