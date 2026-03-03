import { getBuyerData } from "../HelperFunctions/getBuyerData.js";

export const checkBuyerRequirement = async (contactIdList) => {
  var mandatoryFields = [
    "NAME",
    "HUMAN_RELATIONSHIP_NAME",
    "HUMAN_RELATIONSHIP_WITH_NATURE",
    "CURRENT_ADDRESS",
    "PERMANENT_ADDRESS",
    "EMAIL",
    "PHONE",
    "IDENTIFICATION_DOCUMENT_TYPE",
    "IDENTIFICATION_DOCUMENT_NUMBER",
    "BUYER_IMAGE",
    "DOCUMENT_FIRST_PAGE",
  ];
  
  var buyerData = await getBuyerData(contactIdList);

  if(buyerData.IDENTIFICATION_DOCUMENT_TYPE == 'CNIC')
    mandatoryFields.push("DOCUMENT_SECOND_PAGE");

  var isBuyerInfoComplete = true;

  var firstLineOfMessage =
    "Following mandatory fields are missing for the buyer(s): \n";
  var messageArray = [];
  for (var buyer of buyerData) {
    var messageForCurrentBuyer = `${buyer.NAME} is missing the following fields: \n`;
    var missingFieldsMessage = "";

    for (var fields of mandatoryFields) {
      if (
        !buyer[fields] ||
        buyer[fields] === "" ||
        buyer[fields] === null ||
        buyer[fields] === undefined
      ) {
        var lowerSpaced = fields.toLowerCase().replace(/_/g, " ");
        var sentenceCase =
          lowerSpaced.charAt(0).toUpperCase() + lowerSpaced.slice(1);
        missingFieldsMessage += `${sentenceCase},`;
      }
    }

    if (missingFieldsMessage) {
      isBuyerInfoComplete = false;
      messageArray.push(messageForCurrentBuyer + missingFieldsMessage.replace(/,\s*$/, ''));
    }
  }

  if (isBuyerInfoComplete) {
    return {
      status: true,
      message: "Buyer information is complete.",
    };
  } else {
    return {
      status: false,
      message: firstLineOfMessage + messageArray.join("\n"),
    };
  }
};
