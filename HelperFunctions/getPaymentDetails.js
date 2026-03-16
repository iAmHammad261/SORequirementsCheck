import { getProductRows } from "./getProductRows.js";

export const getPaymentDetails = async (dealId, dealData) => {
  const productRows = await getProductRows(dealId);

  const paymentDetails = {
    productID: productRows.length > 0 ? productRows[0].PRODUCT_ID : null,
    price: productRows.length > 0 ? productRows[0].PRICE_BRUTTO : null,
    paymentPlan: dealData.UF_CRM_1767359953127,
    paymentPlanUnits: dealData.UF_CRM_1767715497,
    downpaymentPercent: dealData.UF_CRM_1766573650,
    possessionPercent: dealData.UF_CRM_1767360946916,
    paymentStartDates: dealData.UF_CRM_1767727123846,
    modeOfPayment: dealData.UF_CRM_1767773115009,
    chequePayOrderNo: dealData.UF_CRM_1767773157225,
  };
  return paymentDetails;
};
