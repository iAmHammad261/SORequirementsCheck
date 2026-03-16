import { callBX24Method } from "../Bitrix24/callBX24Method.js";
// import { getContactUserFieldListValue } from "./getContactUserFieldListValue.js";
// import { getBase64Image } from "./getBase64ImageFromUrl.js";

export const getNomineeData = async (contactIdsList) => {
  var nomineeDataToReturn = [];

  var nomineeData = [];

  var nomineeData = await callBX24Method("crm.contact.list", {
    filter: {
      "@ID": contactIdsList,
      "=UF_CRM_1767876111269": 667,
    },
    select: [
      "NAME",
      "LAST_NAME",
      "SECOND_NAME",
      "UF_CRM_1767866386",
      "UF_CRM_1767352714903",
      "UF_CRM_1766983512371",
      "HAS_EMAIL",
      "HAS_PHONE",
      "EMAIL",
      "PHONE",
      "UF_CRM_1767353184396",
      "UF_CRM_1767691283",
      "UF_CRM_1767944428",
      "UF_CRM_1767873531",
      "UF_CRM_1767873500",
      "UF_CRM_1767873477",
      "UF_CRM_1768191467",
      "UF_CRM_1768218461",
    ],
  });

  console.log("Nominee Data:", nomineeData);

  if (nomineeData.length == 0) {
    throw new Error("No nominee contacts found for the deal");
  }

  var objectToHoldNomineeData = {};
  for (var nominee of nomineeData) {
    var {
      NAME: name,
      LAST_NAME: lastName,
      SECOND_NAME: secondName,
      UF_CRM_1766983512371: cnic,
      EMAIL: email,
      PHONE: phone,
      UF_CRM_1767352714903: relationshipName,
      UF_CRM_1767866386: humanRelationshipWithNature,
      UF_CRM_1767353184396: currentAddress,
      UF_CRM_1767691283: nationality,
      UF_CRM_1767944428: relationship,
      HAS_EMAIL: hasEmail,
      HAS_PHONE: hasPhone,
      UF_CRM_1767873500: nomineeFirstPageOfDocument,
      UF_CRM_1767873531: nomineeSecondPageOfDocument,
      UF_CRM_1767873477: nomineePictureCNIC,
      UF_CRM_1768191467: documentType,
      UF_CRM_1768218461: identificationDocumentType,
    } = nominee;

    console.log("Nominee Fields:", nominee);

    objectToHoldNomineeData = {
      NAME: `${name}${secondName ? " " + secondName : ""}${lastName ? " " + lastName : ""}`.trim(),
      IDENTIFICATION_DOCUMENT_NUMBER: cnic,
      EMAIL: hasEmail == "Y" ? email[0].VALUE : "",
      PHONE: hasPhone == "Y" ? phone[0].VALUE : "",
      HUMAN_RELATIONSHIP_NAME: relationshipName,
      HUMAN_RELATIONSHIP_WITH_NATURE: humanRelationshipWithNature,
      CURRENT_ADDRESS: currentAddress,
      NATIONALITY: nationality,
      RELATIONSHIP: relationship,
      DOCUMENT_FIRST_PAGE: nomineeFirstPageOfDocument
        ? `https://pcicrm.bitrix24.com${nomineeFirstPageOfDocument["downloadUrl"]}`
        : null,
      DOCUMENT_SECOND_PAGE: nomineeSecondPageOfDocument
        ? `https://pcicrm.bitrix24.com${nomineeSecondPageOfDocument["downloadUrl"]}`
        : null,
      NOMINEE_IMAGE: nomineePictureCNIC
        ? `https://pcicrm.bitrix24.com${nomineePictureCNIC["downloadUrl"]}`
        : null,
      DOCUMENT_TYPE: documentType,
      IDENTIFICATION_DOCUMENT_TYPE: identificationDocumentType,
    };

    nomineeDataToReturn.push(objectToHoldNomineeData);
  }

  return nomineeDataToReturn;

  // var {"UF_CRM_1767697614": nomineeName1, "UF_CRM_1767086788432": nomineeCNIC1, "UF_CRM_1767091676062": nomineeAddress1, "UF_CRM_1767355210041": nomineeRelationship1, "UF_CRM_1767355252538": nomineeRelationshipWith1, "UF_CRM_1767699552": nomineePhoneNumber, "UF_CRM_1767699696070": nomineeEmail1, "UF_CRM_1767697614": nomineeNationality, "UF_CRM_1767783848": nomineeRelationshipWithNature1 } = dealData;

  // var firstNomineeData = {
  //     "NAME": nomineeName1,
  //     "CNIC": nomineeCNIC1,
  //     "ADDRESS": nomineeAddress1,
  //     "RELATIONSHIP": await getDealUserFieldListValue("UF_CRM_1767355210041", nomineeRelationship1),
  //     "RELATIONSHIP_WITH": nomineeRelationshipWith1,
  //     "PHONE": nomineePhoneNumber,
  //     "EMAIL": nomineeEmail1,
  //     "NOMINEE_NATIONALITY": await getDealUserFieldListValue("UF_CRM_1767697614", nomineeNationality),
  //     "NOMINEE_RELATIONSHIP_WITH_NATURE": await getDealUserFieldListValue("UF_CRM_1767783848", nomineeRelationshipWithNature1)
  // }

  // var {"UF_CRM_1767355658092": secondNomineeName, "UF_CRM_1767355683169": secondNomineeCNIC, "UF_CRM_1767355741229": secondNomineeAddress, "UF_CRM_1767356013200": secondNomineeRelationship, "UF_CRM_1767356046678": secondNomineeRelationshipWith, "UF_CRM_1767704332": secondNomineePhoneNumber, "UF_CRM_1767704311": secondNomineeEmail, "UF_CRM_1767704499": secondNomineeNationality, "UF_CRM_1767784036": secondNomineeRelationshipWithNature } = dealData;

  // var secondNomineeData = {
  //     "NAME": secondNomineeName,
  //     "CNIC": secondNomineeCNIC,
  //     "ADDRESS": secondNomineeAddress,
  //     "RELATIONSHIP": await getDealUserFieldListValue("UF_CRM_1767356013200", secondNomineeRelationship),
  //     "RELATIONSHIP_WITH": secondNomineeRelationshipWith,
  //     "PHONE": secondNomineePhoneNumber,
  //     "EMAIL": secondNomineeEmail,
  //     "NOMINEE_NATIONALITY": await getDealUserFieldListValue("UF_CRM_1767704499", secondNomineeNationality),
  //     "SECOND_NOMINEE_RELATIONSHIP_WITH_NATURE": await getDealUserFieldListValue("UF_CRM_1767784036", secondNomineeRelationshipWithNature)
  // }

  // var {"UF_CRM_1767356217432": thirdNomineeName, "UF_CRM_1767356265477": thirdNomineeCNIC, "UF_CRM_1767356283656": thirdNomineeAddress, "UF_CRM_1767356395894": thirdNomineeRelationship, "UF_CRM_1767356414639": thirdNomineeRelationshipWith, "UF_CRM_1767709033": thirdNomineePhoneNumber, "UF_CRM_1767709012": thirdNomineeEmail, "UF_CRM_1767709490": thirdNomineeNationality, "UF_CRM_1767784234": thirdNomineeRelationshipWithNature } = dealData;

  // var thirdNomineeData = {
  //     "NAME": thirdNomineeName,
  //     "CNIC": thirdNomineeCNIC,
  //     "ADDRESS": thirdNomineeAddress,
  //     "RELATIONSHIP": await getDealUserFieldListValue("UF_CRM_1767356395894", thirdNomineeRelationship),
  //     "RELATIONSHIP_WITH": thirdNomineeRelationshipWith,
  //     "PHONE": thirdNomineePhoneNumber,
  //     "EMAIL": thirdNomineeEmail,
  //     "NOMINEE_NATIONALITY": await getDealUserFieldListValue("UF_CRM_1767709490", thirdNomineeNationality),
  //     "THIRD_NOMINEE_RELATIONSHIP_WITH_NATURE": await getDealUserFieldListValue("UF_CRM_1767784234", thirdNomineeRelationshipWithNature)
  // }

  // return {firstNomineeData, secondNomineeData, thirdNomineeData};
};
