export const getProductRows = async (dealId) => {
    // 1. Wrap the callback logic in a Promise
    const result = await new Promise((resolve, reject) => {
        BX24.callMethod(
            "crm.deal.productrows.get", 
            { id: dealId }, 
            function(result) {
                if (result.error()) {
                    // Reject the promise if Bitrix reports an error
                    reject(result.error());
                } else {
                    // Resolve the promise with the data
                    resolve(result.data());
                }
            }
        );
    });

    // 2. Now 'result' holds the actual data array
    // Check if result exists and has length
    return (result && result.length > 0) ? result.length : 0;
};