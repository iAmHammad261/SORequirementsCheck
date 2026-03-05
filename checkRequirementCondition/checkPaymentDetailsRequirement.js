import { getProductRows } from "../HelperFunctions/getProductRows.js";
import { getMoreDealData } from "../HelperFunctions/getMoreDealData.js";


export const checkPaymentDetailsRequirement = async (dealId) => {
  var messageForPaymentDetails =
    "Following mandatory fields are missing for the payment details: \n";
  var messageArray = [];

  const [productRows, additionalDealData] = await Promise.all([
    getProductRows(dealId),
    getMoreDealData(dealId),
  ]);


  console.log("Additional Deal Data for Payment Details Requirement Check:", additionalDealData);

  if (productRows.length == 0)
    messageArray.push(`Product`);

  if (productRows.length > 1 && productRows.PRICE_BRUTTO == 0)
    messageArray.push(`Price`);

  if (!additionalDealData.UF_CRM_1767359953127)
    messageArray.push(`Payment plan`);

  if (
    additionalDealData.UF_CRM_1767359953127 != "533" &&
    additionalDealData.UF_CRM_1767715497 == null
  )
    messageArray.push(`Payment plan units`);

  if (
    additionalDealData.UF_CRM_1767359953127 != "533" &&
    additionalDealData.UF_CRM_1767727123846 == null
  )
    messageArray.push(`Downpayment percent`);

  if (
    additionalDealData.UF_CRM_1767359953127 != "533" &&
    additionalDealData.UF_CRM_1767360946916 == null
  )
    messageArray.push(`Possession percent`);

  if (messageArray.length > 0) {
    return {
      status: false,
      message: messageForPaymentDetails + messageArray.join("\n"),
    };
  } else {
    return {
      status: true,
      message: "Payment details are complete.",
    };
  }
};
