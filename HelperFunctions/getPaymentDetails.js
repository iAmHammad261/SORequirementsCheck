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
  const installmentRows = installmentData?.rows ?? [];

  const planType = planData?.paymentPlan?.planType;
  const totalPrice = planData?.paymentPlan?.valueSnapshot?.totalPrice;

  let paymentStartDate;
  if (planType === "custom") {
    paymentStartDate = installmentRows[0]?.date;
  } else if (planType === "standard") {
    paymentStartDate = planData?.paymentPlan?.downPaymentDate;
  }

  const possessionPaymentDate =
    installmentRows[installmentRows.length - 1]?.date;

  const paymentDetails = {
    PRODUCT_ID: productRows.length > 0 ? productRows[0].PRODUCT_ID : null,
    PRICE: totalPrice,
    PAYMENT_PLAN: planType,
    PAYMENT_PLAN_UNITS: dealData.UF_CRM_1767715497,
    DOWN_PAYMENT_PERCENT: dealData.UF_CRM_1766573650,
    POSSESSION_PERCENT: dealData.UF_CRM_1767360946916,
    DOWN_PAYMENT_DATE: paymentStartDate,
    POSESSION_PAYMENT_DATE: possessionPaymentDate,
    PAYMENT_START_DATE: paymentStartDate,
    MODE_OF_PAYMENT: dealData.UF_CRM_1767773115009,
    BALLON_PAYMENT: dealData.UF_CRM_1781002959418,
    CHEQUE_OR_PAY_ORDER_NUMBER: dealData.UF_CRM_1767773157225,
    PRICE_CALCULATION_MODE: dealData.UF_CRM_1775547541216,
    paymentPlanTable: dealData.UF_CRM_1785782153277,
  };
  return paymentDetails;
};
