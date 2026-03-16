import { getProductRows } from "./getProductRows.js";

export const getPaymentDetails = async (dealId, dealData) => {
  const productRows = await getProductRows(dealId);

  const paymentDetails = {
    PRODUCT_ID: productRows.length > 0 ? productRows[0].PRODUCT_ID : null,
    PRICE: productRows.length > 0 ? productRows[0].PRICE_BRUTTO : null,
    PAYMENT_PLAN: dealData.UF_CRM_1767359953127,
    PAYMENT_PLAN_UNITS: dealData.UF_CRM_1767715497,
    DOWN_PAYMENT_PERCENT: dealData.UF_CRM_1766573650,
    POSSESSION_PERCENT: dealData.UF_CRM_1767360946916,
    PAYMENT_START_DATE: dealData.UF_CRM_1767727123846,
    MODE_OF_PAYMENT: dealData.UF_CRM_1767773115009,
    CHEQUE_OR_PAY_ORDER_NUMBER: dealData.UF_CRM_1767773157225,
  };
  return paymentDetails;
};
