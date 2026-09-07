import { getProductRows } from "./getProductRows.js";

const parseJsonField = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getPaymentDetails = async (dealId, dealData) => {
  const productRows = await getProductRows(dealId);

  const planData = parseJsonField(dealData.UF_CRM_1785469114);
  const installmentData = parseJsonField(dealData.UF_CRM_1785782153277);

  const planType = planData?.paymentPlan?.planType;
  const totalPrice = planData?.paymentPlan?.valueSnapshot?.totalPrice;

  let paymentStartDate;
  if (planType === "custom") {
    paymentStartDate = installmentData?.rows?.[0]?.isoDate;
  } else if (planType === "standard") {
    paymentStartDate = planData?.paymentPlan?.downPaymentDate;
  }

  const paymentDetails = {
    PRODUCT_ID: productRows.length > 0 ? productRows[0].PRODUCT_ID : null,
    PRICE: totalPrice,
    PAYMENT_PLAN: planType,
    PAYMENT_PLAN_UNITS: dealData.UF_CRM_1767715497,
    DOWN_PAYMENT_PERCENT: dealData.UF_CRM_1766573650,
    POSSESSION_PERCENT: dealData.UF_CRM_1767360946916,
    DOWN_PAYMENT_DATE: dealData.UF_CRM_1781081933954,
    POSESSION_PAYMENT_DATE: dealData.UF_CRM_1781081947364,
    PAYMENT_START_DATE: paymentStartDate,
    MODE_OF_PAYMENT: dealData.UF_CRM_1767773115009,
    BALLON_PAYMENT: dealData.UF_CRM_1781002959418,
    CHEQUE_OR_PAY_ORDER_NUMBER: dealData.UF_CRM_1767773157225,
    PRICE_CALCULATION_MODE: dealData.UF_CRM_1775547541216,
    paymentPlanTable: dealData.UF_CRM_1785782153277,
  };
  return paymentDetails;
};
