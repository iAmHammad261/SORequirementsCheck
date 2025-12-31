import { getMoreDealData } from "./getMoreDealData.js";
import { getContactData } from "./getContactData.js";
import { getProductRows } from "./HelperFunctions/getProductRows.js";

export const constructLayoutDto = async (dealId) => {
  const numberOfProductRows = await getProductRows(dealId);
  const additionalDealData = await getMoreDealData(dealId);
  
  // Define salesOrderLink early to use in logic
  const salesOrderLink = additionalDealData["UF_CRM_1766983873725"];
  
  let contactData = {};
  if (additionalDealData["CONTACT_ID"]) {
    contactData = await getContactData(additionalDealData["CONTACT_ID"]);
  }

  // --- Logic for Requirements ---
  const req1 = numberOfProductRows > 0;
  const req2 = contactData['HAS_EMAIL'] === 'Y' && contactData['HAS_PHONE'] === 'Y' && (salesOrderLink || "") !== "";
  const req3 = !!(additionalDealData['UF_CRM_1766573650'] && additionalDealData['UF_CRM_1767092446606']);
  const req4 = additionalDealData['STAGE_ID'] === "WON";

  // Calculate the counter
  const completedCount = [req1, req2, req3, req4].filter(Boolean).length;
  const totalRequirements = 4;
  
  // Logic: All steps done AND no link exists yet
  const isReadyToSync = (completedCount === totalRequirements) && (!salesOrderLink || salesOrderLink === "");

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
            product_requirement01: {
              type: "text",
              properties: {
                value: req1 ? "1) Products in the products section (completed)" : "1) Products in the products section",
                size: "sm",
                color: req1 ? "base_70" : "base_90",
              },
            },
            customerInfo_requirement02: {
              type: "text",
              properties: {
                value: req2 ? "2) Customer information (completed)" : "2) Customer information",
                size: "sm",
                color: req2 ? "base_70" : "base_90",
              },
            },
            DP_IT_requirement03: {
              type: "text",
              properties: {
                value: req3 ? "3) Down Payment & Fees (completed)" : "3) Down Payment & Fees",
                size: "sm",
                color: req3 ? "base_70" : "base_90",
              },
            },
            Deal_final_stage_requirement04: {
              type: "text",
              properties: {
                value: req4 ? "4) Close Deal Stage (completed)" : "4) Close Deal Stage",
                size: "sm",
                color: req4 ? "base_70" : "base_90",
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
                      value: salesOrderLink ? "✅ Sync Completed" : `Progress: ${completedCount} / ${totalRequirements}`,
                      size: "lg",
                      color: salesOrderLink ? "success" : "base_90",
                      bold: true
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
    primaryButton: isReadyToSync ? { title: "Sync With Netsuite" } : null,
  };

  return layoutDto;
};