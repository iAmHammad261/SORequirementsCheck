import { getProductRows } from "../HelperFunctions/getProductRows.js";

export const checkPaymentDetailsRequirement = async (dealId, dealData) => {
  var messageForPaymentDetails =
    "Following mandatory fields are missing for the payment details: \n";
  var messageArray = [];

  const [productRows] = await getProductRows(dealId);

  console.log(
    "Additional Deal Data for Payment Details Requirement Check:",
    dealData,
  );

  if (productRows.length == 0) messageArray.push(`Product`);

  if (productRows.length > 1 && productRows.PRICE_BRUTTO == 0)
    messageArray.push(`Price`);

  if (!dealData.UF_CRM_1767359953127)
    messageArray.push(`Payment plan`);

  if (
    dealData.UF_CRM_1767359953127 != "533" &&
    (dealData.UF_CRM_1767715497 == null ||
      dealData.UF_CRM_1767715497 == "")
  )
    messageArray.push(`Payment plan units`);

  if (
    dealData.UF_CRM_1767359953127 != "533" &&
    (dealData.UF_CRM_1766573650 == null ||
      dealData.UF_CRM_1766573650 == "")
  )
    messageArray.push(`Downpayment percent`);

  if (
    dealData.UF_CRM_1767359953127 != "533" &&
    (dealData.UF_CRM_1767360946916 == null ||
      dealData.UF_CRM_1767360946916 == "")
  )
    messageArray.push(`Possession percent`);

  if (
    dealData.UF_CRM_1767727123846 == null ||
    dealData.UF_CRM_1767727123846 == ""
  )
    messageArray.push(`Payment start dates`);

  if (
    dealData.UF_CRM_1767773115009 == null ||
    dealData.UF_CRM_1767773115009 == ""
  )
    messageArray.push(`Mode of payment`);

  if (
    dealData.UF_CRM_1767773157225 == null ||
    dealData.UF_CRM_1767773157225 == ""
  )
    messageArray.push(`Cheque/Pay order no`);

  if (messageArray.length > 0) {
    return {
      status: false,
      heading: messageForPaymentDetails,
      message: messageArray.join("\n"),
    };
  } else {
    return {
      status: true,
      message: "Payment details are complete.",
    };
  }
};
