import { getContactIdOfList } from "../HelperFunctions/getContactIdsListOfDeal.js";
import { checkBuyerRequirement } from "../checkRequirementCondition/checkBuyerRequirement.js";

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

  const firstRequirementCheck = await checkBuyerRequirement(contactIdsList);

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
            // Only Requirement 1 remains
            buyer_requirement01: {
              type: "text",
              properties: {
                value: firstRequirementCheck.status
                  ? "1) Buyer information (completed)"
                  : `${firstRequirementCheck.message}`,
                size: "sm",
                color: firstRequirementCheck.status ? "base_70" : "base_90",
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
                      color: salesOrderLink ? "success" : "base_90",
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
    // The button disappears if the link exists OR if requirements aren't met
    // primaryButton: isReadyToSync ? { title: "Sync With Netsuite" } : null,
  };

  return layoutDto;
};
