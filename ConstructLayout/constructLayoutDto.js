import { getContactIdOfList } from "../HelperFunctions/getContactIdsListOfDeal.js";
import { checkBuyerRequirement } from "../checkRequirementCondition/checkBuyerRequirement.js";
import { checkNomineeRequirement } from "../checkRequirementCondition/checkNomineeRequirement.js";
import { checkPaymentDetailsRequirement } from "../checkRequirementCondition/checkPaymentDetailsRequirement.js";
import { checkSalesOrderLink } from "../checkRequirementCondition/checkSalesOrderLink.js";
import { getMoreDealData } from "../HelperFunctions/getMoreDealData.js";
// const fetchTheTextInfo = (salesOrderLink, isReadyToSync, completedCount, totalRequirements) => {

//   if(!isReadyToSync)
//     return `Steps remaining to complete sales order checklist: ${completedCount} / ${totalRequirements}`

//   if(isReadyToSync && salesOrderLink == "")
//     return "Deal is ready to be synced with Netsuite."

//   if(salesOrderLink && salesOrderLink !== "")
//     return "Sync has been completed successfully with Netsuite."

// }

export const constructLayoutDto = async (dealId) => {
  const contactIdsList = await getContactIdOfList(dealId);
  console.log("Contact IDs List for the Deal:", contactIdsList);

    // const buyerRequirementCheck = await checkBuyerRequirement(contactIdsList);
    // const nomineeRequirementCheck = await checkNomineeRequirement(contactIdsList);
    // const paymentDetailsRequirementCheck = await checkPaymentDetailsRequirements(dealId);

    const dealData = await getMoreDealData(dealId);


  const [buyerRequirementCheck, nomineeRequirementCheck, paymentDetailsRequirementCheck] = await Promise.all([
    checkBuyerRequirement(contactIdsList),
    checkNomineeRequirement(contactIdsList),
    checkPaymentDetailsRequirement(dealId, dealData)
  ]);

  const requirementStatus = buyerRequirementCheck.status && nomineeRequirementCheck.status && paymentDetailsRequirementCheck.status;

  const salesOrderLinkExists = await checkSalesOrderLink(dealData);


  // const [numberOfProductRows, additionalDealData] = await Promise.all([
  //   getProductRows(dealId),
  //   getMoreDealData(dealId)
  // ]);

  // // Define salesOrderLink early to use in logic
  // const salesOrderLink = additionalDealData["UF_CRM_1767161134530"];

  // let contactData = {};
  // if (additionalDealData["CONTACT_ID"]) {
  //   contactData = await getContactData(additionalDealData["CONTACT_ID"]);
  // }

  // // --- Logic for Requirements ---
  // const req1 = numberOfProductRows > 0;
  // const req2 = contactData['HAS_EMAIL'] === 'Y' && contactData['HAS_PHONE'] === 'Y' && additionalDealData['UF_CRM_1766983873725'] != "";
  // const req3 = !!(additionalDealData['UF_CRM_1766573650'] && additionalDealData['UF_CRM_1767092446606']);
  // const req4 = additionalDealData['STAGE_ID'] === "WON";

  // // Calculate the counter
  // const completedCount = [req1, req2, req3, req4].filter(Boolean).length;
  // const totalRequirements = 4;

  // // Logic: All steps done AND no link exists yet
  // const isReadyToSync = (completedCount === totalRequirements) && (!salesOrderLink || salesOrderLink === "");

  const layoutDto = {
    blocks: {
      section1: {
        type: "section",
        properties: {
          type: "withBorder",
          title: "Welcome to Our Custom App",
          imageSrc:
            "https://logowik.com/content/uploads/images/bitrix241512.jpg",
          blocks: {
            mainHeading: {
              type: "text",
              properties: {
                value: "Sales Order Creation Checklist",
                size: "xl",
                bold: true,
                color: "base_90",
              },
            },
            buyer_requirement01_heading: {
              type: "text",
              properties: {
                value: buyerRequirementCheck.status
                  ? "1) Buyer information (completed)"
                  : `${buyerRequirementCheck.heading}`,
                size: "lg",
                bold: true,
                color: buyerRequirementCheck.status ? "base_70" : "base_90",
              },
            },
            buyer_requirement01_details: {
              type: "text",
              properties: {
                value: buyerRequirementCheck.status
                  ? ""
                  : `${buyerRequirementCheck.message}`,
                size: "sm",
                multiline: true,
                color: buyerRequirementCheck.status ? "base_70" : "base_90",
              },
            },
            nominee_requirement02_heading: {
              type: "text",
              properties: {
                value: nomineeRequirementCheck.status
                  ? "2) Nominee information (completed)"
                  : `${nomineeRequirementCheck.heading}`,
                size: "lg",
                bold: true,
                color: nomineeRequirementCheck.status ? "base_70" : "base_90",
              },
            },
             nominee_requirement02_details: {
              type: "text",
              properties: {
                value: nomineeRequirementCheck.status
                  ? ""
                  : `${nomineeRequirementCheck.message}`,
                size: "sm",
                multiline: true,
                color: nomineeRequirementCheck.status ? "base_70" : "base_90",
              },
            },
            payment_details_heading: {
              type: "text",
              properties: {
                value: paymentDetailsRequirementCheck.status
                  ? "3) Payment details (completed)"
                  : `${paymentDetailsRequirementCheck.heading}`,
                size: "lg",
                bold: true,
                color: paymentDetailsRequirementCheck.status ? "base_70" : "base_90",
              },
            },
            payment_details_requirement03: {
              type: "text",
              properties: {
                value: paymentDetailsRequirementCheck.status
                  ? ""
                  : `${paymentDetailsRequirementCheck.message}`,
                size: "sm",
                multiline: true,
                color: paymentDetailsRequirementCheck.status ? "base_70" : "base_90",
              },
            },
          },

        },
      },
      section2: {
        type: "section",
        properties: {
          type: "default",
          blocks: {
            infoTextForRemaining: {
              type: "lineOfBlocks",
              properties: {
                blocks: {
                  textmain: {
                    type: "text",
                    properties: {
                      value: "Please complete the remaining steps to proceed.",
                      size: "lg",
                      color: true ? "success" : "base_90",
                      bold: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    primaryButton: (requirementStatus && !salesOrderLinkExists) ? { title: "Sync With Netsuite" } : null,
  };

  return layoutDto;
};
