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

  if (productRows.length == 0)
    messageArray.push(`Product is missing from the deal.`);

  if (productRows.length > 1 && productRows.PRICE_BRUTTO == 0)
    messageArray.push(`Price is missing from the product row.`);

  if (!additionalDealData.UF_CRM_1767359953127)
    messageArray.push(`Payment plan is missing from the deal.`);

  if (
    additionalDealData.UF_CRM_1767359953127 != "533" &&
    additionalDealData.UF_CRM_1767715497 == null
  )
    messageArray.push(`Payment plan units are missing from the deal.`);

  if (
    additionalDealData.UF_CRM_1767359953127 != "533" &&
    additionalDealData.UF_CRM_1767727123846 == null
  )
    messageArray.push(`Downpayment percent is missing from the deal.`);

  if (
    additionalDealData.UF_CRM_1767359953127 != "533" &&
    additionalDealData.UF_CRM_1767727123846 == null
  )
    messageArray.push(`Downpayment amount is missing from the deal.`);

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
