import { getNomineeData } from "../HelperFunctions/getNomineeData.js";

export const checkNomineeRequirement = async (contactIdList) => {
  const mandatoryFields = [
    "NAME",
    "CNIC",
    "EMAIL",
    "PHONE",
    "RELATIONSHIP",
    "RELATIONSHIP_NAME",
    "HUMAN_RELATIONSHIP_WITH_NATURE",
    "CURRENT_ADDRESS",
    "NATIONALITY",
    "RELATIONSHIP",
    "NOMINEE_FIRST_PAGE_OF_DOCUMENT",
    // "NOMINEE_SECOND_PAGE_OF_DOCUMENT",
    "NOMINEE_PICTURE_CNIC",
    "IDENTIFICATION_DOCUMENT_TYPE",
  ];

  const nomineeData = await getNomineeData(contactIdList);

  if (nomineeData.IDENTIFICATION_DOCUMENT_TYPE == "CNIC")
    mandatoryFields.push("NOMINEE_SECOND_PAGE_OF_DOCUMENT");

  var isNomineeInfoComplete = true;

  var firstLineOfMessage =
    "Following mandatory fields are missing for the nominee(s): \n";
  var messageArray = [];

  for (var nominee of nomineeData) {
    var messageForCurrentNominee = `${nominee.NAME} is missing the following fields: \n`;
    var missingFieldsMessage = "";
    for (var field of mandatoryFields) {
      if (
        !nominee[field] ||
        nominee[field] === "" ||
        nominee[field] === null ||
        nominee[field] === undefined
      ) {
        var lowerSpaced = field.toLowerCase().replace(/_/g, " ");
        var sentenceCase = lowerSpaced.charAt(0).toUpperCase() + lowerSpaced.slice(1);
        missingFieldsMessage += `${sentenceCase},`;
      }
    }

    if (missingFieldsMessage) {
      isNomineeInfoComplete = false;
      messageArray.push(messageForCurrentNominee + missingFieldsMessage.replace(/,\s*$/, ''));
    }
  }


    if (isNomineeInfoComplete) {
        return {
            status: true,
            message: "Nominee information is complete.",
        };
    }
    else {
        return {
            status: false,
            message: firstLineOfMessage + messageArray.join("\n"),
        };
    }
};
