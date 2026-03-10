export const onButtonClick = async (buyerData, nomineeData, paymentDetails) => {
    console.log("Primary button was clicked. Executing onButtonClick handler.");

    console.log("Received data in onButtonClick handler:");
    console.log("Buyer Data:", buyerData);
    console.log("Nominee Data:", nomineeData);
    console.log("Payment Details:", paymentDetails);

}