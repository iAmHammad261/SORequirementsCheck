// second condition: check if buyer is present in the deal
import { callBX24Method } from "../Bitrix24/callBX24Method.js";
import { getContactUserFieldListValue } from "./getContactUserFieldListValue.js";
// import { getBase64Image } from "./getBase64ImageFromUrl.js";

export const getBuyerData = async (contactIdsList) => {
  var buyersDataToReturn = [];

  // Fetch the data from Bitrix24
  var buyerData = await callBX24Method("crm.contact.list", {
    filter: {
      "@ID": contactIdsList,
      "=UF_CRM_1767876111269": 665,
    },
    select: [
      "NAME",
      "LAST_NAME",
      "SECOND_NAME",
      "UF_CRM_1767352714903",
      "UF_CRM_1766983512371",
      "UF_CRM_1767353184396",
      "UF_CRM_1767353344846",
      "EMAIL",
      "PHONE",
      "UF_CRM_1767691283",
      "UF_CRM_1767353877567",
      "UF_CRM_1767354042765",
      "UF_CRM_1767354222357",
      "UF_CRM_1767691738",
      "UF_CRM_1767691716",
      "HAS_EMAIL",
      "HAS_PHONE",
      "UF_CRM_1767866386",
      "UF_CRM_1767873477",
      "UF_CRM_1767873500",
      "UF_CRM_1767873531",
      "UF_CRM_1768191467",
      "UF_CRM_1768218461",
    ],
  });

  // Safety check
  if (buyerData.length == 0) {
    throw new Error("No buyer contacts found for the deal");
  }

  // Loop through and format the data
  for (var buyer of buyerData) {
    var {
      NAME: name,
      LAST_NAME: lastName,
      SECOND_NAME: secondName,
      UF_CRM_1767352714903: humanRelationshipName,
      UF_CRM_1766983512371: identificationDocumentNumber,
      UF_CRM_1767353184396: currentAddress,
      UF_CRM_1767353344846: permanentAddress,
      EMAIL: email,
      PHONE: phone,
      UF_CRM_1767691283: NATIONALITY,
      UF_CRM_1767353877567: occupation,
      UF_CRM_1767354042765: dateOfBirth,
      UF_CRM_1767354222357: gender,
      UF_CRM_1767691738: alternativeEmail,
      UF_CRM_1767691716: alternativePhoneNumber,
      HAS_EMAIL: hasEmail,
      HAS_PHONE: hasPhone,
      UF_CRM_1767866386: humanRelationshipWithNature,
      UF_CRM_1767873500: documentFirstPage,
      UF_CRM_1767873531: documentSecondPage,
      UF_CRM_1767873477: buyerPictureCNIC,
      UF_CRM_1768191467: documentType,
      UF_CRM_1768218461: identificationDocumentType,
    } = buyer;

    var objectToHoldBuyerData = {
      NAME: `${name || ""} ${secondName || ""} ${lastName || ""}`
        .replace(/\s+/g, " ")
        .trim(), // Added a tiny regex fallback to clean up double spaces if a name part is missing
      HUMAN_RELATIONSHIP_NAME: humanRelationshipName,
      IDENTIFICATION_DOCUMENT_NUMBER: identificationDocumentNumber,
      CURRENT_ADDRESS: currentAddress,
      PERMANENT_ADDRESS: permanentAddress,
      EMAIL: hasEmail == "Y" && email ? email[0].VALUE : "",
      PHONE: hasPhone == "Y" && phone ? phone[0].VALUE : "",
      IDENTIFICATION_DOCUMENT_TYPE: identificationDocumentType,
      NATIONALITY: NATIONALITY,
      OCCUPATION: occupation,
      DATE_OF_BIRTH: dateOfBirth,
      GENDER: gender,
      ALTERNATIVE_EMAIL: alternativeEmail,
      ALTERNATIVE_PHONE_NUMBER: alternativePhoneNumber,
      HUMAN_RELATIONSHIP_WITH_NATURE: humanRelationshipWithNature,
      BUYER_IMAGE: buyerPictureCNIC
        ? `https://pcicrm.bitrix24.com${buyerPictureCNIC["downloadUrl"]}`
        : null,
      DOCUMENT_FIRST_PAGE: documentFirstPage
        ? `https://pcicrm.bitrix24.com${documentFirstPage["downloadUrl"]}`
        : null,
      DOCUMENT_SECOND_PAGE: documentSecondPage
        ? `https://pcicrm.bitrix24.com${documentSecondPage["downloadUrl"]}`
        : null,
      DOCUMENT_TYPE: documentType,
    };

    buyersDataToReturn.push(objectToHoldBuyerData);
  }

  return buyersDataToReturn;
};
