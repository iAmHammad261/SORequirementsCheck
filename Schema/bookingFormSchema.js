/**
 * Must match the booking form schema defined in the backend code
 */

import { z } from "https://esm.sh/zod";

const phoneRegexWithSpaces = /^\+?[0-9\s]{10,20}$/;

const requiredString = (label) =>
  z
    .string({
      error: (iss) =>
        iss.input == undefined || iss.input === null || iss.input === ""
          ? `${label} is required`
          : `${label} must be a string`,
    })
    .min(1, `${label} cannot be empty`);

const requiredNumber = (label, min = 1) =>
  z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce
      .number({
        error: (iss) =>
          iss.input == null
            ? `${label} is required`
            : `${label} must be a valid number`,
      })
      .min(min, `${label} is required`)
  );

const requiredUrl = (label) =>
  z.url({
    error: (iss) =>
      iss.input == undefined || iss.input === "" || iss.input === null
        ? `${label} is required`
        : `Invalid URL format for ${label}`,
  });

const requiredDate = (label) =>
  z.coerce.date({
    error: (iss) =>
      iss.input == undefined || iss.input === "" || iss.input === null
        ? `${label} is required`
        : `Invalid date format for ${label}`,
  });

const phoneSchema = z
  .string()
  .regex(phoneRegexWithSpaces, "Invalid phone number format")
  .transform((val) => val.replace(/\s+/g, ""));

const optionalPercent = (label) =>
  z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : val,
    z.coerce
      .number({
        message: `${label} must be a valid number`, 
      })
      .min(1, `${label} must be between 1 and 100`)
      .max(100, `${label} must be between 1 and 100`)
      .optional()
  );

const basePersonSchema = z.object({
  NAME: requiredString("Name"),
  HUMAN_RELATIONSHIP_WITH_NATURE: requiredNumber("Relationship Type"),
  HUMAN_RELATIONSHIP_NAME: requiredString("Relationship Name"),
  CURRENT_ADDRESS: requiredString("Current Address"),
  IDENTIFICATION_DOCUMENT_TYPE: requiredNumber("Identification Document Type"),
  IDENTIFICATION_DOCUMENT_NUMBER: requiredString(
    "Identification Document Number"
  ),
  EMAIL: z.email({
    error: (iss) =>
      iss.input == undefined || iss.input === "" || iss.input === null
        ? "Email is required"
        : "Invalid email format",
  }),
  PHONE: phoneSchema,
  NATIONALITY: requiredNumber("Nationality"),
  DOCUMENT_FIRST_PAGE: requiredUrl("First Document Page"),
  DOCUMENT_SECOND_PAGE: z
    .url("Invalid URL format for Second Document Page")
    .or(z.literal(""))
    .nullable()
    .optional(),
});

const buyerDataSchema = basePersonSchema.extend({
  PERMANENT_ADDRESS: requiredString("Permanent Address"),
  ALTERNATIVE_EMAIL: z
    .email("Alternative email must be a valid email format")
    .nullable()
    .optional(),
  ALTERNATIVE_PHONE_NUMBER: phoneSchema.or(z.literal("")).nullable().optional(),
  DATE_OF_BIRTH: requiredDate("Date of Birth"),
  BUYER_IMAGE: requiredUrl("Buyer Image"),
  GENDER: requiredNumber("Gender"),
  OCCUPATION: requiredString("Occupation"),
});

const nomineeDataSchema = basePersonSchema.extend({
  RELATIONSHIP: requiredString("Relationship"),
  NOMINEE_IMAGE: requiredUrl("Nominee Image"),
});

const paymentDetailsSchema = z
  .object({
    PAYMENT_PLAN: requiredNumber("Payment Plan"),
    PAYMENT_PLAN_UNITS: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? undefined : val,
      z.coerce
        .number({
          message: "Payment Plan Units can not be empty",
        })
        .min(1, "Payment Plan Units cannot be zero")
        .optional()
    ),
    MODE_OF_PAYMENT: requiredNumber("Mode of Payment"),
    CHEQUE_OR_PAY_ORDER_NUMBER: requiredString("Cheque/Pay Order Number"),
    DOWN_PAYMENT_PERCENT: optionalPercent("Downpayment Percent"),
    POSSESSION_PERCENT: optionalPercent("Possession Percent"),
    PRICE: requiredNumber("Price"),
    PRODUCT_ID: requiredNumber("Product ID"),
    PAYMENT_START_DATE: requiredDate("Payment Start Date"),
  })
  .superRefine((data, ctx) => {
    if (Number(data.PAYMENT_PLAN) !== 533) {
      
      const validateNumericField = (val, path, label) => {
        const num = Number(val);

        if (val === undefined || val === null || val === "") {
          ctx.addIssue({
            code: "custom",
            message: `${label} is required for this payment mode`,
            path: [path],
          });
        } else if (isNaN(num)) {
          ctx.addIssue({
            code: "custom",
            message: `${label} must be a valid number`,
            path: [path],
          });
        } else if (num < 1 || num > 100) {
          ctx.addIssue({
            code: "custom",
            message: `${label} must be between 1 and 100`,
            path: [path],
          });
        }
      };

      validateNumericField(
        data.DOWN_PAYMENT_PERCENT,
        "DOWN_PAYMENT_PERCENT",
        "Downpayment Percent"
      );
      validateNumericField(
        data.POSSESSION_PERCENT,
        "POSSESSION_PERCENT",
        "Possession Percent"
      );

      const unitNum = Number(data.PAYMENT_PLAN_UNITS);
      if (
        data.PAYMENT_PLAN_UNITS === undefined ||
        data.PAYMENT_PLAN_UNITS === null ||
        unitNum === 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Payment Plan Units are required and cannot be zero",
          path: ["PAYMENT_PLAN_UNITS"],
        });
      } else if (isNaN(unitNum)) {
        ctx.addIssue({
          code: "custom",
          message: "Payment Plan Units must be a valid number",
          path: ["PAYMENT_PLAN_UNITS"],
        });
      }
    }
  });

export const bookingFormDataSchema = z.object({
  buyerData: z.preprocess(
    (val) => (val === undefined || val === null ? [] : val),
    z.array(buyerDataSchema).min(1, "At least one buyer is required")
  ),
  nomineeData: z.preprocess(
    (val) => (val === undefined || val === null ? [] : val),
    z.array(nomineeDataSchema).min(1, "At least one nominee is required")
  ),
  paymentDetails: z
    .any()
    .refine(
      (val) => val !== undefined && val !== null,
      "Payment details are required" 
    )
    .pipe(paymentDetailsSchema),
});