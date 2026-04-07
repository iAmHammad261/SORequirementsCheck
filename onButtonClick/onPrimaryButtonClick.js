import { constructLayoutDto } from "../ConstructLayout/constructLayoutDto.js";

const buildSuccessLayout = (message) => ({
  blocks: {
    section1: {
      type: "section",
      properties: {
        type: "withBorder",
        title: "Success",
        blocks: {
          successHeading: {
            type: "text",
            properties: {
              value: "✅ Operation Successful",
              size: "xl",
              bold: true,
              color: "success",
            },
          },
          successDetails: {
            type: "text",
            properties: {
              value: message,
              size: "sm",
              multiline: true,
              color: "base_70",
            },
          },
        },
      },
    },
  },
  primaryButton: null,
});

const buildErrorLayout = (message) => ({
  blocks: {
    section1: {
      type: "section",
      properties: {
        type: "withBorder",
        title: "Error",
        blocks: {
          errorHeading: {
            type: "text",
            properties: {
              value: "⚠️ Operation Failed",
              size: "xl",
              bold: true,
              color: "base_90",
            },
          },
          errorDetails: {
            type: "text",
            properties: {
              value: message,
              size: "sm",
              multiline: true,
              color: "base_90",
            },
          },
          revertNote: {
            type: "text",
            properties: {
              value: "Reverting in a few seconds...",
              size: "sm",
              color: "base_70",
            },
          },
        },
      },
    },
  },
  primaryButton: null,
});

export const onButtonClick = async (buyerData, nomineeData, paymentDetails) => {
  const dealId = BX24.placement.info().options.entityId;
  BX24.placement.call("lock");
 
  const API_URL =
    "https://bookingformtosalesorder.premierchoiceint.online/create-booking-form";

  console.log("Primary button was clicked. Executing onButtonClick handler.");
  console.log("Received data in onButtonClick handler:");
  console.log("Buyer Data:", buyerData);
  console.log("Nominee Data:", nomineeData);
  console.log("Payment Details:", paymentDetails);

  const combinedData = {
    dealId,
    buyerData,
    nomineeData,
    paymentDetails,
  };

  console.log("Combined Data to send to backend:", combinedData);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(combinedData),
    });

    const result = await response.json();

    if (!response.ok) {
      BX24.placement.call(
        "setLayout",
        buildErrorLayout(
          result.details || result.error || "Something went wrong",
        ),
        null,
      );

      setTimeout(async () => {
        const { layoutDto: newLayoutDto } = await constructLayoutDto();
        BX24.placement.call("setLayout", newLayoutDto, null);
      }, 2500);

      BX24.placement.call("unlock");

      return;
    }

    if (response.ok) {
      const { salesOrderId, uploadSummary, allFilesSuccessful } = result.result;

      const successMessage =
        `Sales Order ID: ${salesOrderId}\n` +
        `Files Uploaded: ${allFilesSuccessful ? "All Successful" : "Some Failed"}\n` +
        `${uploadSummary.join("\n")}`;

      BX24.placement.call(
        "setLayout",
        buildSuccessLayout(successMessage),
        null,
      );

      setTimeout(async () => {
        const { layoutDto: newLayoutDto } = await constructLayoutDto();
        BX24.placement.call("setLayout", newLayoutDto, null);
      }, 2500);

      BX24.placement.call("unlock");

      return;
    }
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    BX24.placement.call("unlock");
  }
};
