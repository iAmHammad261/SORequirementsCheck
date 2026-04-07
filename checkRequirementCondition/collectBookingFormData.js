import { getBuyerData } from "../HelperFunctions/getBuyerData.js";
import { getNomineeData } from "../HelperFunctions/getNomineeData.js";
import { getPaymentDetails } from "../HelperFunctions/getPaymentDetails.js";
import { getMoreDealData } from "../HelperFunctions/getMoreDealData.js";
import { getContactIdOfList } from "../HelperFunctions/getContactIdsListOfDeal.js";

export const collectData = async (dealData) => {
  const dealId = BX24.placement.info().options.entityId;
  const [contactIdList, dealData] = await Promise.all([
    getContactIdOfList(dealId),
    getMoreDealData(dealId),
  ]);
  
  const [buyerData, nomineeData, paymentDetails] = await Promise.all([
    getBuyerData(contactIdList),
    getNomineeData(contactIdList),
    getPaymentDetails(dealId, dealData),
  ]);

  return {
    buyerData,
    nomineeData,
    paymentDetails,
  };
};
