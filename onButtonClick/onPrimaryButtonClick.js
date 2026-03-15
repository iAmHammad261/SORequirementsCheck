export const onButtonClick = async (buyerData, nomineeData, paymentDetails) => {

    const apiURL = 'https://bookingformtosalesorder.premierchoiceint.online/create-booking-form'





    console.log("Primary button was clicked. Executing onButtonClick handler.");
    console.log("Received data in onButtonClick handler:");
    console.log("Buyer Data:", buyerData);
    console.log("Nominee Data:", nomineeData);
    console.log("Payment Details:", paymentDetails);


    const combinedData = {
        buyerData,
        nomineeData,
        paymentDetails
    };

    console.log("Combined Data to send to backend:", combinedData);

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(combinedData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Response from backend:", result);
    } catch (error) {
        console.error("Error occurred while fetching data:", error);
    }

}