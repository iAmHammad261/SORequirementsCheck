import { getContactIdOfList } from "../HelperFunctions/getContactIdsListOfDeal.js";
import { checkSalesOrderLink } from "../checkRequirementCondition/checkSalesOrderLink.js";
import { getMoreDealData } from "../HelperFunctions/getMoreDealData.js";
import { checkRequirements } from "../checkRequirementCondition/checkRequirements.js";

export const constructLayoutDto = async (dealId) => {
  BX24.placement.call("lock");

  const contactIdsList = await getContactIdOfList(dealId);
  console.log("Contact IDs List for the Deal:", contactIdsList);

  const dealData = await getMoreDealData(dealId);

  // Call the single validation function
  const {
    success: requirementStatus,
    data: collectedData,
    errors
  } = await checkRequirements(contactIdsList, dealId, dealData);

  // Determine individual statuses based on the absence of errors
  const buyerStatus = !errors.buyerData;
  const nomineeStatus = !errors.nomineeData;
  const paymentStatus = !errors.paymentDetails;

  const salesOrderLinkExists = await checkSalesOrderLink(dealData);

  // Calculate remaining steps dynamically
  const stepsRemaining =
    (!buyerStatus ? 1 : 0) +
    (!nomineeStatus ? 1 : 0) +
    (!paymentStatus ? 1 : 0);

  const layoutDto = {
    blocks: {
      section1: {
        type: "section",
        properties: {
          type: "withBorder",
          title: "Welcome to Our Custom App",
          imageSrc: "https://logowik.com/content/uploads/images/bitrix241512.jpg",
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
            
            // BUYER BLOCK
            buyer_requirement01_heading: {
              type: "text",
              properties: {
                value: buyerStatus
                  ? "1) Buyer information (completed)"
                  : "1) Buyer information (Action Required)",
                size: "lg",
                bold: true,
                color: buyerStatus ? "base_70" : "base_90",
              },
            },
            buyer_requirement01_details: {
              type: "text",
              properties: {
                value: buyerStatus ? "" : errors.buyerData,
                size: "sm",
                multiline: true,
                color: buyerStatus ? "base_70" : "base_90",
              },
            },

            // NOMINEE BLOCK
            nominee_requirement02_heading: {
              type: "text",
              properties: {
                value: nomineeStatus
                  ? "2) Nominee information (completed)"
                  : "2) Nominee information (Action Required)",
                size: "lg",
                bold: true,
                color: nomineeStatus ? "base_70" : "base_90",
              },
            },
            nominee_requirement02_details: {
              type: "text",
              properties: {
                value: nomineeStatus ? "" : errors.nomineeData,
                size: "sm",
                multiline: true,
                color: nomineeStatus ? "base_70" : "base_90",
              },
            },

            // PAYMENT BLOCK
            payment_details_heading: {
              type: "text",
              properties: {
                value: paymentStatus
                  ? "3) Payment details (completed)"
                  : "3) Payment details (Action Required)",
                size: "lg",
                bold: true,
                color: paymentStatus ? "base_70" : "base_90",
              },
            },
            payment_details_requirement03: {
              type: "text",
              properties: {
                value: paymentStatus ? "" : errors.paymentDetails,
                size: "sm",
                multiline: true,
                color: paymentStatus ? "base_70" : "base_90",
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
                      value: requirementStatus
                        ? salesOrderLinkExists
                          ? `Deal is synced with netsuite`
                          : `Click the button to proceed`
                        : `Please complete the remaining ${stepsRemaining} steps to proceed.`,
                      size: "lg",
                      color: requirementStatus ? "success" : "base_90",
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
    primaryButton:
      requirementStatus && !salesOrderLinkExists
        ? { title: "Sync With Netsuite" }
        : null,
  };

  BX24.placement.call("unlock");

  return {
    layoutDto,
    buyerData: collectedData?.buyerData || null,
    nomineeData: collectedData?.nomineeData || null,
    paymentDetails: collectedData?.paymentDetails || null,
  };
};