export const onButtonClick = async (buyerData, nomineeData, paymentDetails) => {
  BX24.placement.call("lock");

  const API_URL =
    "https://bookingformtosalesorder.premierchoiceint.online/create-booking-form";

  console.log("Primary button was clicked. Executing onButtonClick handler.");
  console.log("Received data in onButtonClick handler:");
  console.log("Buyer Data:", buyerData);
  console.log("Nominee Data:", nomineeData);
  console.log("Payment Details:", paymentDetails);

  const combinedData = {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Response from backend:", result);

    BX24.placement.call("unlock");
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    BX24.placement.call("unlock");
  }
};
