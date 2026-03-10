import { getNomineeData } from "../HelperFunctions/getNomineeData.js";

export const checkNomineeRequirement = async (contactIdList) => {
  const mandatoryFields = {
    "NAME": "Name",
    "CNIC": "CNIC",
    "EMAIL": "Email",
    "PHONE": "Phone",
    "RELATIONSHIP": "Relationship",
    "RELATIONSHIP_NAME": "Relationship Name",
    "HUMAN_RELATIONSHIP_WITH_NATURE": "Relationship Nature",
    "CURRENT_ADDRESS": "Current Address",
    "NATIONALITY": "Nationality",
    "NOMINEE_FIRST_PAGE_OF_DOCUMENT": "First Page of Nominee Document",
    "NOMINEE_PICTURE_CNIC": "Nominee Picture",
    "IDENTIFICATION_DOCUMENT_TYPE": "Identification Document Type",
  };

  const nomineeData = await getNomineeData(contactIdList);


  if( nomineeData.length == 0){
    return {
      status: false,
      heading: "No nominee linked",
      message: "No nominee is linked to the deal. Please link a nominee to proceed.",
    }
  }

  if (nomineeData.IDENTIFICATION_DOCUMENT_TYPE == "CNIC")
    mandatoryFields["NOMINEE_SECOND_PAGE_OF_DOCUMENT"] = "Second Page of Nominee Document";

  var isNomineeInfoComplete = true;

  var firstLineOfMessage =
    "Following mandatory fields are missing for the nominee(s): \n";
  var messageArray = [];

  for (var nominee of nomineeData) {
    var messageForCurrentNominee = `${nominee.NAME} is missing the following fields: \n`;
    var missingFieldsMessage = "";
    for (var [key, displayValue] of Object.entries(mandatoryFields)) {
      if (
        !nominee[key] ||
        nominee[key] === "" ||
        nominee[key] === null ||
        nominee[key] === undefined
      ) {
        missingFieldsMessage += `${displayValue} \n`;
      }
    }

    if (missingFieldsMessage) {
      isNomineeInfoComplete = false;
      messageArray.push(messageForCurrentNominee + missingFieldsMessage);
    }
  }


    if (isNomineeInfoComplete) {
        return {
            status: true,
            data: nomineeData,
            message: "Nominee information is complete.",
        };
    }
    else {
        return {
            status: false,
            heading: firstLineOfMessage,
            message: messageArray.join(""),
        };
    }
};
